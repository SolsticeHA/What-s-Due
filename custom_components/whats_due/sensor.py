"""Dynamic sensor entities for each What's Due item."""
from __future__ import annotations

from datetime import datetime
from typing import Any

from homeassistant.components.sensor import SensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.event import async_track_time_change

from .const import DOMAIN, SIGNAL_ITEMS_UPDATED
from .storage import WhatsDueStore, get_store


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up sensor entities — one per item — and keep them in sync."""
    store = get_store(hass)

    known: dict[str, WhatsDueSensor] = {}

    @callback
    def _sync() -> None:
        current_ids = {item["id"] for item in store.raw_items()}

        to_add: list[WhatsDueSensor] = []
        for item in store.items():
            if item["id"] not in known:
                entity = WhatsDueSensor(store, item["id"])
                known[item["id"]] = entity
                to_add.append(entity)
            else:
                known[item["id"]].async_schedule_update_ha_state()
        if to_add:
            async_add_entities(to_add)

        for item_id in list(known):
            if item_id not in current_ids:
                entity = known.pop(item_id)
                hass.async_create_task(entity.async_remove(force_remove=True))

    _sync()

    entry.async_on_unload(
        async_dispatcher_connect(hass, SIGNAL_ITEMS_UPDATED, _sync)
    )

    # Fire status-change events once at startup so automations catch up.
    hass.async_create_task(store.async_tick_statuses())

    # Recompute once a day at 00:00:01 so days_until_due stays fresh and we
    # fire any transitions that happened overnight.
    @callback
    def _midnight(_now: datetime) -> None:
        for entity in known.values():
            entity.async_schedule_update_ha_state()
        hass.async_create_task(store.async_tick_statuses())

    entry.async_on_unload(
        async_track_time_change(hass, _midnight, hour=0, minute=0, second=1)
    )


class WhatsDueSensor(SensorEntity):
    """Sensor whose state is the number of days until the item's due date."""

    _attr_has_entity_name = False
    _attr_should_poll = False
    _attr_native_unit_of_measurement = "days"

    def __init__(self, store: WhatsDueStore, item_id: str) -> None:
        self._store = store
        self._item_id = item_id
        self._attr_unique_id = f"{DOMAIN}_{item_id}"

    def _current(self) -> dict[str, Any] | None:
        for item in self._store.items():
            if item["id"] == self._item_id:
                return item
        return None

    @property
    def available(self) -> bool:
        return self._current() is not None

    @property
    def name(self) -> str:
        item = self._current()
        return f"What's Due: {item['name']}" if item else "What's Due: (unknown)"

    @property
    def icon(self) -> str | None:
        item = self._current()
        return item.get("icon") if item else None

    @property
    def native_value(self) -> int | None:
        item = self._current()
        return item["days_until_due"] if item else None

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        item = self._current()
        if not item:
            return {}
        return {
            "item_id": item["id"],
            "due_date": item["due_date"],
            "category_id": item.get("category_id"),
            "recurrence": item.get("recurrence"),
            "status": item["status"],
            "notes": item.get("notes"),
        }

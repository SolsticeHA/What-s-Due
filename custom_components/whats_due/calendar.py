"""Calendar entity exposing What's Due items to Lovelace's calendar card."""
from __future__ import annotations

from datetime import date, datetime, timedelta
from typing import Any

from homeassistant.components.calendar import CalendarEntity, CalendarEvent
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import DOMAIN, SIGNAL_ITEMS_UPDATED
from .storage import WhatsDueStore, get_store


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the calendar entity."""
    store = get_store(hass)
    entity = WhatsDueCalendar(store)
    async_add_entities([entity])

    entry.async_on_unload(
        async_dispatcher_connect(
            hass,
            SIGNAL_ITEMS_UPDATED,
            entity.async_schedule_update_ha_state,
        )
    )


class WhatsDueCalendar(CalendarEntity):
    """A single calendar entity aggregating every non-completed item."""

    _attr_has_entity_name = False
    _attr_should_poll = False
    _attr_icon = "mdi:calendar-clock"

    def __init__(self, store: WhatsDueStore) -> None:
        self._store = store
        self._attr_name = "What's Due"
        self._attr_unique_id = f"{DOMAIN}_calendar"

    def _active_items(self) -> list[dict[str, Any]]:
        return [
            i
            for i in self._store.items()
            if not i.get("completed_at")
        ]

    @property
    def event(self) -> CalendarEvent | None:
        """Return the next upcoming event (nearest due_date)."""
        items = sorted(self._active_items(), key=lambda i: i["due_date"])
        if not items:
            return None
        return _item_to_event(items[0])

    async def async_get_events(
        self,
        hass: HomeAssistant,
        start_date: datetime,
        end_date: datetime,
    ) -> list[CalendarEvent]:
        """Return events that fall within the given window."""
        start = start_date.date() if isinstance(start_date, datetime) else start_date
        end = end_date.date() if isinstance(end_date, datetime) else end_date
        events: list[CalendarEvent] = []
        for item in self._active_items():
            due = date.fromisoformat(item["due_date"])
            if start <= due <= end:
                events.append(_item_to_event(item))
        return events


def _item_to_event(item: dict[str, Any]) -> CalendarEvent:
    due = date.fromisoformat(item["due_date"])
    summary = item["name"]
    status = item.get("status")
    if status and status != "ok":
        summary = f"[{status}] {summary}"
    return CalendarEvent(
        start=due,
        end=due + timedelta(days=1),
        summary=summary,
        description=item.get("notes") or "",
        uid=f"{DOMAIN}-{item['id']}",
    )

"""Storage layer for What's Due — items, categories, settings."""
from __future__ import annotations

from datetime import date, datetime
from typing import Any
import uuid

from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.helpers.storage import Store

from .const import (
    DEFAULT_CATEGORIES,
    DEFAULT_CRITICAL_DAYS,
    DEFAULT_URGENT_DAYS,
    DEFAULT_WARNING_DAYS,
    DOMAIN,
    EVENT_STATUS_CHANGED,
    RECURRENCE_CUSTOM,
    RECURRENCE_MONTHLY,
    RECURRENCE_NONE,
    RECURRENCE_YEARLY,
    SIGNAL_ITEMS_UPDATED,
    STATUS_CRITICAL,
    STATUS_EXPIRED,
    STATUS_OK,
    STATUS_URGENT,
    STATUS_WARNING,
    STORAGE_KEY,
    STORAGE_VERSION,
)


def _default_settings() -> dict[str, Any]:
    return {
        "warning_days": DEFAULT_WARNING_DAYS,
        "urgent_days": DEFAULT_URGENT_DAYS,
        "critical_days": DEFAULT_CRITICAL_DAYS,
    }


def _today() -> date:
    return datetime.now().date()


def _parse_date(value: str) -> date:
    return date.fromisoformat(value)


def _advance_date(d: date, recurrence: str, custom_days: int | None) -> date:
    """Return the next occurrence after d based on recurrence type."""
    if recurrence == RECURRENCE_MONTHLY:
        month = d.month + 1
        year = d.year + (month - 1) // 12
        month = ((month - 1) % 12) + 1
        try:
            return date(year, month, d.day)
        except ValueError:
            # day doesn't exist in target month — clamp to last day
            if month == 12:
                next_month_first = date(year + 1, 1, 1)
            else:
                next_month_first = date(year, month + 1, 1)
            from datetime import timedelta
            return next_month_first - timedelta(days=1)
    if recurrence == RECURRENCE_YEARLY:
        try:
            return date(d.year + 1, d.month, d.day)
        except ValueError:
            return date(d.year + 1, d.month, 28)
    if recurrence == RECURRENCE_CUSTOM and custom_days:
        from datetime import timedelta
        return d + timedelta(days=int(custom_days))
    return d


class WhatsDueStore:
    """Wraps hass.helpers.storage.Store for items + categories + settings."""

    def __init__(self, hass: HomeAssistant) -> None:
        self.hass = hass
        self._store: Store = Store(hass, STORAGE_VERSION, STORAGE_KEY)
        self._data: dict[str, Any] = {
            "items": [],
            "categories": [],
            "settings": _default_settings(),
        }

    async def async_load(self) -> None:
        loaded = await self._store.async_load()
        if loaded is None:
            self._data["categories"] = [dict(c) for c in DEFAULT_CATEGORIES]
            await self._save()
        else:
            self._data["items"] = loaded.get("items", [])
            self._data["categories"] = loaded.get("categories") or [
                dict(c) for c in DEFAULT_CATEGORIES
            ]
            self._data["settings"] = {
                **_default_settings(),
                **(loaded.get("settings") or {}),
            }

    async def _save(self) -> None:
        await self._store.async_save(self._data)
        async_dispatcher_send(self.hass, SIGNAL_ITEMS_UPDATED)

    async def async_tick_statuses(self) -> None:
        """Recompute statuses and fire events for items whose status changed.

        Called daily from the sensor platform (midnight) and after any change
        to items or thresholds. Each item stores its `last_status`; we diff
        against the freshly computed value and emit on the event bus.
        """
        dirty = False
        for item in self._data["items"]:
            decorated = self._decorate(item)
            prev = item.get("last_status")
            now = decorated["status"]
            if prev != now:
                self.hass.bus.async_fire(
                    EVENT_STATUS_CHANGED,
                    {
                        "item_id": item["id"],
                        "name": item["name"],
                        "category_id": item.get("category_id"),
                        "status": now,
                        "previous_status": prev,
                        "days_until_due": decorated["days_until_due"],
                        "due_date": item["due_date"],
                    },
                )
                item["last_status"] = now
                dirty = True
        if dirty:
            # persist last_status but don't re-dispatch items_updated to avoid
            # triggering re-renders that would run this method again
            await self._store.async_save(self._data)

    # ---------- items ----------

    @callback
    def items(self) -> list[dict[str, Any]]:
        return [self._decorate(i) for i in self._data["items"]]

    @callback
    def raw_items(self) -> list[dict[str, Any]]:
        return list(self._data["items"])

    async def async_add_item(self, payload: dict[str, Any]) -> dict[str, Any]:
        item = {
            "id": uuid.uuid4().hex,
            "name": payload["name"],
            "due_date": payload["due_date"],
            "category_id": payload.get("category_id") or "other",
            "icon": payload.get("icon") or "mdi:calendar",
            "notes": payload.get("notes") or "",
            "recurrence": payload.get("recurrence") or RECURRENCE_NONE,
            "recurrence_days": payload.get("recurrence_days"),
            "alert_overrides": payload.get("alert_overrides") or None,
            "created_at": datetime.now().isoformat(timespec="seconds"),
        }
        self._data["items"].append(item)
        await self._save()
        return self._decorate(item)

    async def async_update_item(
        self, item_id: str, payload: dict[str, Any]
    ) -> dict[str, Any] | None:
        for idx, existing in enumerate(self._data["items"]):
            if existing["id"] == item_id:
                updated = {**existing, **payload, "id": item_id}
                self._data["items"][idx] = updated
                await self._save()
                return self._decorate(updated)
        return None

    async def async_delete_item(self, item_id: str) -> bool:
        before = len(self._data["items"])
        self._data["items"] = [i for i in self._data["items"] if i["id"] != item_id]
        if len(self._data["items"]) == before:
            return False
        await self._save()
        return True

    async def async_mark_done(self, item_id: str) -> dict[str, Any] | None:
        """For recurring items, advance the due date. For one-offs, delete."""
        for idx, existing in enumerate(self._data["items"]):
            if existing["id"] != item_id:
                continue
            recurrence = existing.get("recurrence") or RECURRENCE_NONE
            if recurrence == RECURRENCE_NONE:
                self._data["items"].pop(idx)
                await self._save()
                return None
            current = _parse_date(existing["due_date"])
            # advance from max(today, current) to guarantee future date
            base = max(current, _today())
            next_date = _advance_date(base, recurrence, existing.get("recurrence_days"))
            if next_date <= _today():
                next_date = _advance_date(
                    _today(), recurrence, existing.get("recurrence_days")
                )
            updated = {**existing, "due_date": next_date.isoformat()}
            self._data["items"][idx] = updated
            await self._save()
            return self._decorate(updated)
        return None

    # ---------- categories ----------

    @callback
    def categories(self) -> list[dict[str, Any]]:
        return list(self._data["categories"])

    async def async_add_category(self, payload: dict[str, Any]) -> dict[str, Any]:
        cat = {
            "id": payload.get("id") or uuid.uuid4().hex,
            "name": payload["name"],
            "icon": payload.get("icon") or "mdi:tag",
            "color": payload.get("color") or "#78909C",
        }
        self._data["categories"].append(cat)
        await self._save()
        return cat

    async def async_update_category(
        self, category_id: str, payload: dict[str, Any]
    ) -> dict[str, Any] | None:
        for idx, existing in enumerate(self._data["categories"]):
            if existing["id"] == category_id:
                updated = {**existing, **payload, "id": category_id}
                self._data["categories"][idx] = updated
                await self._save()
                return updated
        return None

    async def async_delete_category(self, category_id: str) -> bool:
        before = len(self._data["categories"])
        self._data["categories"] = [
            c for c in self._data["categories"] if c["id"] != category_id
        ]
        if len(self._data["categories"]) == before:
            return False
        # reassign orphans to "other" (or first remaining)
        fallback = "other"
        if not any(c["id"] == fallback for c in self._data["categories"]):
            fallback = (
                self._data["categories"][0]["id"]
                if self._data["categories"]
                else "other"
            )
        for item in self._data["items"]:
            if item.get("category_id") == category_id:
                item["category_id"] = fallback
        await self._save()
        return True

    # ---------- settings ----------

    @callback
    def settings(self) -> dict[str, Any]:
        return dict(self._data["settings"])

    async def async_update_settings(self, payload: dict[str, Any]) -> dict[str, Any]:
        self._data["settings"] = {**self._data["settings"], **payload}
        await self._save()
        return dict(self._data["settings"])

    # ---------- decoration (derived fields) ----------

    def _decorate(self, item: dict[str, Any]) -> dict[str, Any]:
        settings = self._data["settings"]
        overrides = item.get("alert_overrides") or {}
        warning = overrides.get("warning_days", settings["warning_days"])
        urgent = overrides.get("urgent_days", settings["urgent_days"])
        critical = overrides.get("critical_days", settings["critical_days"])

        due = _parse_date(item["due_date"])
        days_until = (due - _today()).days

        if days_until < 0:
            status = STATUS_EXPIRED
        elif days_until <= critical:
            status = STATUS_CRITICAL
        elif days_until <= urgent:
            status = STATUS_URGENT
        elif days_until <= warning:
            status = STATUS_WARNING
        else:
            status = STATUS_OK

        return {**item, "days_until_due": days_until, "status": status}


def get_store(hass: HomeAssistant) -> WhatsDueStore:
    """Return the shared store instance."""
    return hass.data[DOMAIN]["store"]

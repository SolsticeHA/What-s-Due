"""WebSocket API for the What's Due panel."""
from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback

from .const import DOMAIN
from .storage import get_store


@callback
def async_register_websocket_handlers(hass: HomeAssistant) -> None:
    """Register all websocket handlers for the panel."""
    websocket_api.async_register_command(hass, ws_get_all)
    websocket_api.async_register_command(hass, ws_add_item)
    websocket_api.async_register_command(hass, ws_update_item)
    websocket_api.async_register_command(hass, ws_delete_item)
    websocket_api.async_register_command(hass, ws_mark_done)
    websocket_api.async_register_command(hass, ws_uncomplete_item)
    websocket_api.async_register_command(hass, ws_add_category)
    websocket_api.async_register_command(hass, ws_update_category)
    websocket_api.async_register_command(hass, ws_delete_category)
    websocket_api.async_register_command(hass, ws_update_settings)


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/get_all"})
@websocket_api.async_response
async def ws_get_all(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return items, categories and settings."""
    store = get_store(hass)
    connection.send_result(
        msg["id"],
        {
            "items": store.items(),
            "categories": store.categories(),
            "settings": store.settings(),
        },
    )


# ---------- items ----------

@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/add_item",
        vol.Required("name"): str,
        vol.Required("due_date"): str,
        vol.Optional("category_id"): str,
        vol.Optional("icon"): str,
        vol.Optional("notes"): str,
        vol.Optional("recurrence"): str,
        vol.Optional("recurrence_days"): int,
        vol.Optional("alert_overrides"): dict,
    }
)
@websocket_api.async_response
async def ws_add_item(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Add a new item."""
    store = get_store(hass)
    payload = {k: v for k, v in msg.items() if k not in ("id", "type")}
    item = await store.async_add_item(payload)
    connection.send_result(msg["id"], item)


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/update_item",
        vol.Required("item_id"): str,
        vol.Optional("name"): str,
        vol.Optional("due_date"): str,
        vol.Optional("category_id"): str,
        vol.Optional("icon"): str,
        vol.Optional("notes"): str,
        vol.Optional("recurrence"): str,
        vol.Optional("recurrence_days"): vol.Any(int, None),
        vol.Optional("alert_overrides"): vol.Any(dict, None),
    }
)
@websocket_api.async_response
async def ws_update_item(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Update an existing item. Any field present is patched."""
    store = get_store(hass)
    item_id = msg["item_id"]
    payload = {
        k: v for k, v in msg.items() if k not in ("id", "type", "item_id")
    }
    item = await store.async_update_item(item_id, payload)
    if item is None:
        connection.send_error(msg["id"], "not_found", f"Item {item_id} not found")
        return
    connection.send_result(msg["id"], item)


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/delete_item",
        vol.Required("item_id"): str,
    }
)
@websocket_api.async_response
async def ws_delete_item(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Delete an item."""
    store = get_store(hass)
    ok = await store.async_delete_item(msg["item_id"])
    if not ok:
        connection.send_error(msg["id"], "not_found", "Item not found")
        return
    connection.send_result(msg["id"], {"success": True})


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/mark_done",
        vol.Required("item_id"): str,
    }
)
@websocket_api.async_response
async def ws_mark_done(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Mark an item as done.

    Non-recurring items get archived (completed_at stamped, still visible
    under the Done filter). Recurring items advance to next occurrence.
    """
    store = get_store(hass)
    item = await store.async_mark_done(msg["item_id"])
    connection.send_result(msg["id"], {"item": item})


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/uncomplete_item",
        vol.Required("item_id"): str,
    }
)
@websocket_api.async_response
async def ws_uncomplete_item(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Undo a mark-done on a non-recurring item (clears completed_at)."""
    store = get_store(hass)
    item = await store.async_uncomplete_item(msg["item_id"])
    if item is None:
        connection.send_error(msg["id"], "not_found", "Item not found")
        return
    connection.send_result(msg["id"], {"item": item})


# ---------- categories ----------

@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/add_category",
        vol.Required("name"): str,
        vol.Optional("icon"): str,
        vol.Optional("color"): str,
        vol.Optional("id"): str,
    }
)
@websocket_api.async_response
async def ws_add_category(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Create a new category."""
    store = get_store(hass)
    payload = {k: v for k, v in msg.items() if k not in ("type",)}
    # websocket_api reserves "id" at the envelope level — rename category id if provided
    envelope_id = msg["id"]
    cat_id = payload.pop("id", None)
    if cat_id == envelope_id:
        cat_id = None
    if cat_id is not None:
        payload["id"] = cat_id
    cat = await store.async_add_category(payload)
    connection.send_result(envelope_id, cat)


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/update_category",
        vol.Required("category_id"): str,
        vol.Optional("name"): str,
        vol.Optional("icon"): str,
        vol.Optional("color"): str,
    }
)
@websocket_api.async_response
async def ws_update_category(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Update a category."""
    store = get_store(hass)
    category_id = msg["category_id"]
    payload = {
        k: v for k, v in msg.items() if k not in ("id", "type", "category_id")
    }
    cat = await store.async_update_category(category_id, payload)
    if cat is None:
        connection.send_error(msg["id"], "not_found", "Category not found")
        return
    connection.send_result(msg["id"], cat)


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/delete_category",
        vol.Required("category_id"): str,
    }
)
@websocket_api.async_response
async def ws_delete_category(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Delete a category (orphan items are reassigned)."""
    store = get_store(hass)
    ok = await store.async_delete_category(msg["category_id"])
    if not ok:
        connection.send_error(msg["id"], "not_found", "Category not found")
        return
    connection.send_result(msg["id"], {"success": True})


# ---------- settings ----------

@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/update_settings",
        vol.Optional("warning_days"): int,
        vol.Optional("urgent_days"): int,
        vol.Optional("critical_days"): int,
        vol.Optional("notifications"): {
            vol.Optional("enabled"): bool,
            vol.Optional("targets"): [str],
            vol.Optional("statuses"): [str],
        },
    }
)
@websocket_api.async_response
async def ws_update_settings(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Update global settings (alert thresholds, notifications, etc.)."""
    store = get_store(hass)
    payload = {k: v for k, v in msg.items() if k not in ("id", "type")}
    settings = await store.async_update_settings(payload)
    connection.send_result(msg["id"], settings)

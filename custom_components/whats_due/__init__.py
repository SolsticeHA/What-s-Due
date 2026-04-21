"""The What's Due integration."""
from __future__ import annotations

import logging
from pathlib import Path

from homeassistant.components import frontend, panel_custom
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback

from homeassistant.helpers.dispatcher import async_dispatcher_connect

from .const import (
    DOMAIN,
    PANEL_ICON,
    PANEL_NAME,
    PANEL_TITLE,
    PANEL_URL,
    PLATFORMS,
    SIGNAL_ITEMS_UPDATED,
)
from .storage import WhatsDueStore
from .websocket_api import async_register_websocket_handlers

_LOGGER = logging.getLogger(__name__)


async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    """Set up the What's Due component (YAML side — unused)."""
    hass.data.setdefault(DOMAIN, {})
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up What's Due from a config entry."""
    store = WhatsDueStore(hass)
    await store.async_load()

    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN]["store"] = store
    hass.data[DOMAIN]["entry_id"] = entry.entry_id

    async_register_websocket_handlers(hass)

    await _async_register_panel(hass)

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    # Any storage mutation dispatches SIGNAL_ITEMS_UPDATED; re-run the
    # status tick so transitions fire as soon as data changes.
    @callback
    def _on_items_updated() -> None:
        hass.async_create_task(store.async_tick_statuses())

    entry.async_on_unload(
        async_dispatcher_connect(hass, SIGNAL_ITEMS_UPDATED, _on_items_updated)
    )

    entry.async_on_unload(entry.add_update_listener(_async_update_listener))

    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unload_ok:
        frontend.async_remove_panel(hass, DOMAIN)
        hass.data.pop(DOMAIN, None)
    return unload_ok


async def _async_update_listener(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Reload on options change."""
    await hass.config_entries.async_reload(entry.entry_id)


async def _async_register_panel(hass: HomeAssistant) -> None:
    """Register the custom panel and serve its static bundle."""
    panel_dir = Path(__file__).parent / "frontend"

    # Static path survives across entry reloads; only register it once per
    # HA lifetime to avoid "path already registered" errors.
    if not hass.data[DOMAIN].get("static_registered"):
        await hass.http.async_register_static_paths(
            [StaticPathConfig("/whats_due_panel", str(panel_dir), cache_headers=False)]
        )
        hass.data[DOMAIN]["static_registered"] = True

    # If a previous entry lifecycle left the panel registered, remove it so
    # panel_custom can re-register cleanly instead of raising "Overwriting panel".
    if DOMAIN in hass.data.get("frontend_panels", {}):
        frontend.async_remove_panel(hass, DOMAIN)

    await panel_custom.async_register_panel(
        hass=hass,
        webcomponent_name=PANEL_NAME,
        frontend_url_path=DOMAIN,
        module_url=PANEL_URL,
        sidebar_title=PANEL_TITLE,
        sidebar_icon=PANEL_ICON,
        require_admin=False,
        config={},
        embed_iframe=False,
    )

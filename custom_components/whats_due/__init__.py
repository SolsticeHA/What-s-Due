"""The What's Due integration."""
from __future__ import annotations

import logging
from pathlib import Path

from homeassistant.components import frontend
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.loader import async_get_integration

from .const import (
    CARD_STATIC_PATH,
    CARD_URL,
    DOMAIN,
    PLATFORMS,
    SIGNAL_ITEMS_UPDATED,
)
from .storage import WhatsDueStore
from .websocket_api import async_register_websocket_handlers

_LOGGER = logging.getLogger(__name__)

# This integration has no YAML configuration; everything runs via a
# config entry added from the UI. Declaring this explicitly satisfies
# hassfest's CONFIG_SCHEMA requirement for integrations that implement
# async_setup.
CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)


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

    await _async_register_card(hass)

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
        # Leave the static path and extra_js_url in place — HA doesn't
        # expose a safe way to remove them and they become no-ops if the
        # files disappear. hass.data is cleared so the next setup starts
        # fresh.
        hass.data.pop(DOMAIN, None)
    return unload_ok


async def _async_update_listener(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Reload on options change."""
    await hass.config_entries.async_reload(entry.entry_id)


async def _async_register_card(hass: HomeAssistant) -> None:
    """Serve the Lovelace card bundle and auto-load it on the frontend.

    Clean up any leftover sidebar panel from pre-0.3.0 installs so the old
    entry doesn't linger after an update.
    """
    # Old installs registered a sidebar panel at DOMAIN; remove it if present
    # so updating from 0.2.x doesn't leave a broken entry.
    if DOMAIN in hass.data.get("frontend_panels", {}):
        frontend.async_remove_panel(hass, DOMAIN)

    panel_dir = Path(__file__).parent / "frontend"

    # Static path survives across entry reloads; only register it once per
    # HA lifetime to avoid "path already registered" errors.
    if not hass.data[DOMAIN].get("static_registered"):
        await hass.http.async_register_static_paths(
            [
                StaticPathConfig(
                    CARD_STATIC_PATH, str(panel_dir), cache_headers=False
                )
            ]
        )
        hass.data[DOMAIN]["static_registered"] = True

    # Auto-register the card JS so users don't need to add it as a Lovelace
    # resource manually. The version query string busts browser cache between
    # releases. Guard with a flag since add_extra_js_url has no remove.
    if not hass.data[DOMAIN].get("js_registered"):
        integration = await async_get_integration(hass, DOMAIN)
        card_url = f"{CARD_URL}?v={integration.version or 'dev'}"
        frontend.add_extra_js_url(hass, card_url)
        hass.data[DOMAIN]["js_registered"] = True

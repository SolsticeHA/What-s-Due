"""Config flow for What's Due."""
from __future__ import annotations

from typing import Any

from homeassistant.config_entries import ConfigFlow, ConfigFlowResult

from .const import DOMAIN, PANEL_TITLE


class WhatsDueConfigFlow(ConfigFlow, domain=DOMAIN):
    """Handle the config flow. Single-instance, no user input required."""

    VERSION = 1

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Create the single integration entry."""
        await self.async_set_unique_id(DOMAIN)
        self._abort_if_unique_id_configured()
        return self.async_create_entry(title=PANEL_TITLE, data={})

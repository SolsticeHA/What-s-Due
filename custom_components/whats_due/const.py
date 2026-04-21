"""Constants for the What's Due integration."""
from __future__ import annotations

from typing import Final

DOMAIN: Final = "whats_due"
PLATFORMS: Final = ["sensor"]

# Panel
PANEL_URL: Final = "/whats_due_panel/whats-due-panel.js"
PANEL_TITLE: Final = "What's Due"
PANEL_ICON: Final = "mdi:calendar-clock"
PANEL_NAME: Final = "whats-due-panel"

# Storage
STORAGE_KEY: Final = f"{DOMAIN}.data"
STORAGE_VERSION: Final = 1

# Default alert thresholds (days)
DEFAULT_WARNING_DAYS: Final = 30
DEFAULT_URGENT_DAYS: Final = 7
DEFAULT_CRITICAL_DAYS: Final = 1

# Status values
STATUS_OK: Final = "ok"
STATUS_WARNING: Final = "warning"
STATUS_URGENT: Final = "urgent"
STATUS_CRITICAL: Final = "critical"
STATUS_EXPIRED: Final = "expired"
STATUS_COMPLETED: Final = "completed"

# Recurrence types
RECURRENCE_NONE: Final = "none"
RECURRENCE_MONTHLY: Final = "monthly"
RECURRENCE_YEARLY: Final = "yearly"
RECURRENCE_CUSTOM: Final = "custom"  # uses recurrence_days

# Events — fired on the HA event bus
EVENT_STATUS_CHANGED: Final = f"{DOMAIN}_item_status_changed"

# Signals
SIGNAL_ITEMS_UPDATED: Final = f"{DOMAIN}_items_updated"

# Default categories (seeded on first run — user can edit/delete)
DEFAULT_CATEGORIES: Final = [
    {"id": "vehicle", "name": "Vehicle", "icon": "mdi:car", "color": "#42A5F5"},
    {"id": "home", "name": "Home", "icon": "mdi:home", "color": "#66BB6A"},
    {"id": "documents", "name": "Documents", "icon": "mdi:file-document", "color": "#AB47BC"},
    {"id": "health", "name": "Health", "icon": "mdi:heart-pulse", "color": "#EF5350"},
    {"id": "subscriptions", "name": "Subscriptions", "icon": "mdi:credit-card-clock", "color": "#FFA726"},
    {"id": "other", "name": "Other", "icon": "mdi:dots-horizontal", "color": "#78909C"},
]

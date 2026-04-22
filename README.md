# What's Due

A Home Assistant custom integration for tracking anything with a due date — car inspections, insurance renewals, boiler service, passport expiry, filter changes, etc. Drops a small Lovelace card on any dashboard plus a `calendar` entity, a `sensor` per item, and optional notifications.

## Features

- Lovelace card (`type: custom:whats-due-card`) — compact list of the most urgent items with add / edit / mark-done inline
- User-defined items & categories (nothing predefined)
- Per-item: name, due date, category, icon, optional recurrence
- Recurrence: none / monthly / yearly / custom days — "mark done" auto-advances the date for recurring items; non-recurring items are archived (not deleted), so you can always undo
- `calendar.whats_due` entity so your due dates show up in the dashboard Calendar card and can drive `trigger: calendar` automations
- One `sensor.whats_due_<slug>` entity per item, `state = days_until_due`, with `status` attribute
- Configurable alert thresholds + built-in notification service (picks from your `notify.*` services)
- Status-change events on the HA bus for custom automations
- Translations: English + Romanian (follows your HA language setting)

## Installation

### Via HACS (recommended)

1. In Home Assistant: *HACS → Integrations → ⋮ → Custom repositories*.
2. Add `https://github.com/SolsticeHA/What-s-Due` with category **Integration**.
3. Find **What's Due** in the list and click *Download*.
4. Restart Home Assistant.
5. *Settings → Devices & Services → Add Integration → What's Due*.

### Manual

1. Copy `custom_components/whats_due/` into your HA `config/custom_components/` directory.
2. Restart Home Assistant.
3. *Settings → Devices & Services → Add Integration → What's Due*.

## Using the card

The card JS is auto-registered as a frontend module — no manual resource setup needed.

On any Lovelace dashboard: *Edit dashboard → Add card → Custom: What's Due*. Or paste directly:

```yaml
type: custom:whats-due-card
title: What's Due        # optional, defaults to "What's Due"
max_items: 5             # optional, 0 = show all
category: vehicle        # optional, restricts the card to one category
```

Header buttons (➕ / 🏷 / ⚙) open the add-item, manage-categories, and settings dialogs. Hovering an item reveals the "mark done" check; clicking anywhere else on the row opens the edit dialog.

## Development

Backend is pure Python (no build step). The card is a single Lit/TypeScript bundle:

```bash
npm install
npm run build    # one-shot build → custom_components/whats_due/frontend/whats-due-card.js
npm run dev      # watch mode
```

Commit the built bundle so users installing via HACS don't need Node.

## Project layout

```
custom_components/whats_due/
  __init__.py            # setup, static-path + extra_js_url for the card
  manifest.json
  const.py
  config_flow.py         # minimal — just enables the integration
  storage.py             # Store helper wrapper (items + categories + settings)
  websocket_api.py       # list/add/update/delete/mark_done/categories CRUD
  sensor.py              # dynamic sensor entities per item
  calendar.py            # calendar entity aggregating all items
  translations/
    en.json
    ro.json
  frontend/
    whats-due-card.js    # built bundle (committed)

src/                     # Lit/TS source for the card
  whats-due-card.ts
  api.ts
  types.ts
  i18n.ts
  ha-elements.ts
  shared-styles.ts
  components/
    wd-item-dialog.ts
    wd-category-dialog.ts
    wd-categories-dialog.ts
    wd-settings-dialog.ts
    wd-icon-picker.ts

package.json
rollup.config.mjs
tsconfig.json
```

## License

MIT

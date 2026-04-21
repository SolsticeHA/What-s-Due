# What's Due

A Home Assistant custom integration for tracking anything with a due date — car inspections, insurance renewals, boiler service, passport expiry, filter changes, etc. Comes with its own sidebar panel: a sortable table, editable categories, and a clean add/edit dialog.

## Features

- Dedicated sidebar panel (no Lovelace card needed)
- User-defined items & categories (nothing predefined)
- Per-item: name, due date, category, icon, optional recurrence
- Recurrence: none / monthly / yearly / custom days — "mark done" auto-advances the date
- One `sensor.whats_due_<slug>` entity per item, `state = days_until_due`, with `status` attribute (`ok` / `warning` / `expired`)
- Configurable global alert thresholds (default 30 / 7 / 1 days)
- Events fired on status changes so you can build your own notifications (mobile, Telegram, TTS…)
- Translations: English + Romanian

## Installation

### Via HACS (recommended)

1. In Home Assistant: *HACS → Integrations → ⋮ → Custom repositories*.
2. Add `https://github.com/SolsticeHA/whats_due` with category **Integration**.
3. Find **What's Due** in the list and click *Download*.
4. Restart Home Assistant.
5. *Settings → Devices & Services → Add Integration → What's Due*.
6. Open **What's Due** from the sidebar and start adding items.

### Manual

1. Copy `custom_components/whats_due/` into your HA `config/custom_components/` directory.
2. Restart Home Assistant.
3. *Settings → Devices & Services → Add Integration → What's Due*.
4. Open **What's Due** from the sidebar and start adding items.

## Development

Backend is pure Python (no build step). The panel is a single Lit/TypeScript bundle:

```bash
npm install
npm run build    # one-shot build → custom_components/whats_due/frontend/whats-due-panel.js
npm run dev      # watch mode
```

Commit the built bundle so users installing via HACS don't need Node.

## Project layout

```
custom_components/whats_due/
  __init__.py            # setup, panel registration, service registration
  manifest.json
  const.py
  config_flow.py         # minimal — just enables the integration
  storage.py             # Store helper wrapper (items + categories + settings)
  websocket_api.py       # list/add/update/delete/mark_done/categories CRUD
  sensor.py              # dynamic sensor entities per item
  translations/
    en.json
    ro.json
  frontend/
    whats-due-panel.js   # built bundle (committed)

src/                     # Lit/TS source for the panel
  whats-due-panel.ts
  api.ts
  types.ts
  ...

package.json
rollup.config.mjs
tsconfig.json
```

## License

MIT

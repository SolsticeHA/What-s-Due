import { css } from "lit";

// HA's mwc-button is lazy-loaded and often not registered when our custom
// panel first renders, which leaves the dialog action slots empty (no Save
// button). We use plain <button class="wd-btn"> and style them to match
// Material/HA theming so they work regardless of frontend load order.
export const layoutStyles = css`
  .wd-row {
    display: flex;
    gap: 12px;
    align-items: center;
  }
  .wd-row > * { flex: 1; }
  .wd-row > .wd-shrink { flex: 0 0 auto; }

  .wd-form {
    display: grid;
    gap: 12px;
    padding: 4px 0;
  }

  .wd-dialog-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding: 12px 0 4px;
  }

  .wd-list {
    display: flex;
    flex-direction: column;
  }

  .wd-btn {
    font: inherit;
    font-weight: 500;
    letter-spacing: 0.0892857em;
    text-transform: uppercase;
    font-size: 0.875rem;
    padding: 8px 14px;
    min-height: 36px;
    border-radius: 4px;
    border: none;
    background: transparent;
    color: var(--primary-color);
    cursor: pointer;
    transition: background 120ms ease;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .wd-btn:hover { background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.08); }
  .wd-btn:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 2px; }
  .wd-btn.primary {
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
  }
  .wd-btn.primary:hover { filter: brightness(1.1); }
  .wd-btn[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  .wd-field {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .wd-field > span {
    font-size: 0.75rem;
    color: var(--secondary-text-color);
    padding-left: 2px;
  }
  .wd-field > select {
    font: inherit;
    font-size: 1rem;
    padding: 10px 12px;
    border-radius: 4px;
    border: 1px solid var(--divider-color);
    background: var(--card-background-color, var(--primary-background-color));
    color: var(--primary-text-color);
    min-height: 44px;
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23888' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-right: 32px;
  }
  .wd-field > select:focus {
    outline: none;
    border-color: var(--primary-color);
  }

  .wd-chip-group {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .wd-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 999px;
    background: var(--secondary-background-color);
    border: 1px solid var(--divider-color);
    color: var(--primary-text-color);
    font: inherit;
    font-size: 0.85rem;
    cursor: pointer;
    white-space: nowrap;
    transition: transform 100ms ease, background 100ms ease;
  }
  .wd-chip:hover { transform: translateY(-1px); }
  .wd-chip.active {
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
    border-color: transparent;
  }
  .wd-chip ha-icon { --mdc-icon-size: 16px; }
`;

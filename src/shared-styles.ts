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
`;

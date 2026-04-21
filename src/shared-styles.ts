import { css } from "lit";

// Minimal layout helpers. Inputs/buttons/dialogs use HA's own components,
// so we don't restyle them — theme changes in HA apply automatically.
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
  }

  .wd-list {
    display: flex;
    flex-direction: column;
  }
`;

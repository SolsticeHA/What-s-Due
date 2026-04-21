import { LitElement, html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

import { layoutStyles } from "../shared-styles.js";
import type { Strings } from "../i18n.js";
import type { Category } from "../types.js";

@customElement("wd-categories-dialog")
export class WdCategoriesDialog extends LitElement {
  static override styles = [
    layoutStyles,
    css`
      .list { display: flex; flex-direction: column; }
      .row {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 4px;
        border-bottom: 1px solid var(--divider-color);
      }
      .row:last-child { border-bottom: 0; }
      .swatch {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        flex-shrink: 0;
      }
      .name { flex: 1; }
      .muted { color: var(--secondary-text-color); font-size: 0.85rem; }
      .empty { padding: 20px 4px; color: var(--secondary-text-color); text-align: center; }
    `,
  ];

  @property({ attribute: false }) public strings!: Strings;
  @property({ attribute: false }) public categories: Category[] = [];

  private _close = () => this.dispatchEvent(new CustomEvent("close"));

  private _add = () => this.dispatchEvent(new CustomEvent("add"));

  private _edit(c: Category) {
    this.dispatchEvent(new CustomEvent<Category>("edit", { detail: c }));
  }

  private _delete(c: Category) {
    this.dispatchEvent(new CustomEvent<Category>("delete", { detail: c }));
  }

  override render() {
    const s = this.strings;
    return html`
      <ha-dialog open heading=${s.categories} @closed=${this._close}>
        <div class="list">
          ${this.categories.length === 0
            ? html`<div class="empty">—</div>`
            : this.categories.map(
                (c) => html`
                  <div class="row">
                    <div class="swatch" style="background: ${c.color}">
                      <ha-icon .icon=${c.icon}></ha-icon>
                    </div>
                    <div class="name">
                      <div>${c.name}</div>
                      <div class="muted">${c.id}</div>
                    </div>
                    <ha-icon-button
                      .label=${s.editItem}
                      @click=${() => this._edit(c)}
                    >
                      <ha-icon icon="mdi:pencil"></ha-icon>
                    </ha-icon-button>
                    <ha-icon-button
                      .label=${s.deleteItem}
                      @click=${() => this._delete(c)}
                    >
                      <ha-icon icon="mdi:delete"></ha-icon>
                    </ha-icon-button>
                  </div>
                `
              )}
        </div>

        <div class="wd-dialog-actions">
          <button class="wd-btn" @click=${this._close}>${s.close}</button>
          <button class="wd-btn primary" @click=${this._add}>
            <ha-icon icon="mdi:plus"></ha-icon>
            ${s.newCategory}
          </button>
        </div>
      </ha-dialog>
    `;
  }
}

// silence unused import
void nothing;

declare global {
  interface HTMLElementTagNameMap {
    "wd-categories-dialog": WdCategoriesDialog;
  }
}

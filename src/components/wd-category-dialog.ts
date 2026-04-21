import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { layoutStyles } from "../shared-styles.js";
import type { Strings } from "../i18n.js";
import type { Category } from "../types.js";
import "./wd-icon-picker.js";

export interface CategoryDraft {
  id?: string;
  name: string;
  icon: string;
  color: string;
}

export function emptyCategoryDraft(): CategoryDraft {
  return { name: "", icon: "mdi:tag", color: "#78909C" };
}

export function draftFromCategory(c: Category): CategoryDraft {
  return { id: c.id, name: c.name, icon: c.icon, color: c.color };
}

@customElement("wd-category-dialog")
export class WdCategoryDialog extends LitElement {
  static override styles = [
    layoutStyles,
    css`
      .form { display: grid; gap: 12px; padding: 4px 0; }
      .color-row { display: flex; gap: 10px; align-items: center; }
      .color-row input[type="color"] {
        padding: 0;
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        width: 48px;
        height: 36px;
        background: transparent;
        cursor: pointer;
      }
      .color-label { color: var(--secondary-text-color); font-size: 0.85rem; }
    `,
  ];

  @property({ attribute: false }) public strings!: Strings;
  @property({ attribute: false }) public draft!: CategoryDraft;

  @state() private _local!: CategoryDraft;

  override willUpdate(changed: Map<string, unknown>): void {
    if (changed.has("draft") && this.draft) {
      this._local = { ...this.draft };
    }
  }

  private _patch<K extends keyof CategoryDraft>(
    k: K,
    v: CategoryDraft[K]
  ): void {
    this._local = { ...this._local, [k]: v };
    this.requestUpdate();
  }

  private _cancel = () => this.dispatchEvent(new CustomEvent("cancel"));

  private _save = () => {
    if (!this._local.name.trim()) return;
    this.dispatchEvent(
      new CustomEvent<CategoryDraft>("save", { detail: this._local })
    );
  };

  override render() {
    if (!this._local) return nothing;
    const s = this.strings;
    const d = this._local;

    return html`
      <ha-dialog
        open
        heading=${d.id ? s.categories : s.newCategory}
        @closed=${this._cancel}
      >
        <div class="form">
          <ha-textfield
            .label=${s.name}
            .value=${d.name}
            required
            @input=${(e: Event) =>
              this._patch("name", (e.target as HTMLInputElement).value)}
          ></ha-textfield>

          <wd-icon-picker
            .label=${s.icon}
            .value=${d.icon}
            @value-changed=${(e: CustomEvent<{ value: string }>) =>
              this._patch("icon", e.detail.value)}
          ></wd-icon-picker>

          <div class="color-row">
            <input
              type="color"
              .value=${d.color}
              @input=${(e: Event) =>
                this._patch("color", (e.target as HTMLInputElement).value)}
            />
            <span class="color-label">${s.color}</span>
          </div>
        </div>

        <div class="wd-dialog-actions">
          <button class="wd-btn" @click=${this._cancel}>${s.cancel}</button>
          <button class="wd-btn primary" @click=${this._save}>${s.save}</button>
        </div>
      </ha-dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "wd-category-dialog": WdCategoryDialog;
  }
}

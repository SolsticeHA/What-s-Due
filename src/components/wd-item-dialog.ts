import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { layoutStyles } from "../shared-styles.js";
import type { Strings } from "../i18n.js";
import type { Category, Item, Recurrence } from "../types.js";
import "./wd-icon-picker.js";

export interface ItemDraft {
  id?: string;
  name: string;
  due_date: string;
  category_id: string;
  icon: string;
  notes: string;
  recurrence: Recurrence;
  recurrence_days: number | null;
}

export function draftFromItem(item: Item): ItemDraft {
  return {
    id: item.id,
    name: item.name,
    due_date: item.due_date,
    category_id: item.category_id,
    icon: item.icon,
    notes: item.notes ?? "",
    recurrence: item.recurrence,
    recurrence_days: item.recurrence_days ?? null,
  };
}

export function emptyDraft(categoryId: string): ItemDraft {
  const now = new Date();
  const d = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(now.getDate()).padStart(2, "0")}`;
  return {
    name: "",
    due_date: d,
    category_id: categoryId,
    icon: "mdi:calendar",
    notes: "",
    recurrence: "none",
    recurrence_days: null,
  };
}

@customElement("wd-item-dialog")
export class WdItemDialog extends LitElement {
  static override styles = layoutStyles;

  @property({ attribute: false }) public strings!: Strings;
  @property({ attribute: false }) public categories: Category[] = [];
  @property({ attribute: false }) public draft!: ItemDraft;

  @state() private _local!: ItemDraft;

  override willUpdate(changed: Map<string, unknown>): void {
    if (changed.has("draft") && this.draft) {
      this._local = { ...this.draft };
    }
  }

  private _patch<K extends keyof ItemDraft>(k: K, v: ItemDraft[K]): void {
    this._local = { ...this._local, [k]: v };
    this.requestUpdate();
  }

  private _cancel = () => {
    this.dispatchEvent(new CustomEvent("cancel"));
  };

  private _save = () => {
    if (!this._local.name.trim() || !this._local.due_date) return;
    this.dispatchEvent(
      new CustomEvent<ItemDraft>("save", { detail: this._local })
    );
  };

  override render() {
    if (!this._local) return nothing;
    const s = this.strings;
    const d = this._local;

    return html`
      <ha-dialog
        open
        heading=${d.id ? s.editItem : s.addItem}
        @closed=${this._cancel}
      >
        <div class="wd-form">
          <ha-textfield
            .label=${s.name}
            .value=${d.name}
            required
            @input=${(e: Event) =>
              this._patch("name", (e.target as HTMLInputElement).value)}
          ></ha-textfield>

          <ha-textfield
            .label=${s.dueDate}
            type="date"
            .value=${d.due_date}
            required
            @input=${(e: Event) =>
              this._patch("due_date", (e.target as HTMLInputElement).value)}
          ></ha-textfield>

          <ha-select
            .label=${s.category}
            .value=${d.category_id}
            fixedMenuPosition
            @selected=${(e: CustomEvent & { target: HTMLSelectElement }) => {
              const val = (e.target as HTMLSelectElement).value;
              if (val) this._patch("category_id", val);
            }}
            @closed=${(e: Event) => e.stopPropagation()}
          >
            ${this.categories.map(
              (c) => html`
                <mwc-list-item .value=${c.id} graphic="icon">
                  <ha-icon slot="graphic" .icon=${c.icon}></ha-icon>
                  ${c.name}
                </mwc-list-item>
              `
            )}
          </ha-select>

          <wd-icon-picker
            .label=${s.icon}
            .value=${d.icon}
            @value-changed=${(e: CustomEvent<{ value: string }>) =>
              this._patch("icon", e.detail.value)}
          ></wd-icon-picker>

          <ha-select
            .label=${s.recurrence}
            .value=${d.recurrence}
            fixedMenuPosition
            @selected=${(e: Event) => {
              const val = (e.target as HTMLSelectElement).value as Recurrence;
              if (val) this._patch("recurrence", val);
            }}
            @closed=${(e: Event) => e.stopPropagation()}
          >
            <mwc-list-item value="none">${s.recurrenceNone}</mwc-list-item>
            <mwc-list-item value="monthly">${s.recurrenceMonthly}</mwc-list-item>
            <mwc-list-item value="yearly">${s.recurrenceYearly}</mwc-list-item>
            <mwc-list-item value="custom">${s.recurrenceCustom}</mwc-list-item>
          </ha-select>

          ${d.recurrence === "custom"
            ? html`
                <ha-textfield
                  .label=${s.recurrenceDays}
                  type="number"
                  min="1"
                  .value=${d.recurrence_days != null
                    ? String(d.recurrence_days)
                    : ""}
                  @input=${(e: Event) => {
                    const v = (e.target as HTMLInputElement).value;
                    this._patch("recurrence_days", v ? parseInt(v, 10) : null);
                  }}
                ></ha-textfield>
              `
            : nothing}

          <ha-textarea
            .label=${s.notes}
            .value=${d.notes}
            @input=${(e: Event) =>
              this._patch(
                "notes",
                (e.target as HTMLTextAreaElement).value
              )}
          ></ha-textarea>
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
    "wd-item-dialog": WdItemDialog;
  }
}

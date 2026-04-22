import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";

import { WhatsDueApi } from "../api.js";
import { defineOnce } from "../ha-elements.js";
import { pickStrings, type Strings } from "../i18n.js";
import { layoutStyles } from "../shared-styles.js";
import type { Category, HomeAssistant } from "../types.js";

type CardAppearance = "default" | "mushroom";

interface WhatsDueCardConfig {
  type: string;
  title?: string;
  max_items?: number;
  category?: string;
  show_header_actions?: boolean;
  appearance?: CardAppearance;
}

/**
 * GUI editor registered as the card's config element. HA renders this
 * instead of the raw YAML pane when the user clicks "Edit" on the card,
 * then reacts to config-changed events to persist the new config.
 */
export class WhatsDueCardEditor extends LitElement {
  static override styles = [
    layoutStyles,
    css`
      :host { display: block; }
      .form { display: grid; gap: 14px; padding: 4px 0; }
      .toggle {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .toggle input[type="checkbox"] {
        width: 18px;
        height: 18px;
        accent-color: var(--primary-color);
        cursor: pointer;
        margin: 0;
      }
      .toggle span.label {
        padding-left: 0;
        color: var(--primary-text-color);
        font-size: 0.95rem;
      }
      label.field {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      label.field > span.label {
        font-size: 0.78rem;
        color: var(--secondary-text-color);
        padding-left: 2px;
      }
      input, select {
        font: inherit;
        font-size: 0.95rem;
        padding: 10px 12px;
        border-radius: 4px;
        border: 1px solid var(--divider-color);
        background: var(--card-background-color, var(--primary-background-color));
        color: var(--primary-text-color);
        min-height: 42px;
      }
      input:focus, select:focus {
        outline: none;
        border-color: var(--primary-color);
      }
      select {
        appearance: none;
        -webkit-appearance: none;
        background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23888' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 12px center;
        padding-right: 32px;
      }
      .hint {
        font-size: 0.75rem;
        color: var(--secondary-text-color);
        margin: 2px 0 0 2px;
      }
    `,
  ];

  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config?: WhatsDueCardConfig;
  @state() private _categories: Category[] = [];

  public setConfig(config: WhatsDueCardConfig): void {
    this._config = { ...config };
  }

  override firstUpdated(): void {
    void this._loadCategories();
  }

  protected override updated(changed: Map<string, unknown>): void {
    // If the editor is recreated for a dashboard that just gained HA access,
    // pull categories once we actually have a hass reference.
    if (changed.has("hass") && this.hass && this._categories.length === 0) {
      void this._loadCategories();
    }
  }

  private async _loadCategories(): Promise<void> {
    if (!this.hass) return;
    try {
      const api = new WhatsDueApi(this.hass);
      const snap = await api.getAll();
      this._categories = snap.categories;
    } catch {
      this._categories = [];
    }
  }

  private get strings(): Strings {
    return pickStrings(this.hass?.language);
  }

  private _emit(patch: Partial<WhatsDueCardConfig>): void {
    if (!this._config) return;
    const merged: WhatsDueCardConfig = { ...this._config, ...patch };
    // Drop empty/default optional fields so the saved YAML stays minimal.
    if (merged.title === "") delete merged.title;
    if (merged.category === "") delete merged.category;
    if (merged.appearance === "default") delete merged.appearance;
    if (merged.show_header_actions === true) delete merged.show_header_actions;
    this._config = merged;
    this.dispatchEvent(
      new CustomEvent("config-changed", { detail: { config: merged } })
    );
  }

  override render() {
    if (!this._config) return nothing;
    const s = this.strings;
    const cfg = this._config;

    return html`
      <div class="form">
        <label class="field">
          <span class="label">${s.editorTitle}</span>
          <input
            type="text"
            placeholder=${s.title}
            .value=${cfg.title ?? ""}
            @input=${(e: Event) =>
              this._emit({ title: (e.target as HTMLInputElement).value })}
          />
        </label>

        <label class="field">
          <span class="label">${s.editorMaxItems}</span>
          <input
            type="number"
            min="0"
            max="50"
            .value=${String(cfg.max_items ?? 5)}
            @input=${(e: Event) => {
              const raw = (e.target as HTMLInputElement).value;
              const n = parseInt(raw, 10);
              this._emit({
                max_items: Number.isFinite(n) && n >= 0 ? n : 5,
              });
            }}
          />
          <div class="hint">${s.editorMaxItemsHint}</div>
        </label>

        <label class="field">
          <span class="label">${s.editorCategory}</span>
          <select
            .value=${cfg.category ?? ""}
            @change=${(e: Event) =>
              this._emit({
                category: (e.target as HTMLSelectElement).value,
              })}
          >
            <option value="" ?selected=${!cfg.category}>
              ${s.editorAnyCategory}
            </option>
            ${this._categories.map(
              (c) => html`
                <option value=${c.id} ?selected=${cfg.category === c.id}>
                  ${c.name}
                </option>
              `
            )}
          </select>
          <div class="hint">${s.editorCategoryHint}</div>
        </label>

        <label class="field">
          <span class="label">${s.editorAppearance}</span>
          <select
            .value=${cfg.appearance ?? "default"}
            @change=${(e: Event) =>
              this._emit({
                appearance:
                  (e.target as HTMLSelectElement).value as CardAppearance,
              })}
          >
            <option value="default" ?selected=${(cfg.appearance ?? "default") === "default"}>
              ${s.editorAppearanceDefault}
            </option>
            <option value="mushroom" ?selected=${cfg.appearance === "mushroom"}>
              ${s.editorAppearanceMushroom}
            </option>
          </select>
        </label>

        <label class="toggle field">
          <input
            type="checkbox"
            .checked=${cfg.show_header_actions ?? true}
            @change=${(e: Event) =>
              this._emit({
                show_header_actions: (e.target as HTMLInputElement).checked,
              })}
          />
          <span class="label">${s.editorShowActions}</span>
        </label>
        <div class="hint" style="margin-top:-8px;">
          ${s.editorShowActionsHint}
        </div>
      </div>
    `;
  }
}

defineOnce("whats-due-card-editor", WhatsDueCardEditor);

declare global {
  interface HTMLElementTagNameMap {
    "whats-due-card-editor": WhatsDueCardEditor;
  }
}

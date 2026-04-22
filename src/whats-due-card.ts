import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";

import { WhatsDueApi } from "./api.js";
import { defineOnce, loadHaDependencies } from "./ha-elements.js";
import { pickStrings, type Strings } from "./i18n.js";
import type {
  Category,
  HomeAssistant,
  Item,
  Settings,
} from "./types.js";

import "./components/wd-item-dialog.js";
import "./components/wd-category-dialog.js";
import "./components/wd-categories-dialog.js";
import "./components/wd-settings-dialog.js";
import "./components/wd-card-editor.js";
import {
  type ItemDraft,
  draftFromItem,
  emptyDraft,
} from "./components/wd-item-dialog.js";
import {
  type CategoryDraft,
  draftFromCategory,
  emptyCategoryDraft,
} from "./components/wd-category-dialog.js";

interface WhatsDueCardConfig {
  type: string;
  title?: string;
  max_items?: number;
  // Optional: restrict the card to one category id (hides everything else).
  category?: string;
}

type DialogMode =
  | { kind: "item"; draft: ItemDraft }
  | { kind: "categories" }
  | { kind: "category"; draft: CategoryDraft }
  | { kind: "settings" }
  | null;

export class WhatsDueCard extends LitElement {
  static getStubConfig(): WhatsDueCardConfig {
    return { type: "custom:whats-due-card", max_items: 5 };
  }

  // Tell HA to use our custom editor instead of the raw YAML pane when the
  // user clicks "Edit" on the card in dashboard edit mode. Must be sync —
  // HA's card-picker preview hangs on a "loading" spinner if we return a
  // Promise here.
  static getConfigElement(): HTMLElement {
    return document.createElement("whats-due-card-editor");
  }

  static override styles = css`
    :host {
      --wd-status-ok: var(--success-color, #4caf50);
      --wd-status-warning: #ffc107;
      --wd-status-urgent: #ff9800;
      --wd-status-critical: #f44336;
      --wd-status-expired: #b71c1c;
    }

    ha-card {
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .card-header {
      display: flex;
      align-items: center;
      padding: 12px 8px 4px 16px;
    }
    .card-header .name {
      flex: 1;
      font-size: 1.05rem;
      font-weight: 500;
      color: var(--primary-text-color);
    }
    .card-header ha-icon-button {
      --mdc-icon-button-size: 36px;
      --mdc-icon-size: 20px;
      color: var(--secondary-text-color);
    }

    .card-content {
      padding: 4px 8px 12px;
    }

    .empty {
      padding: 28px 12px;
      text-align: center;
      color: var(--secondary-text-color);
      font-size: 0.9rem;
    }

    .row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 8px;
      border-radius: 8px;
      cursor: pointer;
      transition: background 120ms ease;
      border-left: 3px solid transparent;
      padding-left: 9px;
    }
    .row:hover { background: var(--secondary-background-color); }
    .row.status-ok { border-left-color: var(--wd-status-ok); }
    .row.status-warning { border-left-color: var(--wd-status-warning); }
    .row.status-urgent { border-left-color: var(--wd-status-urgent); }
    .row.status-critical { border-left-color: var(--wd-status-critical); }
    .row.status-expired { border-left-color: var(--wd-status-expired); }

    .icon {
      width: 34px;
      height: 34px;
      border-radius: 10px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      flex-shrink: 0;
    }
    .icon ha-icon { --mdc-icon-size: 20px; }

    .main {
      flex: 1;
      min-width: 0;
    }
    .main .title {
      font-size: 0.95rem;
      font-weight: 500;
      color: var(--primary-text-color);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .main .sub {
      font-size: 0.78rem;
      color: var(--secondary-text-color);
      margin-top: 1px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .days {
      font-size: 0.82rem;
      font-weight: 600;
      padding: 3px 8px;
      border-radius: 999px;
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
      white-space: nowrap;
      flex-shrink: 0;
    }
    .row.status-expired .days,
    .row.status-critical .days {
      background: var(--wd-status-critical);
      color: #fff;
    }
    .row.status-urgent .days {
      background: var(--wd-status-urgent);
      color: #fff;
    }
    .row.status-warning .days {
      background: var(--wd-status-warning);
      color: #333;
    }

    .done-btn {
      --mdc-icon-button-size: 32px;
      --mdc-icon-size: 18px;
      color: var(--secondary-text-color);
      opacity: 0;
      transition: opacity 120ms ease;
      flex-shrink: 0;
    }
    .row:hover .done-btn,
    .row:focus-within .done-btn {
      opacity: 1;
    }

    .more {
      padding: 8px 14px 4px;
      font-size: 0.82rem;
      color: var(--secondary-text-color);
      text-align: center;
    }
  `;

  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private _config!: WhatsDueCardConfig;
  @state() private items: Item[] = [];
  @state() private categories: Category[] = [];
  @state() private settings: Settings = {
    warning_days: 30,
    urgent_days: 7,
    critical_days: 1,
    notifications: {
      enabled: false,
      targets: [],
      statuses: ["urgent", "critical", "expired"],
    },
  };
  @state() private dialog: DialogMode = null;
  @state() private loaded = false;

  private api?: WhatsDueApi;

  public setConfig(config: WhatsDueCardConfig): void {
    this._config = {
      title: "",
      max_items: 5,
      ...config,
    };
  }

  public getCardSize(): number {
    return Math.min(this._config?.max_items ?? 5, this.items.length) + 1;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    void loadHaDependencies().catch(() => undefined);
  }

  protected override willUpdate(changed: Map<string, unknown>): void {
    if (changed.has("hass") && this.hass && !this.api) {
      this.api = new WhatsDueApi(this.hass);
      void this._refresh();
    }
  }

  private get strings(): Strings {
    return pickStrings(this.hass?.language);
  }

  private async _refresh(): Promise<void> {
    if (!this.api) return;
    const snap = await this.api.getAll();
    this.items = snap.items;
    this.categories = snap.categories;
    this.settings = snap.settings;
    this.loaded = true;
  }

  private _getCategory(id: string): Category | undefined {
    return this.categories.find((c) => c.id === id);
  }

  private _visibleItems(): Item[] {
    const byCategory = (i: Item) =>
      !this._config.category || i.category_id === this._config.category;
    return this.items
      .filter((i) => i.status !== "completed")
      .filter(byCategory)
      .sort((a, b) => a.days_until_due - b.days_until_due);
  }

  // ---------- item actions ----------

  private _openAddItem = () => {
    const cat = this._config.category ?? this.categories[0]?.id ?? "other";
    this.dialog = { kind: "item", draft: emptyDraft(cat) };
  };

  private _openEditItem(item: Item) {
    this.dialog = { kind: "item", draft: draftFromItem(item) };
  }

  private async _markDone(item: Item) {
    if (!this.api) return;
    await this.api.markDone(item.id);
    await this._refresh();
  }

  private async _saveItem(draft: ItemDraft) {
    if (!this.api) return;
    const payload = {
      name: draft.name.trim(),
      due_date: draft.due_date,
      category_id: draft.category_id,
      icon: draft.icon || "mdi:calendar",
      notes: draft.notes,
      recurrence: draft.recurrence,
      recurrence_days:
        draft.recurrence === "custom"
          ? draft.recurrence_days ?? undefined
          : undefined,
    };
    if (draft.id) await this.api.updateItem(draft.id, payload);
    else await this.api.addItem(payload);
    this.dialog = null;
    await this._refresh();
  }

  // ---------- categories ----------

  private _openCategories = () => {
    this.dialog = { kind: "categories" };
  };

  private _openAddCategory = () => {
    this.dialog = { kind: "category", draft: emptyCategoryDraft() };
  };

  private _openEditCategory(c: Category) {
    this.dialog = { kind: "category", draft: draftFromCategory(c) };
  }

  private async _deleteCategory(c: Category) {
    if (!this.api) return;
    if (!confirm(this.strings.confirmDeleteCategory)) return;
    await this.api.deleteCategory(c.id);
    await this._refresh();
  }

  private async _saveCategory(draft: CategoryDraft) {
    if (!this.api) return;
    if (draft.id) {
      await this.api.updateCategory(draft.id, {
        name: draft.name.trim(),
        icon: draft.icon,
        color: draft.color,
      });
    } else {
      await this.api.addCategory({
        name: draft.name.trim(),
        icon: draft.icon,
        color: draft.color,
      });
    }
    await this._refresh();
    this.dialog = { kind: "categories" };
  }

  // ---------- settings ----------

  private _openSettings = () => {
    this.dialog = { kind: "settings" };
  };

  private async _saveSettings(settings: Settings) {
    if (!this.api) return;
    await this.api.updateSettings(settings);
    this.dialog = null;
    await this._refresh();
  }

  // ---------- utils ----------

  private _formatDays(item: Item): string {
    const d = item.days_until_due;
    const s = this.strings;
    if (d < 0) return `${Math.abs(d)} ${s.daysOverdue}`;
    if (d === 0) return s.dueToday;
    if (d === 1) return s.dueTomorrow;
    return `${d} ${s.daysLeft}`;
  }

  private _closeDialog = () => {
    this.dialog = null;
  };

  // ---------- render ----------

  override render() {
    if (!this._config) return nothing;
    const s = this.strings;
    const title = this._config.title || s.title;
    const visible = this._visibleItems();
    const max = this._config.max_items ?? 5;
    const shown = max > 0 ? visible.slice(0, max) : visible;
    const hiddenCount = visible.length - shown.length;

    return html`
      <ha-card>
        <div class="card-header">
          <div class="name">${title}</div>
          <ha-icon-button .label=${s.addItem} @click=${this._openAddItem}>
            <ha-icon icon="mdi:plus"></ha-icon>
          </ha-icon-button>
          <ha-icon-button
            .label=${s.categories}
            @click=${this._openCategories}
          >
            <ha-icon icon="mdi:tag-multiple"></ha-icon>
          </ha-icon-button>
          <ha-icon-button .label=${s.settings} @click=${this._openSettings}>
            <ha-icon icon="mdi:cog"></ha-icon>
          </ha-icon-button>
        </div>

        <div class="card-content">
          ${!this.loaded
            ? nothing
            : shown.length === 0
            ? html`<div class="empty">${s.empty}</div>`
            : shown.map((item) => this._renderRow(item))}
          ${hiddenCount > 0
            ? html`<div class="more">+${hiddenCount} ${s.moreItems}</div>`
            : nothing}
        </div>

        ${this._renderDialog()}
      </ha-card>
    `;
  }

  private _renderRow(item: Item) {
    const cat = this._getCategory(item.category_id);
    const s = this.strings;
    return html`
      <div
        class="row status-${item.status}"
        tabindex="0"
        @click=${() => this._openEditItem(item)}
      >
        <div class="icon" style="background: ${cat?.color ?? "#78909C"}">
          <ha-icon .icon=${item.icon}></ha-icon>
        </div>
        <div class="main">
          <div class="title">${item.name}</div>
          <div class="sub">${cat?.name ?? "—"} · ${item.due_date}</div>
        </div>
        <div class="days">${this._formatDays(item)}</div>
        <ha-icon-button
          class="done-btn"
          .label=${s.markDone}
          @click=${(e: Event) => {
            e.stopPropagation();
            void this._markDone(item);
          }}
        >
          <ha-icon icon="mdi:check"></ha-icon>
        </ha-icon-button>
      </div>
    `;
  }

  private _renderDialog() {
    if (!this.dialog) return nothing;
    const s = this.strings;

    if (this.dialog.kind === "item") {
      return html`
        <wd-item-dialog
          .strings=${s}
          .categories=${this.categories}
          .draft=${this.dialog.draft}
          @save=${(e: CustomEvent<ItemDraft>) => this._saveItem(e.detail)}
          @cancel=${this._closeDialog}
        ></wd-item-dialog>
      `;
    }

    if (this.dialog.kind === "categories") {
      return html`
        <wd-categories-dialog
          .strings=${s}
          .categories=${this.categories}
          @close=${this._closeDialog}
          @add=${this._openAddCategory}
          @edit=${(e: CustomEvent<Category>) => this._openEditCategory(e.detail)}
          @delete=${(e: CustomEvent<Category>) =>
            this._deleteCategory(e.detail)}
        ></wd-categories-dialog>
      `;
    }

    if (this.dialog.kind === "category") {
      return html`
        <wd-category-dialog
          .strings=${s}
          .draft=${this.dialog.draft}
          @save=${(e: CustomEvent<CategoryDraft>) =>
            this._saveCategory(e.detail)}
          @cancel=${() => (this.dialog = { kind: "categories" })}
        ></wd-category-dialog>
      `;
    }

    if (this.dialog.kind === "settings") {
      const notifyServices = Object.keys(this.hass?.services?.notify ?? {});
      return html`
        <wd-settings-dialog
          .strings=${s}
          .settings=${this.settings}
          .notifyServices=${notifyServices}
          @save=${(e: CustomEvent<Settings>) => this._saveSettings(e.detail)}
          @cancel=${this._closeDialog}
        ></wd-settings-dialog>
      `;
    }

    return nothing;
  }
}

// Register in Lovelace's custom card picker so users find it by name.
const win = window as unknown as { customCards?: Array<Record<string, unknown>> };
win.customCards = win.customCards ?? [];
if (!win.customCards.some((c) => c.type === "whats-due-card")) {
  win.customCards.push({
    type: "whats-due-card",
    name: "What's Due",
    description: "Upcoming due dates from the What's Due integration.",
    documentationURL: "https://github.com/SolsticeHA/What-s-Due",
    preview: false,
  });
}

defineOnce("whats-due-card", WhatsDueCard);

declare global {
  interface HTMLElementTagNameMap {
    "whats-due-card": WhatsDueCard;
  }
}

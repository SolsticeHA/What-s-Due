import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { WhatsDueApi } from "./api.js";
import { loadHaDependencies } from "./ha-elements.js";
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

type DialogMode =
  | { kind: "item"; draft: ItemDraft }
  | { kind: "categories" }
  | { kind: "category"; draft: CategoryDraft }
  | { kind: "settings" }
  | null;

@customElement("whats-due-panel")
export class WhatsDuePanel extends LitElement {
  static override styles = css`
    :host {
      display: block;
      height: 100vh;
      background: var(--primary-background-color);
      color: var(--primary-text-color);
      font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif);
      --wd-status-ok: var(--success-color, #4caf50);
      --wd-status-warning: #ffc107;
      --wd-status-urgent: #ff9800;
      --wd-status-critical: #f44336;
      --wd-status-expired: #b71c1c;
    }

    .app {
      display: flex;
      flex-direction: column;
      height: 100%;
      box-sizing: border-box;
    }

    header.bar {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 10px 12px;
      background: var(--app-header-background-color, var(--primary-color));
      color: var(--app-header-text-color, #fff);
      box-shadow: var(--ha-card-box-shadow, 0 2px 4px rgba(0, 0, 0, 0.1));
      --mdc-icon-button-size: 40px;
    }
    header.bar h1 {
      margin: 0 8px;
      font-size: 1.2rem;
      font-weight: 500;
      flex: 1;
    }

    .chips {
      display: flex;
      gap: 8px;
      padding: 10px 16px;
      overflow-x: auto;
      scrollbar-width: thin;
      border-bottom: 1px solid var(--divider-color);
    }
    .chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 999px;
      background: var(--secondary-background-color);
      border: 1px solid var(--divider-color);
      cursor: pointer;
      white-space: nowrap;
      font-size: 0.85rem;
      color: var(--primary-text-color);
      transition: transform 120ms ease;
    }
    .chip:hover { transform: translateY(-1px); }
    .chip.active {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      border-color: transparent;
    }
    .chip ha-icon { --mdc-icon-size: 18px; }

    .search {
      padding: 10px 16px 4px;
    }

    .grid {
      flex: 1;
      overflow-y: auto;
      padding: 12px 16px 96px;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 12px;
      align-content: start;
    }

    ha-card {
      position: relative;
      padding: 14px 16px;
      display: flex;
      gap: 14px;
      align-items: flex-start;
      border-left: 4px solid transparent;
      transition: transform 120ms ease;
    }
    ha-card:hover { transform: translateY(-1px); }
    ha-card.status-ok { border-left-color: var(--wd-status-ok); }
    ha-card.status-warning { border-left-color: var(--wd-status-warning); }
    ha-card.status-urgent { border-left-color: var(--wd-status-urgent); }
    ha-card.status-critical { border-left-color: var(--wd-status-critical); }
    ha-card.status-expired { border-left-color: var(--wd-status-expired); }

    .icon-wrap {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      color: #fff;
    }
    .icon-wrap ha-icon { --mdc-icon-size: 24px; }

    .body { flex: 1; min-width: 0; }
    .body h3 {
      margin: 0 0 2px;
      font-size: 1rem;
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .meta {
      font-size: 0.8rem;
      color: var(--secondary-text-color);
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    .days {
      font-weight: 600;
      font-size: 0.95rem;
      margin-top: 4px;
    }
    .status-expired .days,
    .status-critical .days { color: var(--wd-status-critical); }
    .status-urgent .days { color: var(--wd-status-urgent); }
    .status-warning .days { color: var(--wd-status-warning); }
    .status-ok .days { color: var(--wd-status-ok); }

    .actions {
      display: flex;
      gap: 2px;
      margin-left: auto;
      --mdc-icon-button-size: 36px;
      --mdc-icon-size: 20px;
    }

    .empty {
      grid-column: 1 / -1;
      padding: 40px 16px;
      text-align: center;
      color: var(--secondary-text-color);
    }

    ha-fab {
      position: fixed;
      right: 24px;
      bottom: 24px;
      z-index: 10;
    }

    ha-textfield.search-field { width: 100%; }
  `;

  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public narrow = false;
  @property({ attribute: false }) public route: unknown;
  @property({ attribute: false }) public panel: unknown;

  @state() private items: Item[] = [];
  @state() private categories: Category[] = [];
  @state() private settings: Settings = {
    warning_days: 30,
    urgent_days: 7,
    critical_days: 1,
  };
  @state() private activeCategory: string | "all" = "all";
  @state() private search = "";
  @state() private dialog: DialogMode = null;
  @state() private loaded = false;

  private api!: WhatsDueApi;

  override connectedCallback(): void {
    super.connectedCallback();
    this.api = new WhatsDueApi(this.hass);
    // Fire-and-forget: triggers HA to load ha-dialog / ha-button-menu / etc.
    // Custom elements upgrade automatically once defined, so we render the
    // UI immediately and let the framework patch it up as modules resolve.
    void loadHaDependencies().catch(() => undefined);
    void this.refresh();
  }

  private get strings(): Strings {
    return pickStrings(this.hass?.language);
  }

  private async refresh(): Promise<void> {
    const snap = await this.api.getAll();
    this.items = snap.items;
    this.categories = snap.categories;
    this.settings = snap.settings;
    this.loaded = true;
  }

  private getCategory(id: string): Category | undefined {
    return this.categories.find((c) => c.id === id);
  }

  private filteredItems(): Item[] {
    const q = this.search.trim().toLowerCase();
    return this.items
      .filter(
        (it) =>
          this.activeCategory === "all" || it.category_id === this.activeCategory
      )
      .filter(
        (it) =>
          !q ||
          it.name.toLowerCase().includes(q) ||
          (it.notes || "").toLowerCase().includes(q)
      )
      .sort((a, b) => a.days_until_due - b.days_until_due);
  }

  // ---------- item actions ----------

  private openAddItem = () => {
    const cat = this.categories[0]?.id ?? "other";
    this.dialog = { kind: "item", draft: emptyDraft(cat) };
  };

  private openEditItem(item: Item) {
    this.dialog = { kind: "item", draft: draftFromItem(item) };
  }

  private async deleteItem(item: Item) {
    if (!confirm(this.strings.confirmDelete)) return;
    await this.api.deleteItem(item.id);
    await this.refresh();
  }

  private async markDone(item: Item) {
    await this.api.markDone(item.id);
    await this.refresh();
  }

  private async saveItem(draft: ItemDraft) {
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
    await this.refresh();
  }

  // ---------- categories ----------

  private openCategories = () => {
    this.dialog = { kind: "categories" };
  };

  private openAddCategory = () => {
    this.dialog = { kind: "category", draft: emptyCategoryDraft() };
  };

  private openEditCategory(c: Category) {
    this.dialog = { kind: "category", draft: draftFromCategory(c) };
  }

  private async deleteCategory(c: Category) {
    if (!confirm(this.strings.confirmDeleteCategory)) return;
    await this.api.deleteCategory(c.id);
    await this.refresh();
    if (this.activeCategory === c.id) this.activeCategory = "all";
  }

  private async saveCategory(draft: CategoryDraft) {
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
    await this.refresh();
    this.dialog = { kind: "categories" };
  }

  // ---------- settings ----------

  private openSettings = () => {
    this.dialog = { kind: "settings" };
  };

  private async saveSettings(settings: Settings) {
    await this.api.updateSettings(settings);
    this.dialog = null;
    await this.refresh();
  }

  // ---------- utils ----------

  private formatDays(item: Item): string {
    const d = item.days_until_due;
    const s = this.strings;
    if (d < 0) return `${Math.abs(d)} ${s.daysOverdue}`;
    if (d === 0) return s.dueToday;
    if (d === 1) return s.dueTomorrow;
    return `${d} ${s.daysLeft}`;
  }

  private closeDialog = () => {
    this.dialog = null;
  };

  // ---------- render ----------

  override render() {
    const s = this.strings;
    const filtered = this.filteredItems();

    return html`
      <div class="app">
        <header class="bar">
          <h1>${s.title}</h1>
          <ha-icon-button
            .label=${s.categories}
            @click=${this.openCategories}
          >
            <ha-icon icon="mdi:tag-multiple"></ha-icon>
          </ha-icon-button>
          <ha-icon-button
            .label=${s.settings}
            @click=${this.openSettings}
          >
            <ha-icon icon="mdi:cog"></ha-icon>
          </ha-icon-button>
        </header>

        <div class="chips">
          <button
            class="chip ${this.activeCategory === "all" ? "active" : ""}"
            @click=${() => (this.activeCategory = "all")}
          >
            <ha-icon icon="mdi:view-grid"></ha-icon>
            <span>${s.all}</span>
          </button>
          ${this.categories.map(
            (c) => html`
              <button
                class="chip ${this.activeCategory === c.id ? "active" : ""}"
                @click=${() => (this.activeCategory = c.id)}
              >
                <ha-icon .icon=${c.icon}></ha-icon>
                <span>${c.name}</span>
              </button>
            `
          )}
        </div>

        <div class="search">
          <ha-textfield
            class="search-field"
            icon
            .placeholder=${s.searchPlaceholder}
            .value=${this.search}
            @input=${(e: Event) =>
              (this.search = (e.target as HTMLInputElement).value)}
          >
            <ha-icon slot="leadingIcon" icon="mdi:magnify"></ha-icon>
          </ha-textfield>
        </div>

        <div class="grid">
          ${!this.loaded
            ? nothing
            : filtered.length === 0
            ? html`<div class="empty">${s.empty}</div>`
            : filtered.map((item) => this._renderCard(item))}
        </div>

        <ha-fab
          .label=${s.addItem}
          extended
          @click=${this.openAddItem}
        >
          <ha-icon slot="icon" icon="mdi:plus"></ha-icon>
          ${s.addItem}
        </ha-fab>

        ${this._renderDialog()}
      </div>
    `;
  }

  private _renderCard(item: Item) {
    const cat = this.getCategory(item.category_id);
    const s = this.strings;
    return html`
      <ha-card class="status-${item.status}">
        <div class="icon-wrap" style="background: ${cat?.color ?? "#78909C"}">
          <ha-icon .icon=${item.icon}></ha-icon>
        </div>
        <div class="body">
          <h3>${item.name}</h3>
          <div class="meta">
            <span>${cat?.name ?? "—"}</span>
            <span>${item.due_date}</span>
          </div>
          <div class="days">${this.formatDays(item)}</div>
        </div>
        <div class="actions">
          <ha-icon-button
            .label=${s.markDone}
            @click=${() => this.markDone(item)}
          >
            <ha-icon icon="mdi:check"></ha-icon>
          </ha-icon-button>
          <ha-icon-button
            .label=${s.editItem}
            @click=${() => this.openEditItem(item)}
          >
            <ha-icon icon="mdi:pencil"></ha-icon>
          </ha-icon-button>
          <ha-icon-button
            .label=${s.deleteItem}
            @click=${() => this.deleteItem(item)}
          >
            <ha-icon icon="mdi:delete"></ha-icon>
          </ha-icon-button>
        </div>
      </ha-card>
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
          @save=${(e: CustomEvent<ItemDraft>) => this.saveItem(e.detail)}
          @cancel=${this.closeDialog}
        ></wd-item-dialog>
      `;
    }

    if (this.dialog.kind === "categories") {
      return html`
        <wd-categories-dialog
          .strings=${s}
          .categories=${this.categories}
          @close=${this.closeDialog}
          @add=${this.openAddCategory}
          @edit=${(e: CustomEvent<Category>) => this.openEditCategory(e.detail)}
          @delete=${(e: CustomEvent<Category>) =>
            this.deleteCategory(e.detail)}
        ></wd-categories-dialog>
      `;
    }

    if (this.dialog.kind === "category") {
      return html`
        <wd-category-dialog
          .strings=${s}
          .draft=${this.dialog.draft}
          @save=${(e: CustomEvent<CategoryDraft>) =>
            this.saveCategory(e.detail)}
          @cancel=${() => (this.dialog = { kind: "categories" })}
        ></wd-category-dialog>
      `;
    }

    if (this.dialog.kind === "settings") {
      return html`
        <wd-settings-dialog
          .strings=${s}
          .settings=${this.settings}
          @save=${(e: CustomEvent<Settings>) => this.saveSettings(e.detail)}
          @cancel=${this.closeDialog}
        ></wd-settings-dialog>
      `;
    }

    return nothing;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "whats-due-panel": WhatsDuePanel;
  }
}

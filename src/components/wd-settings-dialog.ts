import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { layoutStyles } from "../shared-styles.js";
import type { Strings } from "../i18n.js";
import type { NotificationSettings, Settings } from "../types.js";

const NOTIFY_STATUS_KEYS = ["warning", "urgent", "critical", "expired"] as const;
type NotifyStatusKey = (typeof NOTIFY_STATUS_KEYS)[number];

@customElement("wd-settings-dialog")
export class WdSettingsDialog extends LitElement {
  static override styles = [
    layoutStyles,
    css`
      .form { display: grid; gap: 14px; padding: 4px 0; min-width: 320px; }
      .hint {
        font-size: 0.85rem;
        color: var(--secondary-text-color);
        line-height: 1.4;
        margin: 0;
      }
      .section-title {
        font-size: 0.95rem;
        font-weight: 500;
        margin: 8px 0 -4px;
        padding-top: 6px;
        border-top: 1px solid var(--divider-color);
      }
      .toggle-row {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .toggle-row input[type="checkbox"] {
        width: 18px;
        height: 18px;
        accent-color: var(--primary-color);
        cursor: pointer;
      }
      .status-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
        gap: 8px;
      }
    `,
  ];

  @property({ attribute: false }) public strings!: Strings;
  @property({ attribute: false }) public settings!: Settings;

  @state() private _local!: Settings;
  @state() private _targetsText = "";

  override willUpdate(changed: Map<string, unknown>): void {
    if (changed.has("settings") && this.settings) {
      this._local = {
        ...this.settings,
        notifications: {
          ...this.settings.notifications,
          targets: [...(this.settings.notifications?.targets ?? [])],
          statuses: [...(this.settings.notifications?.statuses ?? [])],
        },
      };
      this._targetsText = this._local.notifications.targets.join(", ");
    }
  }

  private _patch<K extends keyof Settings>(k: K, v: Settings[K]): void {
    this._local = { ...this._local, [k]: v };
    this.requestUpdate();
  }

  private _patchNotif<K extends keyof NotificationSettings>(
    k: K,
    v: NotificationSettings[K]
  ): void {
    this._local = {
      ...this._local,
      notifications: { ...this._local.notifications, [k]: v },
    };
    this.requestUpdate();
  }

  private _toggleStatus(key: NotifyStatusKey, checked: boolean): void {
    const current = new Set(this._local.notifications.statuses);
    if (checked) current.add(key);
    else current.delete(key);
    this._patchNotif("statuses", Array.from(current));
  }

  private _num(e: Event): number {
    const v = parseInt((e.target as HTMLInputElement).value, 10);
    return Number.isFinite(v) && v >= 0 ? v : 0;
  }

  private _cancel = () => this.dispatchEvent(new CustomEvent("cancel"));

  private _save = () => {
    // Parse the free-text targets into a clean string array on save.
    // Strip "notify." prefix in case a user copy-pasted the full name.
    const targets = this._targetsText
      .split(",")
      .map((t) => t.trim().replace(/^notify\./, ""))
      .filter((t) => t.length > 0);
    const payload: Settings = {
      ...this._local,
      notifications: { ...this._local.notifications, targets },
    };
    this.dispatchEvent(new CustomEvent<Settings>("save", { detail: payload }));
  };

  private _statusLabel(key: NotifyStatusKey): string {
    const s = this.strings;
    switch (key) {
      case "warning":
        return s.statusWarning;
      case "urgent":
        return s.statusUrgent;
      case "critical":
        return s.statusCritical;
      case "expired":
        return s.statusExpired;
    }
  }

  override render() {
    if (!this._local) return nothing;
    const s = this.strings;
    const d = this._local;
    const n = d.notifications;

    return html`
      <ha-dialog
        open
        heading=${s.settings}
        @closed=${(e: CustomEvent<{ action?: string } | null>) => {
          if (e.detail?.action) this._cancel();
        }}
      >
        <div class="form">
          <p class="hint">
            ${s.warningDays} &gt; ${s.urgentDays} &gt; ${s.criticalDays}
          </p>
          <ha-textfield
            .label=${s.warningDays}
            type="number"
            min="1"
            .value=${String(d.warning_days)}
            @input=${(e: Event) => this._patch("warning_days", this._num(e))}
          ></ha-textfield>
          <ha-textfield
            .label=${s.urgentDays}
            type="number"
            min="1"
            .value=${String(d.urgent_days)}
            @input=${(e: Event) => this._patch("urgent_days", this._num(e))}
          ></ha-textfield>
          <ha-textfield
            .label=${s.criticalDays}
            type="number"
            min="0"
            .value=${String(d.critical_days)}
            @input=${(e: Event) => this._patch("critical_days", this._num(e))}
          ></ha-textfield>

          <div class="section-title">${s.notifications}</div>

          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${n.enabled}
              @change=${(e: Event) =>
                this._patchNotif(
                  "enabled",
                  (e.target as HTMLInputElement).checked
                )}
            />
            <span>${s.notificationsEnabled}</span>
          </label>

          <ha-textfield
            .label=${s.notificationsTargets}
            .value=${this._targetsText}
            .disabled=${!n.enabled}
            @input=${(e: Event) =>
              (this._targetsText = (e.target as HTMLInputElement).value)}
          ></ha-textfield>
          <p class="hint">${s.notificationsTargetsHint}</p>

          <div>
            <div class="hint" style="margin-bottom: 6px;">
              ${s.notificationsStatuses}
            </div>
            <div class="status-grid">
              ${NOTIFY_STATUS_KEYS.map(
                (key) => html`
                  <label class="toggle-row">
                    <input
                      type="checkbox"
                      .checked=${n.statuses.includes(key)}
                      .disabled=${!n.enabled}
                      @change=${(e: Event) =>
                        this._toggleStatus(
                          key,
                          (e.target as HTMLInputElement).checked
                        )}
                    />
                    <span>${this._statusLabel(key)}</span>
                  </label>
                `
              )}
            </div>
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
    "wd-settings-dialog": WdSettingsDialog;
  }
}

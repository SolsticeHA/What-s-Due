import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import type { Strings } from "../i18n.js";
import type { Settings } from "../types.js";

@customElement("wd-settings-dialog")
export class WdSettingsDialog extends LitElement {
  static override styles = css`
    .form { display: grid; gap: 12px; padding: 4px 0; min-width: 280px; }
    .hint {
      font-size: 0.85rem;
      color: var(--secondary-text-color);
      line-height: 1.4;
    }
  `;

  @property({ attribute: false }) public strings!: Strings;
  @property({ attribute: false }) public settings!: Settings;

  @state() private _local!: Settings;

  override willUpdate(changed: Map<string, unknown>): void {
    if (changed.has("settings") && this.settings) {
      this._local = { ...this.settings };
    }
  }

  private _patch<K extends keyof Settings>(k: K, v: Settings[K]): void {
    this._local = { ...this._local, [k]: v };
    this.requestUpdate();
  }

  private _num(e: Event): number {
    const v = parseInt((e.target as HTMLInputElement).value, 10);
    return Number.isFinite(v) && v >= 0 ? v : 0;
  }

  private _cancel = () => this.dispatchEvent(new CustomEvent("cancel"));

  private _save = () => {
    this.dispatchEvent(
      new CustomEvent<Settings>("save", { detail: this._local })
    );
  };

  override render() {
    if (!this._local) return nothing;
    const s = this.strings;
    const d = this._local;

    return html`
      <ha-dialog open heading=${s.settings} @closed=${this._cancel}>
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
        </div>

        <mwc-button slot="secondaryAction" @click=${this._cancel}>
          ${s.cancel}
        </mwc-button>
        <mwc-button slot="primaryAction" @click=${this._save}>
          ${s.save}
        </mwc-button>
      </ha-dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "wd-settings-dialog": WdSettingsDialog;
  }
}

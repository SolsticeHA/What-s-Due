import { LitElement, html, css, nothing } from "lit";
import { property } from "lit/decorators.js";
import { defineOnce, hasHaComponent } from "../ha-elements.js";

/**
 * Thin wrapper around `ha-icon-picker`. Falls back to `ha-textfield` if HA's
 * icon picker hasn't been upgraded yet (rare — happens on first panel load).
 * Emits `value-changed` with { detail: { value } } to match HA conventions.
 */
export class WdIconPicker extends LitElement {
  static override styles = css`
    :host { display: block; }
    ha-icon-picker, ha-textfield { width: 100%; }
  `;

  @property() public label = "";
  @property() public value = "";

  override render() {
    if (hasHaComponent("ha-icon-picker")) {
      return html`
        <ha-icon-picker
          .label=${this.label}
          .value=${this.value}
          @value-changed=${this._onChange}
        ></ha-icon-picker>
      `;
    }
    return html`
      <ha-textfield
        .label=${this.label}
        .value=${this.value}
        @input=${(e: Event) => {
          const v = (e.target as HTMLInputElement).value;
          this._emit(v);
        }}
      ></ha-textfield>
      ${this.value
        ? html`<ha-icon .icon=${this.value}></ha-icon>`
        : nothing}
    `;
  }

  private _onChange = (e: CustomEvent<{ value: string }>) => {
    this._emit(e.detail.value);
  };

  private _emit(value: string) {
    this.value = value;
    this.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value },
        bubbles: true,
        composed: true,
      })
    );
  }
}

defineOnce("wd-icon-picker", WdIconPicker);

declare global {
  interface HTMLElementTagNameMap {
    "wd-icon-picker": WdIconPicker;
  }
}

// Type helpers & runtime guards for Home Assistant's built-in custom elements.
// We don't import their source — HA frontend registers them globally before
// our panel loads. We just rely on the tag names in Lit templates.
//
// Listed here so devs know what to expect and for a one-stop helper.

export const HA_COMPONENTS = [
  "ha-dialog",
  "ha-card",
  "ha-fab",
  "ha-icon",
  "ha-icon-button",
  "ha-icon-picker",
  "ha-textfield",
  "ha-textarea",
  "ha-select",
  "ha-button",
  "ha-button-menu",
  "ha-chip-set",
  "ha-svg-icon",
  "mwc-list-item",
  "mwc-button",
] as const;

export function hasHaComponent(tag: string): boolean {
  return customElements.get(tag) !== undefined;
}

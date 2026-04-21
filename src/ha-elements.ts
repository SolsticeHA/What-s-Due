// Runtime loader for Home Assistant's built-in custom elements.
//
// HA frontend registers these lazily — when another page/card uses them — so
// a standalone custom panel can boot before they're defined. If we render
// while tags like `ha-dialog` or `ha-button-menu` are unknown, the DOM shows
// their slot content inline and click handlers never fire.
//
// `loadCardHelpers()` is a global exposed by HA frontend that force-loads the
// card/dialog modules. We call it, then wait for the critical tags (with a
// timeout so we never hang indefinitely on older/customized HA builds).

const CRITICAL_TAGS = [
  "ha-dialog",
  "ha-button-menu",
  "ha-select",
  "ha-textfield",
  "ha-textarea",
  "ha-icon-picker",
  "mwc-button",
  "mwc-list-item",
] as const;

type CardHelpersGlobal = {
  loadCardHelpers?: () => Promise<unknown>;
};

export function hasHaComponent(tag: string): boolean {
  return customElements.get(tag) !== undefined;
}

export async function loadHaDependencies(
  timeoutMs = 5000
): Promise<void> {
  const w = window as unknown as CardHelpersGlobal;
  if (typeof w.loadCardHelpers === "function") {
    try {
      await w.loadCardHelpers();
    } catch {
      // Helper may throw on very old HA; fall through to whenDefined.
    }
  }

  const waits = CRITICAL_TAGS.map((tag) => customElements.whenDefined(tag));
  await Promise.race([
    Promise.all(waits),
    new Promise((resolve) => setTimeout(resolve, timeoutMs)),
  ]);
}

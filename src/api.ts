import type {
  Category,
  HomeAssistant,
  Item,
  Recurrence,
  Settings,
  StateSnapshot,
} from "./types.js";

const DOMAIN = "whats_due";

export class WhatsDueApi {
  constructor(private readonly hass: HomeAssistant) {}

  getAll(): Promise<StateSnapshot> {
    return this.hass.callWS<StateSnapshot>({ type: `${DOMAIN}/get_all` });
  }

  addItem(payload: {
    name: string;
    due_date: string;
    category_id?: string;
    icon?: string;
    notes?: string;
    recurrence?: Recurrence;
    recurrence_days?: number | null;
  }): Promise<Item> {
    return this.hass.callWS<Item>({
      type: `${DOMAIN}/add_item`,
      ...stripUndefined(payload),
    });
  }

  updateItem(item_id: string, payload: Partial<Item>): Promise<Item> {
    return this.hass.callWS<Item>({
      type: `${DOMAIN}/update_item`,
      item_id,
      ...stripUndefined(payload),
    });
  }

  deleteItem(item_id: string): Promise<{ success: true }> {
    return this.hass.callWS({ type: `${DOMAIN}/delete_item`, item_id });
  }

  markDone(item_id: string): Promise<{ item: Item | null }> {
    return this.hass.callWS({ type: `${DOMAIN}/mark_done`, item_id });
  }

  addCategory(payload: {
    name: string;
    icon?: string;
    color?: string;
  }): Promise<Category> {
    return this.hass.callWS<Category>({
      type: `${DOMAIN}/add_category`,
      ...stripUndefined(payload),
    });
  }

  updateCategory(
    category_id: string,
    payload: Partial<Category>
  ): Promise<Category> {
    return this.hass.callWS<Category>({
      type: `${DOMAIN}/update_category`,
      category_id,
      ...stripUndefined(payload),
    });
  }

  deleteCategory(category_id: string): Promise<{ success: true }> {
    return this.hass.callWS({ type: `${DOMAIN}/delete_category`, category_id });
  }

  updateSettings(payload: Partial<Settings>): Promise<Settings> {
    return this.hass.callWS<Settings>({
      type: `${DOMAIN}/update_settings`,
      ...stripUndefined(payload),
    });
  }
}

function stripUndefined<T extends Record<string, unknown>>(obj: T): T {
  const out = {} as Record<string, unknown>;
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) out[k] = v;
  }
  return out as T;
}

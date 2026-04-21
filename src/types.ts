export type Recurrence = "none" | "monthly" | "yearly" | "custom";
export type Status = "ok" | "warning" | "urgent" | "critical" | "expired";

export interface Item {
  id: string;
  name: string;
  due_date: string;
  category_id: string;
  icon: string;
  notes?: string;
  recurrence: Recurrence;
  recurrence_days?: number | null;
  alert_overrides?: Partial<Settings> | null;
  created_at: string;
  days_until_due: number;
  status: Status;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Settings {
  warning_days: number;
  urgent_days: number;
  critical_days: number;
}

export interface StateSnapshot {
  items: Item[];
  categories: Category[];
  settings: Settings;
}

export interface HomeAssistant {
  callWS<T = unknown>(msg: Record<string, unknown>): Promise<T>;
  connection: {
    subscribeEvents(
      callback: (event: { event_type: string; data: unknown }) => void,
      eventType: string
    ): Promise<() => void>;
  };
  localize?: (key: string) => string;
  language?: string;
}

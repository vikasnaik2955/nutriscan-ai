import { create } from 'zustand';

/**
 * App preferences (notification toggles, units). In-memory for now — persist to storage /
 * backend later. Drives the Settings and Smart Alerts screens.
 */
export interface SettingsState {
  highSugarAlerts: boolean;
  highSaltAlerts: boolean;
  dailySummary: boolean;
  goalReminders: boolean;
  metricUnits: boolean;
  toggle: (key: BoolPref) => void;
}

export type BoolPref = 'highSugarAlerts' | 'highSaltAlerts' | 'dailySummary' | 'goalReminders' | 'metricUnits';

export const useSettingsStore = create<SettingsState>((set) => ({
  highSugarAlerts: true,
  highSaltAlerts: true,
  dailySummary: false,
  goalReminders: true,
  metricUnits: true,
  toggle: (key) => set((s) => ({ [key]: !s[key] }) as Pick<SettingsState, BoolPref>),
}));

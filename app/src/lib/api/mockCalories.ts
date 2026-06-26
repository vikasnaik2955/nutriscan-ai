/**
 * Dev-only calorie-log store (enabled via MOCK_AUTH). In-memory, seeded with a couple of
 * entries for today. Replaced by real /api/calories endpoints when the backend grows them.
 */
export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';

export interface CalorieEntry {
  id: number;
  name: string;
  kcal: number;
  meal: MealType;
  createdAt: string; // ISO
}

export interface CalorieDay {
  entries: CalorieEntry[];
  total: number;
  goal: number;
}

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const isToday = (iso: string) => new Date(iso).toDateString() === new Date().toDateString();

let goal = 2000;
let nextId = 1;
let entries: CalorieEntry[] = [];

function seed() {
  if (entries.length) return;
  entries.push(
    { id: nextId++, name: 'Oats with milk', kcal: 320, meal: 'Breakfast', createdAt: new Date().toISOString() },
    { id: nextId++, name: 'Banana', kcal: 105, meal: 'Snack', createdAt: new Date().toISOString() },
  );
}
seed();

function buildDay(): CalorieDay {
  const today = entries.filter((e) => isToday(e.createdAt));
  return { entries: today, total: today.reduce((a, e) => a + e.kcal, 0), goal };
}

export const mockCalories = {
  async today(): Promise<CalorieDay> {
    await delay(150);
    return buildDay();
  },
  async add(input: { name: string; kcal: number; meal: MealType }): Promise<CalorieDay> {
    await delay(200);
    entries.unshift({ id: nextId++, ...input, createdAt: new Date().toISOString() });
    return buildDay();
  },
  async remove(id: number): Promise<CalorieDay> {
    await delay(150);
    entries = entries.filter((e) => e.id !== id);
    return buildDay();
  },
  async setGoal(next: number): Promise<CalorieDay> {
    await delay(120);
    goal = Math.max(800, Math.min(6000, Math.round(next)));
    return buildDay();
  },
};

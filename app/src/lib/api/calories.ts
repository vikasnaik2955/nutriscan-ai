import { apiRequest } from './client';
import { MOCK_AUTH } from '@/config/env';
import { mockCalories, type CalorieDay, type MealType } from './mockCalories';

export interface AddCalorieRequest {
  name: string;
  kcal: number;
  meal: MealType;
}

/**
 * Calorie tracker endpoints (a full-scope backend addition, not in the original LOCKED SPEC).
 * Mock-gated like the rest; real paths are placeholders until the backend grows them.
 */
export const calorieApi = {
  today: () => (MOCK_AUTH ? mockCalories.today() : apiRequest<CalorieDay>('/calories/today')),
  add: (req: AddCalorieRequest) =>
    MOCK_AUTH ? mockCalories.add(req) : apiRequest<CalorieDay>('/calories', { method: 'POST', body: req }),
  remove: (id: number) =>
    MOCK_AUTH ? mockCalories.remove(id) : apiRequest<CalorieDay>(`/calories/${id}`, { method: 'DELETE' }),
  setGoal: (goal: number) =>
    MOCK_AUTH ? mockCalories.setGoal(goal) : apiRequest<CalorieDay>('/calories/goal', { method: 'PUT', body: { goal } }),
};

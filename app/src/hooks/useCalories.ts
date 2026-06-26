import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { calorieApi, type AddCalorieRequest } from '@/lib/api/calories';
import type { CalorieDay } from '@/lib/api/mockCalories';

const KEY = ['calories', 'today'] as const;

export function useCalorieDay() {
  return useQuery({ queryKey: KEY, queryFn: calorieApi.today });
}

export function useAddCalorie() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: AddCalorieRequest) => calorieApi.add(req),
    onSuccess: (day: CalorieDay) => qc.setQueryData(KEY, day),
  });
}

export function useRemoveCalorie() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => calorieApi.remove(id),
    onSuccess: (day: CalorieDay) => qc.setQueryData(KEY, day),
  });
}

export function useSetCalorieGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (goal: number) => calorieApi.setGoal(goal),
    onSuccess: (day: CalorieDay) => qc.setQueryData(KEY, day),
  });
}

package com.nutriscan.dto;

import com.nutriscan.domain.Nutrition;

/** Per-100g nutrition view. Mirrors the app's Nutrition type. */
public record NutritionDto(
        Double energyKcal,
        Double proteins,
        Double carbohydrates,
        Double sugars,
        Double fat,
        Double saturatedFat,
        Double fiber,
        Double salt
) {
    public static NutritionDto from(Nutrition n) {
        if (n == null) {
            return new NutritionDto(null, null, null, null, null, null, null, null);
        }
        return new NutritionDto(
                n.getEnergyKcal(), n.getProteins(), n.getCarbohydrates(), n.getSugars(),
                n.getFat(), n.getSaturatedFat(), n.getFiber(), n.getSalt());
    }
}

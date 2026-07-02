package com.nutriscan.integration.openfoodfacts;

import com.nutriscan.domain.Nutrition;

/** Normalized product fetched from an upstream source, ready to be cached as a {@link com.nutriscan.domain.Product}. */
public record FetchedProduct(
        String name,
        String brand,
        String imageUrl,
        String servingSize,
        String nutriScoreGrade,
        Nutrition nutrition
) {
}

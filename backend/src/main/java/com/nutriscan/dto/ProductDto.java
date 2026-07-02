package com.nutriscan.dto;

import com.nutriscan.domain.Product;

import java.time.Instant;

/** Public view of a cached product. */
public record ProductDto(
        String barcode,
        String name,
        String brand,
        String imageUrl,
        String servingSize,
        String nutriScoreGrade,
        String source,
        NutritionDto nutrition,
        Instant fetchedAt
) {
    public static ProductDto from(Product p) {
        return new ProductDto(
                p.getBarcode(), p.getName(), p.getBrand(), p.getImageUrl(),
                p.getServingSize(), p.getNutriScoreGrade(), p.getSource(),
                NutritionDto.from(p.getNutrition()), p.getFetchedAt());
    }
}

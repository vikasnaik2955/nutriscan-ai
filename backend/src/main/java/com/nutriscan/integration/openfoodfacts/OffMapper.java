package com.nutriscan.integration.openfoodfacts;

import com.nutriscan.domain.Nutrition;
import com.nutriscan.integration.openfoodfacts.OffResponse.OffNutriments;
import com.nutriscan.integration.openfoodfacts.OffResponse.OffProduct;

import java.util.Optional;

/** Maps the raw OFF product into our normalized {@link FetchedProduct}. */
final class OffMapper {

    private OffMapper() {
    }

    /** Salt = sodium * 2.5 (standard conversion) when a label only reports sodium. */
    private static final double SODIUM_TO_SALT = 2.5;

    static Optional<FetchedProduct> toFetched(OffProduct product) {
        if (product == null || (product.productName() == null && product.nutriments() == null)) {
            return Optional.empty();
        }

        OffNutriments n = product.nutriments();
        Nutrition nutrition = Nutrition.builder()
                .energyKcal(n == null ? null : n.energyKcal())
                .proteins(n == null ? null : n.proteins())
                .carbohydrates(n == null ? null : n.carbohydrates())
                .sugars(n == null ? null : n.sugars())
                .fat(n == null ? null : n.fat())
                .saturatedFat(n == null ? null : n.saturatedFat())
                .fiber(n == null ? null : n.fiber())
                .salt(n == null ? null : deriveSalt(n.salt(), n.sodium()))
                .build();

        return Optional.of(new FetchedProduct(
                blankToNull(product.productName()),
                firstBrand(product.brands()),
                blankToNull(product.imageUrl()),
                blankToNull(product.servingSize()),
                blankToNull(product.nutriscoreGrade()),
                nutrition));
    }

    private static Double deriveSalt(Double salt, Double sodium) {
        if (salt != null) return salt;
        return sodium != null ? Math.round(sodium * SODIUM_TO_SALT * 1000.0) / 1000.0 : null;
    }

    private static String firstBrand(String brands) {
        if (brands == null || brands.isBlank()) return null;
        return brands.split(",")[0].trim();
    }

    private static String blankToNull(String s) {
        return (s == null || s.isBlank()) ? null : s;
    }
}

package com.nutriscan.integration.openfoodfacts;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Subset of the Open Food Facts v2 product response we care about. Everything else is ignored.
 * https://world.openfoodfacts.org/api/v2/product/{barcode}
 */
public class OffResponse {

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Root(Integer status, OffProduct product) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record OffProduct(
            @JsonProperty("product_name") String productName,
            String brands,
            @JsonProperty("image_url") String imageUrl,
            @JsonProperty("serving_size") String servingSize,
            @JsonProperty("nutriscore_grade") String nutriscoreGrade,
            OffNutriments nutriments
    ) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record OffNutriments(
            @JsonProperty("energy-kcal_100g") Double energyKcal,
            @JsonProperty("proteins_100g") Double proteins,
            @JsonProperty("carbohydrates_100g") Double carbohydrates,
            @JsonProperty("sugars_100g") Double sugars,
            @JsonProperty("fat_100g") Double fat,
            @JsonProperty("saturated-fat_100g") Double saturatedFat,
            @JsonProperty("fiber_100g") Double fiber,
            @JsonProperty("salt_100g") Double salt,
            @JsonProperty("sodium_100g") Double sodium
    ) {
    }
}

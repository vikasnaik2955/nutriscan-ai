package com.nutriscan.integration.openfoodfacts;

import org.springframework.boot.context.properties.ConfigurationProperties;

/** Binds {@code nutriscan.open-food-facts.*} from application.yml. */
@ConfigurationProperties(prefix = "nutriscan.open-food-facts")
public record OpenFoodFactsProperties(String baseUrl, String userAgent, long cacheTtlHours) {
}

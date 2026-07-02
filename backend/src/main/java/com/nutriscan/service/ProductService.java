package com.nutriscan.service;

import com.nutriscan.domain.Product;
import com.nutriscan.integration.openfoodfacts.FetchedProduct;
import com.nutriscan.integration.openfoodfacts.OpenFoodFactsProperties;
import com.nutriscan.integration.openfoodfacts.ProductLookupClient;
import com.nutriscan.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.Optional;

/**
 * Resolves a barcode to a cached {@link Product}.
 *
 * <p>Strategy: serve a fresh cache hit directly; otherwise fetch from Open Food Facts and upsert.
 * If the upstream has nothing (or is unreachable), fall back to whatever is cached — even if stale —
 * rather than failing. This keeps OFF traffic and latency low (important for the Indian market).
 */
@Service
public class ProductService {

    private static final String SOURCE_OFF = "OPEN_FOOD_FACTS";

    private final ProductRepository productRepository;
    private final ProductLookupClient lookupClient;
    private final Duration cacheTtl;

    public ProductService(ProductRepository productRepository,
                          ProductLookupClient lookupClient,
                          OpenFoodFactsProperties properties) {
        this.productRepository = productRepository;
        this.lookupClient = lookupClient;
        this.cacheTtl = Duration.ofHours(properties.cacheTtlHours());
    }

    @Transactional
    public Optional<Product> lookupByBarcode(String barcode) {
        Optional<Product> cached = productRepository.findByBarcode(barcode);
        if (cached.isPresent() && isFresh(cached.get())) {
            return cached;
        }

        Optional<FetchedProduct> fetched = lookupClient.fetchByBarcode(barcode);
        if (fetched.isEmpty()) {
            // Upstream miss or outage — better to serve a stale hit than nothing.
            return cached;
        }

        Product product = cached.orElseGet(Product::new);
        apply(product, barcode, fetched.get());
        return Optional.of(productRepository.save(product));
    }

    private boolean isFresh(Product product) {
        Instant fetchedAt = product.getFetchedAt();
        return fetchedAt != null && fetchedAt.isAfter(Instant.now().minus(cacheTtl));
    }

    private void apply(Product product, String barcode, FetchedProduct fetched) {
        product.setBarcode(barcode);
        product.setName(fetched.name());
        product.setBrand(fetched.brand());
        product.setImageUrl(fetched.imageUrl());
        product.setServingSize(fetched.servingSize());
        product.setNutriScoreGrade(fetched.nutriScoreGrade());
        product.setNutrition(fetched.nutrition());
        product.setSource(SOURCE_OFF);
        product.setFetchedAt(Instant.now());
    }
}

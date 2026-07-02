package com.nutriscan.service;

import com.nutriscan.domain.Nutrition;
import com.nutriscan.domain.Product;
import com.nutriscan.integration.openfoodfacts.FetchedProduct;
import com.nutriscan.integration.openfoodfacts.OpenFoodFactsProperties;
import com.nutriscan.integration.openfoodfacts.ProductLookupClient;
import com.nutriscan.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    private static final long TTL_HOURS = 168;

    @Mock
    private ProductRepository productRepository;
    @Mock
    private ProductLookupClient lookupClient;

    private ProductService productService;

    @BeforeEach
    void setUp() {
        productService = new ProductService(productRepository, lookupClient,
                new OpenFoodFactsProperties("https://off.test", "ua", TTL_HOURS));
    }

    private Product cachedProduct(Instant fetchedAt) {
        Product p = new Product();
        p.setBarcode("123");
        p.setName("Cached");
        p.setFetchedAt(fetchedAt);
        return p;
    }

    private FetchedProduct fetched() {
        return new FetchedProduct("Fresh Name", "Brand", null, null, "b",
                Nutrition.builder().energyKcal(100.0).sugars(5.0).build());
    }

    @Test
    void freshCacheHitReturnsCachedWithoutCallingUpstream() {
        when(productRepository.findByBarcode("123")).thenReturn(Optional.of(cachedProduct(Instant.now())));

        Optional<Product> result = productService.lookupByBarcode("123");

        assertThat(result).isPresent();
        assertThat(result.get().getName()).isEqualTo("Cached");
        verify(lookupClient, never()).fetchByBarcode(anyString());
        verify(productRepository, never()).save(any());
    }

    @Test
    void staleCacheRefetchesAndSaves() {
        Instant old = Instant.now().minus(TTL_HOURS + 24, ChronoUnit.HOURS);
        when(productRepository.findByBarcode("123")).thenReturn(Optional.of(cachedProduct(old)));
        when(lookupClient.fetchByBarcode("123")).thenReturn(Optional.of(fetched()));
        when(productRepository.save(any(Product.class))).thenAnswer(inv -> inv.getArgument(0));

        Optional<Product> result = productService.lookupByBarcode("123");

        assertThat(result).isPresent();
        assertThat(result.get().getName()).isEqualTo("Fresh Name");
        assertThat(result.get().getSource()).isEqualTo("OPEN_FOOD_FACTS");
        verify(productRepository).save(any(Product.class));
    }

    @Test
    void cacheMissFetchesAndSaves() {
        when(productRepository.findByBarcode("123")).thenReturn(Optional.empty());
        when(lookupClient.fetchByBarcode("123")).thenReturn(Optional.of(fetched()));
        when(productRepository.save(any(Product.class))).thenAnswer(inv -> inv.getArgument(0));

        Optional<Product> result = productService.lookupByBarcode("123");

        assertThat(result).isPresent();
        assertThat(result.get().getBarcode()).isEqualTo("123");
        verify(productRepository).save(any(Product.class));
    }

    @Test
    void upstreamMissWithNoCacheReturnsEmpty() {
        when(productRepository.findByBarcode("123")).thenReturn(Optional.empty());
        when(lookupClient.fetchByBarcode("123")).thenReturn(Optional.empty());

        assertThat(productService.lookupByBarcode("123")).isEmpty();
        verify(productRepository, never()).save(any());
    }

    @Test
    void upstreamMissServesStaleCacheRatherThanFailing() {
        Instant old = Instant.now().minus(TTL_HOURS + 24, ChronoUnit.HOURS);
        when(productRepository.findByBarcode("123")).thenReturn(Optional.of(cachedProduct(old)));
        when(lookupClient.fetchByBarcode("123")).thenReturn(Optional.empty());

        Optional<Product> result = productService.lookupByBarcode("123");

        assertThat(result).isPresent();
        assertThat(result.get().getName()).isEqualTo("Cached");   // stale, but better than nothing
        verify(productRepository, never()).save(any());
    }
}

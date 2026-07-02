package com.nutriscan.integration.openfoodfacts;

import java.util.Optional;

/**
 * Swappable upstream product source (Open Food Facts today). Implementations must never throw
 * on a missing product or upstream failure — return empty so the caller can fall back to cache.
 */
public interface ProductLookupClient {

    Optional<FetchedProduct> fetchByBarcode(String barcode);
}

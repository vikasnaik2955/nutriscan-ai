package com.nutriscan.integration.openfoodfacts;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.util.Optional;

/**
 * Open Food Facts implementation. Requests only the fields we use (small payload — matters for
 * the Indian market). 4xx (e.g. unknown barcode → 404) and any transport error resolve to empty
 * so the service can fall back to cache; only genuinely-found products return a value.
 */
@Component
public class OpenFoodFactsClient implements ProductLookupClient {

    private static final Logger log = LoggerFactory.getLogger(OpenFoodFactsClient.class);

    private static final String FIELDS =
            "product_name,brands,image_url,serving_size,nutriscore_grade,nutriments";

    private final RestClient restClient;

    public OpenFoodFactsClient(RestClient openFoodFactsRestClient) {
        this.restClient = openFoodFactsRestClient;
    }

    @Override
    public Optional<FetchedProduct> fetchByBarcode(String barcode) {
        try {
            OffResponse.Root body = restClient.get()
                    .uri("/api/v2/product/{barcode}?fields={fields}", barcode, FIELDS)
                    // Don't throw on 4xx — an unknown barcode is a normal "not found", not an error.
                    .retrieve()
                    .onStatus(status -> status.is4xxClientError(), (req, res) -> { })
                    .body(OffResponse.Root.class);

            if (body == null) return Optional.empty();
            return OffMapper.toFetched(body.product());
        } catch (RestClientException e) {
            log.warn("Open Food Facts lookup failed for barcode {}: {}", barcode, e.getMessage());
            return Optional.empty();
        }
    }
}

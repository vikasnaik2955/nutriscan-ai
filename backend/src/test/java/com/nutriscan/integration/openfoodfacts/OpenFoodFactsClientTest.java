package com.nutriscan.integration.openfoodfacts;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.startsWith;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withStatus;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

/** Verifies the OFF JSON → FetchedProduct mapping end-to-end (catches @JsonProperty typos). */
class OpenFoodFactsClientTest {

    private MockRestServiceServer server;
    private OpenFoodFactsClient client;

    @BeforeEach
    void setUp() {
        RestClient.Builder builder = RestClient.builder().baseUrl("https://off.test");
        server = MockRestServiceServer.bindTo(builder).build();
        client = new OpenFoodFactsClient(builder.build());
    }

    @Test
    void parsesFoundProduct() {
        String body = """
                {
                  "status": 1,
                  "product": {
                    "product_name": "Test Biscuit",
                    "brands": "TestBrand, OtherBrand",
                    "image_url": "http://img",
                    "serving_size": "30 g",
                    "nutriscore_grade": "c",
                    "nutriments": {
                      "energy-kcal_100g": 456,
                      "proteins_100g": 7,
                      "carbohydrates_100g": 76,
                      "sugars_100g": 26,
                      "fat_100g": 13,
                      "saturated-fat_100g": 6.5,
                      "fiber_100g": 1.5,
                      "sodium_100g": 0.24
                    }
                  }
                }
                """;
        server.expect(requestTo(startsWith("https://off.test/api/v2/product/8901063012363")))
                .andRespond(withSuccess(body, MediaType.APPLICATION_JSON));

        Optional<FetchedProduct> result = client.fetchByBarcode("8901063012363");

        assertThat(result).isPresent();
        FetchedProduct fp = result.get();
        assertThat(fp.name()).isEqualTo("Test Biscuit");
        assertThat(fp.brand()).isEqualTo("TestBrand");
        assertThat(fp.nutrition().getEnergyKcal()).isEqualTo(456.0);
        assertThat(fp.nutrition().getSaturatedFat()).isEqualTo(6.5);
        assertThat(fp.nutrition().getSalt()).isEqualTo(0.6);   // derived from sodium 0.24 * 2.5
    }

    @Test
    void returnsEmptyOnNotFound() {
        server.expect(requestTo(startsWith("https://off.test/api/v2/product/000")))
                .andRespond(withStatus(HttpStatus.NOT_FOUND)
                        .body("{\"status\":0}").contentType(MediaType.APPLICATION_JSON));

        assertThat(client.fetchByBarcode("000")).isEmpty();
    }
}

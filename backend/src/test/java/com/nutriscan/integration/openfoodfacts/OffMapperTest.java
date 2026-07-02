package com.nutriscan.integration.openfoodfacts;

import com.nutriscan.integration.openfoodfacts.OffResponse.OffNutriments;
import com.nutriscan.integration.openfoodfacts.OffResponse.OffProduct;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

class OffMapperTest {

    private OffProduct product(OffNutriments nutriments) {
        return new OffProduct("Test Biscuit", "TestBrand, OtherBrand", "http://img", "30 g", "c", nutriments);
    }

    @Test
    void mapsCoreFieldsAndFirstBrand() {
        var n = new OffNutriments(456.0, 7.0, 76.0, 26.0, 13.0, 6.5, 1.5, 0.6, null);

        Optional<FetchedProduct> result = OffMapper.toFetched(product(n));

        assertThat(result).isPresent();
        FetchedProduct fp = result.get();
        assertThat(fp.name()).isEqualTo("Test Biscuit");
        assertThat(fp.brand()).isEqualTo("TestBrand");            // first of a comma list
        assertThat(fp.nutriScoreGrade()).isEqualTo("c");
        assertThat(fp.nutrition().getSugars()).isEqualTo(26.0);
        assertThat(fp.nutrition().getSalt()).isEqualTo(0.6);      // salt present -> used as-is
    }

    @Test
    void derivesSaltFromSodiumWhenSaltMissing() {
        var n = new OffNutriments(100.0, 1.0, 10.0, 2.0, 3.0, 1.0, 0.0, null, 0.24);

        FetchedProduct fp = OffMapper.toFetched(product(n)).orElseThrow();

        assertThat(fp.nutrition().getSalt()).isEqualTo(0.6);      // 0.24 * 2.5
    }

    @Test
    void returnsEmptyForNullProduct() {
        assertThat(OffMapper.toFetched(null)).isEmpty();
    }

    @Test
    void returnsEmptyWhenNoNameAndNoNutriments() {
        assertThat(OffMapper.toFetched(new OffProduct(null, null, null, null, null, null))).isEmpty();
    }

    @Test
    void toleratesMissingNutriments() {
        FetchedProduct fp = OffMapper.toFetched(
                new OffProduct("Just a name", null, null, null, null, null)).orElseThrow();

        assertThat(fp.name()).isEqualTo("Just a name");
        assertThat(fp.nutrition().getEnergyKcal()).isNull();
    }
}

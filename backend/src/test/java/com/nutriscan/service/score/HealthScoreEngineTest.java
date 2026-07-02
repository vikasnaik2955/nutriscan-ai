package com.nutriscan.service.score;

import com.nutriscan.domain.HealthBand;
import com.nutriscan.domain.Nutrition;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class HealthScoreEngineTest {

    private final HealthScoreEngine engine = new HealthScoreEngine(new HealthScoreProperties());

    @Test
    void healthyProductScoresHigh() {
        // Amul toned milk-ish: only a mild saturated-fat penalty.
        Nutrition n = Nutrition.builder()
                .energyKcal(58.0).sugars(4.7).saturatedFat(2.0).salt(0.1).proteins(3.1).fiber(0.0).build();

        HealthScoreResult r = engine.score(n);

        assertThat(r.score()).isEqualTo(9);
        assertThat(r.band()).isEqualTo(HealthBand.HEALTHY);
    }

    @Test
    void moderateProductLandsInMiddleBand() {
        Nutrition n = Nutrition.builder()
                .sugars(10.0).saturatedFat(3.0).salt(0.5).energyKcal(300.0).build();

        HealthScoreResult r = engine.score(n);

        assertThat(r.score()).isEqualTo(7); // -1 sugar, -1 satfat, -1 salt
        assertThat(r.band()).isEqualTo(HealthBand.MODERATE);
    }

    @Test
    void unhealthyProductScoresLow() {
        Nutrition n = Nutrition.builder()
                .sugars(30.0).saturatedFat(15.0).salt(2.0).energyKcal(500.0).build();

        HealthScoreResult r = engine.score(n);

        assertThat(r.score()).isEqualTo(2); // 10 -3 -2 -2 -1
        assertThat(r.band()).isEqualTo(HealthBand.UNHEALTHY);
    }

    @Test
    void fibreAndProteinAreRewardedAndScoreClampsAtTen() {
        Nutrition n = Nutrition.builder().sugars(3.0).fiber(8.0).proteins(15.0).build();

        HealthScoreResult r = engine.score(n);

        assertThat(r.score()).isEqualTo(10); // 10 +2 +1 -> clamped
        assertThat(r.band()).isEqualTo(HealthBand.HEALTHY);
        assertThat(r.reasons()).anyMatch(s -> s.contains("High fibre"));
        assertThat(r.reasons()).anyMatch(s -> s.contains("Good protein"));
    }

    @Test
    void nullNutritionYieldsLimitedDataReason() {
        HealthScoreResult r = engine.score(Nutrition.builder().build());

        assertThat(r.reasons()).anyMatch(s -> s.contains("Limited nutrition data"));
    }

    @Test
    void thresholdsAreConfigDriven() {
        HealthScoreProperties strict = new HealthScoreProperties();
        strict.setSugarsHigh(10.0); // stricter than default 22.5
        HealthScoreEngine strictEngine = new HealthScoreEngine(strict);

        Nutrition n = Nutrition.builder().sugars(15.0).build();

        assertThat(strictEngine.score(n).score()).isEqualTo(7);        // 15 > 10 -> -3
        assertThat(engine.score(n).score()).isEqualTo(9);              // default: 15 in (5,22.5] -> -1
    }

    @Test
    void reasonTextFormatsWholeAndDecimalNumbers() {
        Nutrition n = Nutrition.builder().energyKcal(536.0).saturatedFat(6.5).build();

        HealthScoreResult r = engine.score(n);

        assertThat(r.reasons()).anyMatch(s -> s.contains("536 kcal per 100 g"));   // whole, no ".0"
        assertThat(r.reasons()).anyMatch(s -> s.contains("6.5 g per 100 g"));      // one decimal
    }
}

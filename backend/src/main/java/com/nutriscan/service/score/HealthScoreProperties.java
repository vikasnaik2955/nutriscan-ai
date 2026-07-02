package com.nutriscan.service.score;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Tunable thresholds for the health score, bound from {@code nutriscan.health-score.*}.
 * Field defaults here are the shipped values; application.yml can override any of them.
 * All nutrient thresholds are per 100 g/ml. Band cutoffs: score >= healthyMin -> HEALTHY,
 * >= moderateMin -> MODERATE, else UNHEALTHY.
 */
@ConfigurationProperties(prefix = "nutriscan.health-score")
@Getter
@Setter
public class HealthScoreProperties {

    private int healthyMin = 8;
    private int moderateMin = 5;

    private double sugarsHigh = 22.5;
    private double sugarsModerate = 5.0;

    private double satFatHigh = 5.0;
    private double satFatModerate = 1.5;

    private double saltHigh = 1.5;
    private double saltModerate = 0.3;

    private double energyHighKcal = 400.0;

    private double fiberHigh = 6.0;
    private double fiberModerate = 3.0;

    private double proteinHigh = 12.0;
}

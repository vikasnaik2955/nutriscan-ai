package com.nutriscan.config;

import com.nutriscan.service.score.HealthScoreProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/** Registers the config-driven health-score thresholds. */
@Configuration
@EnableConfigurationProperties(HealthScoreProperties.class)
public class ScoringConfig {
}

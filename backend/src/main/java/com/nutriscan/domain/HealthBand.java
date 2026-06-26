package com.nutriscan.domain;

/**
 * Health score band. Thresholds (config-driven in the score engine, build #4):
 * 8-10 HEALTHY, 5-7 MODERATE, 0-4 UNHEALTHY.
 */
public enum HealthBand {
    HEALTHY,
    MODERATE,
    UNHEALTHY
}

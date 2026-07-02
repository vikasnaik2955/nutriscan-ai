package com.nutriscan.service.score;

import com.nutriscan.domain.HealthBand;

import java.util.List;

/** Outcome of scoring a product: 0–10 score, its band, and human-readable reasons. */
public record HealthScoreResult(int score, HealthBand band, List<String> reasons) {
}

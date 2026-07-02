package com.nutriscan.service.score;

import com.nutriscan.domain.HealthBand;
import com.nutriscan.domain.Nutrition;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Authoritative health-score engine (0–10). Heuristic, not medical advice.
 *
 * <p>Starts at 10, applies penalties for sugar / saturated fat / salt / energy density and
 * rewards for fibre / protein, then clamps to 0–10 and maps to a band. Thresholds come from
 * {@link HealthScoreProperties} (config-driven); the point weights are fixed. This deliberately
 * mirrors the app's preview scorer (app/src/lib/scoring.ts) so results match once the app talks
 * to the real API — keep the two in sync.
 */
@Service
public class HealthScoreEngine {

    private final HealthScoreProperties props;

    public HealthScoreEngine(HealthScoreProperties props) {
        this.props = props;
    }

    public HealthScoreResult score(Nutrition n) {
        int score = 10;
        List<String> reasons = new ArrayList<>();

        // --- Penalties ---
        if (n.getSugars() != null) {
            double v = n.getSugars();
            if (v > props.getSugarsHigh()) {
                score -= 3;
                reasons.add("High sugar — " + fmt(v) + " g per 100 g");
            } else if (v > props.getSugarsModerate()) {
                score -= 1;
                reasons.add("Some sugar — " + fmt(v) + " g per 100 g");
            } else {
                reasons.add("Low sugar — " + fmt(v) + " g per 100 g");
            }
        }
        if (n.getSaturatedFat() != null) {
            double v = n.getSaturatedFat();
            if (v > props.getSatFatHigh()) {
                score -= 2;
                reasons.add("High saturated fat — " + fmt(v) + " g per 100 g");
            } else if (v > props.getSatFatModerate()) {
                score -= 1;
                reasons.add("Moderate saturated fat — " + fmt(v) + " g per 100 g");
            }
        }
        if (n.getSalt() != null) {
            double v = n.getSalt();
            if (v > props.getSaltHigh()) {
                score -= 2;
                reasons.add("High salt — " + fmt(v) + " g per 100 g");
            } else if (v > props.getSaltModerate()) {
                score -= 1;
                reasons.add("Some salt — " + fmt(v) + " g per 100 g");
            }
        }
        if (n.getEnergyKcal() != null && n.getEnergyKcal() > props.getEnergyHighKcal()) {
            score -= 1;
            reasons.add("Energy-dense — " + fmt(n.getEnergyKcal()) + " kcal per 100 g");
        }

        // --- Rewards ---
        if (n.getFiber() != null) {
            double v = n.getFiber();
            if (v >= props.getFiberHigh()) {
                score += 2;
                reasons.add("High fibre — " + fmt(v) + " g per 100 g");
            } else if (v >= props.getFiberModerate()) {
                score += 1;
                reasons.add("Good fibre — " + fmt(v) + " g per 100 g");
            }
        }
        if (n.getProteins() != null && n.getProteins() >= props.getProteinHigh()) {
            score += 1;
            reasons.add("Good protein — " + fmt(n.getProteins()) + " g per 100 g");
        }

        score = clamp(score);
        if (reasons.isEmpty()) {
            reasons.add("Limited nutrition data — score is approximate.");
        }

        return new HealthScoreResult(score, bandFor(score), reasons);
    }

    public HealthBand bandFor(int score) {
        if (score >= props.getHealthyMin()) return HealthBand.HEALTHY;
        if (score >= props.getModerateMin()) return HealthBand.MODERATE;
        return HealthBand.UNHEALTHY;
    }

    private static int clamp(int score) {
        return Math.max(0, Math.min(10, score));
    }

    /** One-decimal rounding; whole numbers render without a trailing ".0" (e.g. "536", "22.5"). */
    private static String fmt(double v) {
        double r = Math.round(v * 10) / 10.0;
        return (r == Math.floor(r)) ? String.valueOf((long) r) : String.valueOf(r);
    }
}

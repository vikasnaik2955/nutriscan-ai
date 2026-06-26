package com.nutriscan.domain;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Normalized nutrition facts, expressed per 100 g / 100 ml.
 *
 * <p>Reused as an {@code @Embedded} value object in both {@link Product} (the cached
 * Open Food Facts record) and {@link Scan} (an immutable snapshot taken at scan time,
 * so history stays stable even if the cached product is later refreshed).
 *
 * <p>Every field is nullable on purpose: OCR-parsed labels and incomplete OFF records
 * routinely omit values. The score engine (build #4) treats {@code null} as "unknown".
 */
@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Nutrition {

    /** Energy in kilocalories per 100 g/ml. */
    private Double energyKcal;

    private Double proteins;
    private Double carbohydrates;
    private Double sugars;
    private Double fat;
    private Double saturatedFat;
    private Double fiber;

    /** Salt in grams per 100 g/ml. Sodium (if that's all the source gives) is converted: salt = sodium * 2.5. */
    private Double salt;
}

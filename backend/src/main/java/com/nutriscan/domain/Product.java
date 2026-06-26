package com.nutriscan.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

/**
 * Server-side cache of a barcoded product (primarily from Open Food Facts).
 *
 * <p>Keyed by {@code barcode}. The {@code fetchedAt} timestamp drives cache freshness:
 * the OFF service (build #3) refetches when the record is older than the configured TTL.
 * Caching here keeps OFF calls down and payloads small for the Indian market.
 */
@Entity
@Table(
        name = "products",
        indexes = @Index(name = "ux_products_barcode", columnList = "barcode", unique = true)
)
@Getter
@Setter
@NoArgsConstructor
public class Product extends BaseEntity {

    @Column(nullable = false, unique = true, length = 64)
    private String barcode;

    @Column(length = 255)
    private String name;

    @Column(length = 255)
    private String brand;

    @Column(name = "image_url", length = 512)
    private String imageUrl;

    @Column(name = "serving_size", length = 64)
    private String servingSize;

    /** Open Food Facts' own Nutri-Score grade (a-e), if present. Informational only. */
    @Column(name = "nutri_score_grade", length = 1)
    private String nutriScoreGrade;

    /** Provenance, e.g. "OPEN_FOOD_FACTS". */
    @Column(length = 32)
    private String source;

    /** When this record was last fetched from the upstream source (cache freshness). */
    @Column(name = "fetched_at")
    private Instant fetchedAt;

    @Embedded
    private Nutrition nutrition;
}

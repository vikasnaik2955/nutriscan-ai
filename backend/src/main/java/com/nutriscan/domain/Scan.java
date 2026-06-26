package com.nutriscan.domain;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

/**
 * A single scan performed by a user, plus its computed health verdict.
 *
 * <p>The nutrition values are stored as an immutable {@link Nutrition} snapshot rather than
 * only referencing {@link Product}, so a user's history reflects what was scored at the time
 * even if the cached product is later refreshed (or the scan came from OCR with no product).
 *
 * <p>DPDP note: this is user activity data. Deletes are honoured via
 * {@code DELETE /api/scans/{id}} (build #5); retention policy is a product decision.
 */
@Entity
@Table(
        name = "scans",
        indexes = {
                @Index(name = "ix_scans_user", columnList = "user_id"),
                @Index(name = "ix_scans_barcode", columnList = "barcode")
        }
)
@Getter
@Setter
@NoArgsConstructor
public class Scan extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_scans_user"))
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "scan_type", nullable = false, length = 16)
    private ScanType scanType;

    /** Null for OCR-only scans. */
    @Column(length = 64)
    private String barcode;

    /** The cached product this scan resolved to, if barcode-based. Null for OCR scans. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id",
            foreignKey = @ForeignKey(name = "fk_scans_product"))
    private Product product;

    /** Denormalized product/food name captured at scan time. */
    @Column(name = "product_name", length = 255)
    private String productName;

    @Embedded
    private Nutrition nutrition;

    /** Health score 0-10. */
    @Column(name = "health_score", nullable = false)
    private int healthScore;

    @Enumerated(EnumType.STRING)
    @Column(name = "health_band", nullable = false, length = 16)
    private HealthBand healthBand;

    /** Human-readable explanations for the score (e.g. "High sugar: 22g per 100g"). */
    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(
            name = "scan_reasons",
            joinColumns = @JoinColumn(name = "scan_id",
                    foreignKey = @ForeignKey(name = "fk_scan_reasons_scan"))
    )
    @Column(name = "reason", length = 255)
    private List<String> reasons = new ArrayList<>();
}

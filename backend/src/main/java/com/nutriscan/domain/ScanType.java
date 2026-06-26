package com.nutriscan.domain;

/** How the nutrition data behind a scan was obtained. */
public enum ScanType {
    /** Barcode resolved against Open Food Facts (primary path). */
    BARCODE,
    /** Label photo parsed via on-device OCR (fallback path). */
    OCR
}

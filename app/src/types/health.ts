/**
 * Shared domain types — kept in lockstep with the backend enums/DTOs
 * (com.nutriscan.domain). Update both sides together.
 */

export type HealthBand = 'HEALTHY' | 'MODERATE' | 'UNHEALTHY';

export type ScanType = 'BARCODE' | 'OCR';

/** Per-100g/ml nutrition facts. Any field may be null (OCR/partial OFF data). */
export interface Nutrition {
  energyKcal: number | null;
  proteins: number | null;
  carbohydrates: number | null;
  sugars: number | null;
  fat: number | null;
  saturatedFat: number | null;
  fiber: number | null;
  salt: number | null;
}

export interface ScanResult {
  id: number;
  scanType: ScanType;
  barcode: string | null;
  productName: string | null;
  nutrition: Nutrition;
  healthScore: number; // 0–10
  healthBand: HealthBand;
  reasons: string[];
  createdAt: string; // ISO-8601
}

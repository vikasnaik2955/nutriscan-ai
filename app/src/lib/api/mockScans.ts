import { scoreNutrition } from '@/lib/scoring';
import type { Nutrition, ScanResult, ScanType } from '@/types/health';

/**
 * Dev-only fake scan backend (enabled via MOCK_AUTH). Holds an in-memory product catalog +
 * scan history so the Scanner/Result/History screens work with no server. Replaced by the
 * real /api/scan + /api/scans endpoints (backend BUILD #3/#5) — flip the flag and the same
 * hooks call the API instead.
 */

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

const n = (p: Partial<Nutrition>): Nutrition => ({
  energyKcal: null, proteins: null, carbohydrates: null, sugars: null,
  fat: null, saturatedFat: null, fiber: null, salt: null, ...p,
});

/** A few recognisable packaged products (values per 100 g, illustrative). */
const CATALOG: Record<string, { name: string; nutrition: Nutrition }> = {
  '8901491101837': { name: "Lay's Classic Salted", nutrition: n({ energyKcal: 536, proteins: 6.5, carbohydrates: 53, sugars: 1.2, fat: 33, saturatedFat: 15, fiber: 4, salt: 1.3 }) },
  '8901058000169': { name: 'Maggi 2-Minute Noodles', nutrition: n({ energyKcal: 402, proteins: 9.4, carbohydrates: 60, sugars: 4.6, fat: 14, saturatedFat: 6.5, fiber: 3.2, salt: 2.1 }) },
  '8901719110018': { name: 'Amul Toned Milk', nutrition: n({ energyKcal: 58, proteins: 3.1, carbohydrates: 4.7, sugars: 4.7, fat: 3, saturatedFat: 2, fiber: 0, salt: 0.1 }) },
  '8901063012363': { name: 'Parle-G Biscuits', nutrition: n({ energyKcal: 456, proteins: 7, carbohydrates: 76, sugars: 26, fat: 13, saturatedFat: 6.5, fiber: 1.5, salt: 0.6 }) },
  '8901030865019': { name: 'Quaker Oats', nutrition: n({ energyKcal: 389, proteins: 13, carbohydrates: 66, sugars: 1, fat: 7, saturatedFat: 1.2, fiber: 10, salt: 0.02 }) },
};

let store: ScanResult[] = [];
let nextId = 1;

function buildScan(opts: { scanType: ScanType; barcode: string | null; name: string; nutrition: Nutrition; createdAt?: string }): ScanResult {
  const { score, band, reasons } = scoreNutrition(opts.nutrition);
  return {
    id: nextId++,
    scanType: opts.scanType,
    barcode: opts.barcode,
    productName: opts.name,
    nutrition: opts.nutrition,
    healthScore: score,
    healthBand: band,
    reasons,
    createdAt: opts.createdAt ?? new Date().toISOString(),
  };
}

// Seed a little history so the History tab isn't empty on first view.
function seed() {
  if (store.length) return;
  const mins = (m: number) => new Date(Date.now() - m * 60_000).toISOString();
  store.push(
    buildScan({ scanType: 'BARCODE', barcode: '8901719110018', name: CATALOG['8901719110018'].name, nutrition: CATALOG['8901719110018'].nutrition, createdAt: mins(90) }),
    buildScan({ scanType: 'BARCODE', barcode: '8901058000169', name: CATALOG['8901058000169'].name, nutrition: CATALOG['8901058000169'].nutrition, createdAt: mins(220) }),
    buildScan({ scanType: 'BARCODE', barcode: '8901491101837', name: CATALOG['8901491101837'].name, nutrition: CATALOG['8901491101837'].nutrition, createdAt: mins(1500) }),
  );
}
seed();

/** Deterministic pseudo-nutrition for unknown barcodes, so re-scanning a code is stable. */
function fallbackNutrition(barcode: string): Nutrition {
  let h = 0;
  for (let i = 0; i < barcode.length; i++) h = (h * 31 + barcode.charCodeAt(i)) % 1000;
  const r = (min: number, max: number, salt: number) => Math.round((min + ((h * salt) % 1000) / 1000 * (max - min)) * 10) / 10;
  return n({
    energyKcal: r(120, 520, 7), proteins: r(1, 14, 13), carbohydrates: r(10, 70, 17),
    sugars: r(1, 30, 3), fat: r(1, 30, 11), saturatedFat: r(0.2, 12, 19), fiber: r(0, 8, 23), salt: r(0.05, 2, 29),
  });
}

export const mockScans = {
  async scanBarcode(barcode: string): Promise<ScanResult> {
    await delay(700);
    const hit = CATALOG[barcode];
    const scan = buildScan({
      scanType: 'BARCODE',
      barcode,
      name: hit?.name ?? `Product ${barcode.slice(-4)}`,
      nutrition: hit?.nutrition ?? fallbackNutrition(barcode),
    });
    store.unshift(scan);
    return scan;
  },

  async scanOcr(input: { productName: string; nutrition: Nutrition }): Promise<ScanResult> {
    await delay(700);
    const scan = buildScan({ scanType: 'OCR', barcode: null, name: input.productName, nutrition: input.nutrition });
    store.unshift(scan);
    return scan;
  },

  async list(): Promise<ScanResult[]> {
    await delay(200);
    return [...store].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async get(id: number): Promise<ScanResult | null> {
    await delay(120);
    return store.find((s) => s.id === id) ?? null;
  },

  async remove(id: number): Promise<void> {
    await delay(120);
    store = store.filter((s) => s.id !== id);
  },

  async clearAll(): Promise<void> {
    await delay(150);
    store = [];
  },
};

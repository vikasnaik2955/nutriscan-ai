import { apiRequest } from './client';
import { MOCK_AUTH } from '@/config/env';
import { mockScans } from './mockScans';
import type { Nutrition, ScanResult } from '@/types/health';

export interface OcrScanRequest {
  productName: string;
  nutrition: Nutrition;
}

/**
 * Scan + history endpoints (backend BUILD #3/#5). While MOCK_AUTH is on these resolve
 * against the in-memory mock; flip it off and the same calls hit the real API.
 */
export const scanApi = {
  scanBarcode: (barcode: string) =>
    MOCK_AUTH
      ? mockScans.scanBarcode(barcode)
      : apiRequest<ScanResult>('/scan/barcode', { method: 'POST', body: { barcode } }),

  scanOcr: (req: OcrScanRequest) =>
    MOCK_AUTH
      ? mockScans.scanOcr(req)
      : apiRequest<ScanResult>('/scan/ocr', { method: 'POST', body: req }),

  list: () => (MOCK_AUTH ? mockScans.list() : apiRequest<ScanResult[]>('/scans')),

  get: (id: number) =>
    MOCK_AUTH ? mockScans.get(id) : apiRequest<ScanResult>(`/scans/${id}`),

  remove: (id: number) =>
    MOCK_AUTH ? mockScans.remove(id) : apiRequest<void>(`/scans/${id}`, { method: 'DELETE' }),

  clearHistory: () =>
    MOCK_AUTH ? mockScans.clearAll() : apiRequest<void>('/scans', { method: 'DELETE' }),
};

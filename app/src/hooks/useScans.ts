import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { scanApi, type OcrScanRequest } from '@/lib/api/scans';
import type { ScanResult } from '@/types/health';

const keys = {
  all: ['scans'] as const,
  list: () => [...keys.all, 'list'] as const,
  detail: (id: number) => [...keys.all, 'detail', id] as const,
};

/** History list, newest first. */
export function useScans() {
  return useQuery({ queryKey: keys.list(), queryFn: scanApi.list });
}

/** A single scan by id. */
export function useScan(id: number) {
  return useQuery({
    queryKey: keys.detail(id),
    queryFn: () => scanApi.get(id),
    enabled: Number.isFinite(id),
  });
}

/** Scan a barcode -> new ScanResult. Seeds the detail cache and refreshes history. */
export function useScanBarcode() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (barcode: string) => scanApi.scanBarcode(barcode),
    onSuccess: (scan: ScanResult) => {
      qc.setQueryData(keys.detail(scan.id), scan);
      void qc.invalidateQueries({ queryKey: keys.list() });
    },
  });
}

/** Scan via OCR payload (manual / label) -> new ScanResult. */
export function useScanOcr() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: OcrScanRequest) => scanApi.scanOcr(req),
    onSuccess: (scan: ScanResult) => {
      qc.setQueryData(keys.detail(scan.id), scan);
      void qc.invalidateQueries({ queryKey: keys.list() });
    },
  });
}

export function useDeleteScan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => scanApi.remove(id),
    onSuccess: () => void qc.invalidateQueries({ queryKey: keys.list() }),
  });
}

/** Delete all of the user's scan history (DPDP: user-initiated erasure). */
export function useClearHistory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => scanApi.clearHistory(),
    onSuccess: () => void qc.invalidateQueries({ queryKey: keys.all }),
  });
}

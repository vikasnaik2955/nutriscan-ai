import type { Role } from '@/types/auth';

/**
 * Dev-only admin backend (enabled via MOCK_AUTH). In-memory users/products + stats so the
 * Admin module works with no server. Replaced by /api/admin/* (backend admin module).
 */
export interface AdminUser {
  id: number;
  email: string;
  displayName: string;
  role: Role;
  enabled: boolean;
  scanCount: number;
}

export interface AdminProduct {
  id: number;
  barcode: string;
  name: string;
  brand: string;
}

export interface AdminStats {
  users: number;
  products: number;
  scans: number;
}

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

let users: AdminUser[] = [
  { id: 1, email: 'demo@nutriscan.app', displayName: 'Demo User', role: 'USER', enabled: true, scanCount: 12 },
  { id: 2, email: 'priya@example.com', displayName: 'Priya Sharma', role: 'USER', enabled: true, scanCount: 34 },
  { id: 3, email: 'admin@nutriscan.app', displayName: 'Admin', role: 'ADMIN', enabled: true, scanCount: 5 },
  { id: 4, email: 'rahul@example.com', displayName: 'Rahul Verma', role: 'USER', enabled: false, scanCount: 2 },
];

let products: AdminProduct[] = [
  { id: 1, barcode: '8901719110018', name: 'Amul Toned Milk', brand: 'Amul' },
  { id: 2, barcode: '8901058000169', name: 'Maggi 2-Minute Noodles', brand: 'Nestlé' },
  { id: 3, barcode: '8901491101837', name: "Lay's Classic Salted", brand: 'Lay’s' },
  { id: 4, barcode: '8901030865019', name: 'Quaker Oats', brand: 'Quaker' },
  { id: 5, barcode: '8901063012363', name: 'Parle-G Biscuits', brand: 'Parle' },
];

let nextProductId = 6;

export const mockAdmin = {
  async stats(): Promise<AdminStats> {
    await delay(180);
    return { users: users.length, products: products.length, scans: users.reduce((a, u) => a + u.scanCount, 0) };
  },
  async listUsers(): Promise<AdminUser[]> {
    await delay(180);
    return [...users];
  },
  async toggleUser(id: number): Promise<AdminUser[]> {
    await delay(150);
    users = users.map((u) => (u.id === id ? { ...u, enabled: !u.enabled } : u));
    return [...users];
  },
  async listProducts(): Promise<AdminProduct[]> {
    await delay(180);
    return [...products];
  },
  async addProduct(input: { barcode: string; name: string; brand: string }): Promise<AdminProduct[]> {
    await delay(200);
    products = [{ id: nextProductId++, ...input }, ...products];
    return [...products];
  },
  async removeProduct(id: number): Promise<AdminProduct[]> {
    await delay(150);
    products = products.filter((p) => p.id !== id);
    return [...products];
  },
};

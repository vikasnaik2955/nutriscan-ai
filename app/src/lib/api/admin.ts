import { apiRequest } from './client';
import { MOCK_AUTH } from '@/config/env';
import { mockAdmin, type AdminProduct, type AdminStats, type AdminUser } from './mockAdmin';

export interface AddProductRequest {
  barcode: string;
  name: string;
  brand: string;
}

/** Admin endpoints (/api/admin/*). Mock-gated like the rest. */
export const adminApi = {
  stats: () => (MOCK_AUTH ? mockAdmin.stats() : apiRequest<AdminStats>('/admin/stats')),
  listUsers: () => (MOCK_AUTH ? mockAdmin.listUsers() : apiRequest<AdminUser[]>('/admin/users')),
  toggleUser: (id: number) =>
    MOCK_AUTH ? mockAdmin.toggleUser(id) : apiRequest<AdminUser[]>(`/admin/users/${id}/toggle`, { method: 'POST' }),
  listProducts: () => (MOCK_AUTH ? mockAdmin.listProducts() : apiRequest<AdminProduct[]>('/admin/products')),
  addProduct: (req: AddProductRequest) =>
    MOCK_AUTH ? mockAdmin.addProduct(req) : apiRequest<AdminProduct[]>('/admin/products', { method: 'POST', body: req }),
  removeProduct: (id: number) =>
    MOCK_AUTH ? mockAdmin.removeProduct(id) : apiRequest<AdminProduct[]>(`/admin/products/${id}`, { method: 'DELETE' }),
};

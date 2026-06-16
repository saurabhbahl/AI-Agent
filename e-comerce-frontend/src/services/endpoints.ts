import { api } from './api';
import type {
  ApiResponse,
  User,
  Product,
  Category,
  Cart,
  Wishlist,
  Order,
  Review,
  DashboardStats,
  ProductFilters,
  Address,
  Pagination,
} from '@/types';

export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post<ApiResponse<{ user: User; accessToken: string }>>('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post<ApiResponse<{ user: User; accessToken: string }>>('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get<ApiResponse<User>>('/auth/profile'),
  updateProfile: (data: Partial<User>) => api.put<ApiResponse<User>>('/auth/profile', data),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/auth/password', data),
};

export const productApi = {
  getAll: (params?: ProductFilters) =>
    api.get<ApiResponse<Product[]>>('/products', { params }),
  getById: (id: string) => api.get<ApiResponse<Product>>(`/products/${id}`),
  getBySlug: (slug: string) => api.get<ApiResponse<Product>>(`/products/slug/${slug}`),
  getReviews: (productId: string, params?: { page?: number; limit?: number }) =>
    api.get<ApiResponse<Review[]>>(`/products/${productId}/reviews`, { params }),
  createReview: (productId: string, data: { rating: number; title: string; comment: string }) =>
    api.post<ApiResponse<Review>>(`/products/${productId}/reviews`, data),
};

export const categoryApi = {
  getAll: () => api.get<ApiResponse<Category[]>>('/categories'),
  getBySlug: (slug: string) => api.get<ApiResponse<Category>>(`/categories/slug/${slug}`),
};

export const cartApi = {
  get: () => api.get<ApiResponse<Cart>>('/cart'),
  addItem: (productId: string, quantity: number) =>
    api.post<ApiResponse<Cart>>('/cart', { productId, quantity }),
  updateItem: (productId: string, quantity: number) =>
    api.put<ApiResponse<Cart>>(`/cart/${productId}`, { quantity }),
  removeItem: (productId: string) => api.delete<ApiResponse<Cart>>(`/cart/${productId}`),
  clear: () => api.delete<ApiResponse<Cart>>('/cart'),
};

export const wishlistApi = {
  get: () => api.get<ApiResponse<Wishlist>>('/wishlist'),
  add: (productId: string) => api.post<ApiResponse<Wishlist>>('/wishlist', { productId }),
  remove: (productId: string) => api.delete<ApiResponse<Wishlist>>(`/wishlist/${productId}`),
};

export const orderApi = {
  create: (data: { shippingAddress: Address; paymentMethod: string }) =>
    api.post<ApiResponse<Order>>('/orders', data),
  getMyOrders: (params?: { page?: number; limit?: number }) =>
    api.get<ApiResponse<Order[]>>('/orders/my', { params }),
  getById: (orderId: string) => api.get<ApiResponse<Order>>(`/orders/${orderId}`),
};

export const adminApi = {
  getDashboard: () => api.get<ApiResponse<DashboardStats>>('/admin/dashboard'),
  getUsers: (params?: { page?: number; limit?: number; search?: string }) =>
    api.get<ApiResponse<User[]>>('/admin/users', { params }),
  updateUser: (userId: string, data: Partial<User>) =>
    api.put<ApiResponse<User>>(`/admin/users/${userId}`, data),
  deleteUser: (userId: string) => api.delete(`/admin/users/${userId}`),
  getProducts: (params?: ProductFilters & { search?: string }) =>
    api.get<ApiResponse<Product[]>>('/admin/products', { params }),
  createProduct: (data: Partial<Product>) =>
    api.post<ApiResponse<Product>>('/admin/products', data),
  updateProduct: (id: string, data: Partial<Product>) =>
    api.put<ApiResponse<Product>>(`/admin/products/${id}`, data),
  deleteProduct: (id: string) => api.delete(`/admin/products/${id}`),
  updateInventory: (id: string, stock: number) =>
    api.patch<ApiResponse<Product>>(`/admin/products/${id}/inventory`, { stock }),
  getLowStock: () => api.get<ApiResponse<Product[]>>('/admin/products/inventory/low-stock'),
  getCategories: () => api.get<ApiResponse<Category[]>>('/admin/categories'),
  createCategory: (data: Partial<Category>) =>
    api.post<ApiResponse<Category>>('/admin/categories', data),
  updateCategory: (id: string, data: Partial<Category>) =>
    api.put<ApiResponse<Category>>(`/admin/categories/${id}`, data),
  deleteCategory: (id: string) => api.delete(`/admin/categories/${id}`),
  getOrders: (params?: { page?: number; limit?: number; status?: string }) =>
    api.get<ApiResponse<Order[]>>('/admin/orders', { params }),
  updateOrderStatus: (orderId: string, status: string) =>
    api.put<ApiResponse<Order>>(`/admin/orders/${orderId}/status`, { status }),
};

export type { Pagination };

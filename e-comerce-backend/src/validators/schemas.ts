import { z } from 'zod';
import { UserRole, OrderStatus } from '../types';

export const addressSchema = z.object({
  street: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  zipCode: z.string().min(1),
  country: z.string().min(1),
});

export const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/, 'Must contain uppercase letter')
    .regex(/[a-z]/, 'Must contain lowercase letter')
    .regex(/[0-9]/, 'Must contain number'),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().optional(),
  avatar: z.string().url().optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z
    .string()
    .min(8)
    .regex(/[A-Z]/, 'Must contain uppercase letter')
    .regex(/[a-z]/, 'Must contain lowercase letter')
    .regex(/[0-9]/, 'Must contain number'),
});

export const createCategorySchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().optional(),
  image: z.string().url().optional(),
  isActive: z.boolean().optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

export const createProductSchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().min(10),
  price: z.number().positive(),
  comparePrice: z.number().positive().optional(),
  images: z.array(z.string().url()).min(1),
  category: z.string().regex(/^[0-9a-fA-F]{24}$/),
  brand: z.string().optional(),
  stock: z.number().int().min(0),
  sku: z.string().min(1),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const productQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  category: z.string().optional(),
  search: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  featured: z.enum(['true', 'false']).optional(),
});

export const cartItemSchema = z.object({
  productId: z.string().regex(/^[0-9a-fA-F]{24}$/),
  quantity: z.number().int().min(1).max(99),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1).max(99),
});

export const wishlistItemSchema = z.object({
  productId: z.string().regex(/^[0-9a-fA-F]{24}$/),
});

export const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().min(3).max(100),
  comment: z.string().min(10).max(1000),
});

export const createOrderSchema = z.object({
  shippingAddress: addressSchema,
  paymentMethod: z.enum(['card', 'paypal', 'cod']),
});

export const updateOrderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  role: z.nativeEnum(UserRole).optional(),
  isActive: z.boolean().optional(),
});

export const inventoryUpdateSchema = z.object({
  stock: z.number().int().min(0),
});

export const mongoIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/),
});

export const productIdParamSchema = z.object({
  productId: z.string().regex(/^[0-9a-fA-F]{24}$/),
});

export const userIdParamSchema = z.object({
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/),
});

export const orderIdParamSchema = z.object({
  orderId: z.string().regex(/^[0-9a-fA-F]{24}$/),
});

export const categorySlugSchema = z.object({
  slug: z.string().min(1),
});

export const productSlugSchema = z.object({
  slug: z.string().min(1),
});

export const paginationQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
});

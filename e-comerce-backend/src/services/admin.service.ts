import { NotFoundError } from '../utils/ApiError';
import { userRepository } from '../repositories/user.repository';
import { productRepository } from '../repositories/product.repository';
import { orderRepository } from '../repositories/order.repository';
import { categoryRepository } from '../repositories/category.repository';
import { parsePagination } from '../utils/helpers';
import { UserRole } from '../types';

export class AdminService {
  async getDashboardStats() {
    const [totalUsers, totalProducts, totalOrders, totalCategories, salesStats, monthlySales, lowStock] =
      await Promise.all([
        userRepository.count({ role: UserRole.CUSTOMER }),
        productRepository.count(),
        orderRepository.count(),
        categoryRepository.count(),
        orderRepository.getSalesStats(),
        orderRepository.getMonthlySales(6),
        productRepository.getLowStock(10),
      ]);

    return {
      totalUsers,
      totalProducts,
      totalOrders,
      totalCategories,
      sales: salesStats,
      monthlySales,
      lowStockProducts: lowStock,
    };
  }

  async getUsers(query: Record<string, string | undefined>) {
    const { page, limit, skip } = parsePagination(query);
    const filter: Record<string, unknown> = {};
    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { email: { $regex: query.search, $options: 'i' } },
      ];
    }
    const { users, total } = await userRepository.findAll(filter, skip, limit);
    return {
      data: users.map((u) => ({
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        isActive: u.isActive,
        createdAt: u.createdAt,
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async updateUser(userId: string, data: { name?: string; role?: UserRole; isActive?: boolean }) {
    const user = await userRepository.updateById(userId, data);
    if (!user) throw new NotFoundError('User not found');
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    };
  }

  async deleteUser(userId: string) {
    const user = await userRepository.deleteById(userId);
    if (!user) throw new NotFoundError('User not found');
    return user;
  }
}

export const adminService = new AdminService();

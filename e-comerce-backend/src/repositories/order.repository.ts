import { FilterQuery, UpdateQuery } from 'mongoose';
import { Order, IOrder } from '../models/Order.model';

export class OrderRepository {
  async findById(id: string): Promise<IOrder | null> {
    return Order.findById(id).populate('user', 'name email').populate('orderItems.product');
  }

  async findByUser(userId: string, skip: number, limit: number): Promise<{ orders: IOrder[]; total: number }> {
    const filter = { user: userId };
    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Order.countDocuments(filter),
    ]);
    return { orders, total };
  }

  async findAll(
    filter: FilterQuery<IOrder>,
    skip: number,
    limit: number,
  ): Promise<{ orders: IOrder[]; total: number }> {
    const [orders, total] = await Promise.all([
      Order.find(filter).populate('user', 'name email').sort({ createdAt: -1 }).skip(skip).limit(limit),
      Order.countDocuments(filter),
    ]);
    return { orders, total };
  }

  async create(data: Partial<IOrder>): Promise<IOrder> {
    return Order.create(data);
  }

  async updateById(id: string, data: UpdateQuery<IOrder>): Promise<IOrder | null> {
    return Order.findByIdAndUpdate(id, data, { new: true }).populate('user', 'name email');
  }

  async count(filter: FilterQuery<IOrder> = {}): Promise<number> {
    return Order.countDocuments(filter);
  }

  async getSalesStats(): Promise<{ totalRevenue: number; totalOrders: number; averageOrderValue: number }> {
    const result = await Order.aggregate([
      { $match: { isPaid: true } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' },
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    if (result.length === 0) {
      return { totalRevenue: 0, totalOrders: 0, averageOrderValue: 0 };
    }

    const { totalRevenue, totalOrders } = result[0];
    return {
      totalRevenue,
      totalOrders,
      averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
    };
  }

  async getMonthlySales(months = 6): Promise<Array<{ month: string; revenue: number; orders: number }>> {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    return Order.aggregate([
      { $match: { isPaid: true, createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          revenue: { $sum: '$totalPrice' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          month: '$_id',
          revenue: 1,
          orders: 1,
        },
      },
    ]);
  }
}

export const orderRepository = new OrderRepository();

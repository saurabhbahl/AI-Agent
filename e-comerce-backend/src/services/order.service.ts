import { NotFoundError, BadRequestError } from '../utils/ApiError';
import { orderRepository } from '../repositories/order.repository';
import { cartRepository } from '../repositories/cart.repository';
import { productRepository } from '../repositories/product.repository';
import { OrderStatus, Address } from '../types';
import { parsePagination } from '../utils/helpers';

const TAX_RATE = 0.08;
const SHIPPING_THRESHOLD = 100;
const SHIPPING_COST = 9.99;

export class OrderService {
  async createOrder(userId: string, shippingAddress: Address, paymentMethod: string) {
    const cart = await cartRepository.findByUser(userId);
    if (!cart || cart.items.length === 0) {
      throw new BadRequestError('Cart is empty');
    }

    const orderItems = [];
    for (const item of cart.items) {
      const product = await productRepository.findById(item.product.toString());
      if (!product || !product.isActive) {
        throw new BadRequestError(`Product ${item.product} is no longer available`);
      }
      if (product.stock < item.quantity) {
        throw new BadRequestError(`Insufficient stock for ${product.name}`);
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0],
        price: product.price,
        quantity: item.quantity,
      });

      await productRepository.updateStock(product._id.toString(), product.stock - item.quantity);
    }

    const itemsPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const taxPrice = Math.round(itemsPrice * TAX_RATE * 100) / 100;
    const shippingPrice = itemsPrice >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const totalPrice = Math.round((itemsPrice + taxPrice + shippingPrice) * 100) / 100;

    const order = await orderRepository.create({
      user: userId as unknown as import('mongoose').Types.ObjectId,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      isPaid: true,
      paidAt: new Date(),
      paymentResult: {
        id: `mock_${Date.now()}`,
        status: 'completed',
        updateTime: new Date().toISOString(),
        emailAddress: '',
      },
      status: OrderStatus.PROCESSING,
    });

    await cartRepository.deleteByUser(userId);
    return order;
  }

  async getUserOrders(userId: string, query: Record<string, string | undefined>) {
    const { page, limit, skip } = parsePagination(query);
    const { orders, total } = await orderRepository.findByUser(userId, skip, limit);
    return {
      data: orders,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getOrderById(orderId: string, userId?: string, isAdmin = false) {
    const order = await orderRepository.findById(orderId);
    if (!order) throw new NotFoundError('Order not found');
    if (!isAdmin && order.user.toString() !== userId) {
      throw new NotFoundError('Order not found');
    }
    return order;
  }

  async getAllOrders(query: Record<string, string | undefined>) {
    const { page, limit, skip } = parsePagination(query);
    const filter: Record<string, unknown> = {};
    if (query.status) filter.status = query.status;
    const { orders, total } = await orderRepository.findAll(filter, skip, limit);
    return {
      data: orders,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async updateOrderStatus(orderId: string, status: OrderStatus) {
    const updateData: Record<string, unknown> = { status };
    if (status === OrderStatus.DELIVERED) {
      updateData.isDelivered = true;
      updateData.deliveredAt = new Date();
    }
    const order = await orderRepository.updateById(orderId, updateData);
    if (!order) throw new NotFoundError('Order not found');
    return order;
  }
}

export const orderService = new OrderService();

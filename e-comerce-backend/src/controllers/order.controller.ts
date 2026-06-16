import { Request, Response } from 'express';
import { asString } from '../utils/params';
import { asyncHandler } from '../utils/asyncHandler';
import { sendResponse } from '../utils/ApiResponse';
import { orderService } from '../services/order.service';

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await orderService.createOrder(
    req.user!.userId,
    req.body.shippingAddress,
    req.body.paymentMethod,
  );
  sendResponse(res, 201, { message: 'Order placed successfully', data: order });
});

export const getMyOrders = asyncHandler(async (req: Request, res: Response) => {
  const result = await orderService.getUserOrders(req.user!.userId, req.query as Record<string, string>);
  sendResponse(res, 200, { data: result.data, pagination: result.pagination });
});

export const getOrderById = asyncHandler(async (req: Request, res: Response) => {
  const isAdmin = req.user!.role === 'admin';
  const order = await orderService.getOrderById(asString(req.params.orderId), req.user!.userId, isAdmin);
  sendResponse(res, 200, { data: order });
});

export const getAllOrders = asyncHandler(async (req: Request, res: Response) => {
  const result = await orderService.getAllOrders(req.query as Record<string, string>);
  sendResponse(res, 200, { data: result.data, pagination: result.pagination });
});

export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const order = await orderService.updateOrderStatus(asString(req.params.orderId), req.body.status);
  sendResponse(res, 200, { message: 'Order status updated', data: order });
});

import { Request, Response } from 'express';
import { asString } from '../utils/params';
import { asyncHandler } from '../utils/asyncHandler';
import { sendResponse } from '../utils/ApiResponse';
import { cartService } from '../services/cart.service';

export const getCart = asyncHandler(async (req: Request, res: Response) => {
  const cart = await cartService.getCart(req.user!.userId);
  sendResponse(res, 200, { data: cart });
});

export const addToCart = asyncHandler(async (req: Request, res: Response) => {
  const cart = await cartService.addItem(req.user!.userId, req.body.productId, req.body.quantity);
  sendResponse(res, 200, { message: 'Item added to cart', data: cart });
});

export const updateCartItem = asyncHandler(async (req: Request, res: Response) => {
  const cart = await cartService.updateItem(req.user!.userId, asString(req.params.productId), req.body.quantity);
  sendResponse(res, 200, { message: 'Cart updated', data: cart });
});

export const removeFromCart = asyncHandler(async (req: Request, res: Response) => {
  const cart = await cartService.removeItem(req.user!.userId, asString(req.params.productId));
  sendResponse(res, 200, { message: 'Item removed from cart', data: cart });
});

export const clearCart = asyncHandler(async (req: Request, res: Response) => {
  const cart = await cartService.clearCart(req.user!.userId);
  sendResponse(res, 200, { message: 'Cart cleared', data: cart });
});

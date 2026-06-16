import { Request, Response } from 'express';
import { asString } from '../utils/params';
import { asyncHandler } from '../utils/asyncHandler';
import { sendResponse } from '../utils/ApiResponse';
import { wishlistService } from '../services/wishlist.service';

export const getWishlist = asyncHandler(async (req: Request, res: Response) => {
  const wishlist = await wishlistService.getWishlist(req.user!.userId);
  sendResponse(res, 200, { data: wishlist });
});

export const addToWishlist = asyncHandler(async (req: Request, res: Response) => {
  const wishlist = await wishlistService.addProduct(req.user!.userId, req.body.productId);
  sendResponse(res, 200, { message: 'Added to wishlist', data: wishlist });
});

export const removeFromWishlist = asyncHandler(async (req: Request, res: Response) => {
  const wishlist = await wishlistService.removeProduct(req.user!.userId, asString(req.params.productId));
  sendResponse(res, 200, { message: 'Removed from wishlist', data: wishlist });
});

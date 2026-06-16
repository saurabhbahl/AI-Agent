import { Request, Response } from 'express';
import { asString } from '../utils/params';
import { asyncHandler } from '../utils/asyncHandler';
import { sendResponse } from '../utils/ApiResponse';
import { reviewService } from '../services/review.service';

export const getProductReviews = asyncHandler(async (req: Request, res: Response) => {
  const result = await reviewService.getProductReviews(
    asString(req.params.productId),
    req.query as Record<string, string>,
  );
  sendResponse(res, 200, { data: result.data, pagination: result.pagination });
});

export const createReview = asyncHandler(async (req: Request, res: Response) => {
  const review = await reviewService.createReview(req.user!.userId, asString(req.params.productId), req.body);
  sendResponse(res, 201, { message: 'Review submitted', data: review });
});

export const deleteReview = asyncHandler(async (req: Request, res: Response) => {
  const isAdmin = req.user!.role === 'admin';
  await reviewService.deleteReview(asString(req.params.id), req.user!.userId, isAdmin);
  sendResponse(res, 200, { message: 'Review deleted' });
});

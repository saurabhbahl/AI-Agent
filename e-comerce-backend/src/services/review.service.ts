import { NotFoundError, ConflictError } from '../utils/ApiError';
import { reviewRepository } from '../repositories/review.repository';
import { productRepository } from '../repositories/product.repository';
import { parsePagination } from '../utils/helpers';

export class ReviewService {
  async getProductReviews(productId: string, query: Record<string, string | undefined>) {
    const { page, limit, skip } = parsePagination(query);
    const { reviews, total } = await reviewRepository.findByProduct(productId, skip, limit);
    return {
      data: reviews,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async createReview(
    userId: string,
    productId: string,
    data: { rating: number; title: string; comment: string },
  ) {
    const product = await productRepository.findById(productId);
    if (!product) throw new NotFoundError('Product not found');

    const existing = await reviewRepository.findByUserAndProduct(userId, productId);
    if (existing) throw new ConflictError('You have already reviewed this product');

    const review = await reviewRepository.create({
      user: userId as unknown as import('mongoose').Types.ObjectId,
      product: productId as unknown as import('mongoose').Types.ObjectId,
      ...data,
    });

    const { rating, count } = await reviewRepository.getAverageRating(productId);
    await productRepository.updateRating(productId, rating, count);

    return review;
  }

  async deleteReview(reviewId: string, userId: string, isAdmin = false) {
    const review = await reviewRepository.findById(reviewId);
    if (!review) throw new NotFoundError('Review not found');
    if (!isAdmin && review.user.toString() !== userId) {
      throw new NotFoundError('Review not found');
    }

    const deletedReview = await reviewRepository.deleteById(reviewId);
    const { rating, count } = await reviewRepository.getAverageRating(review.product.toString());
    await productRepository.updateRating(review.product.toString(), rating, count);
    return deletedReview;
  }
}

export const reviewService = new ReviewService();

import { FilterQuery } from 'mongoose';
import { Review, IReview } from '../models/Review.model';

export class ReviewRepository {
  async findByProduct(
    productId: string,
    skip: number,
    limit: number,
  ): Promise<{ reviews: IReview[]; total: number }> {
    const filter: FilterQuery<IReview> = { product: productId, isApproved: true };
    const [reviews, total] = await Promise.all([
      Review.find(filter)
        .populate('user', 'name avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Review.countDocuments(filter),
    ]);
    return { reviews, total };
  }

  async findByUserAndProduct(userId: string, productId: string): Promise<IReview | null> {
    return Review.findOne({ user: userId, product: productId });
  }

  async create(data: Partial<IReview>): Promise<IReview> {
    return Review.create(data);
  }

  async deleteById(id: string): Promise<IReview | null> {
    return Review.findByIdAndDelete(id);
  }

  async getAverageRating(productId: string): Promise<{ rating: number; count: number }> {
    const result = await Review.aggregate([
      { $match: { product: productId, isApproved: true } },
      {
        $group: {
          _id: '$product',
          rating: { $avg: '$rating' },
          count: { $sum: 1 },
        },
      },
    ]);

    if (result.length === 0) return { rating: 0, count: 0 };
    return { rating: Math.round(result[0].rating * 10) / 10, count: result[0].count };
  }
}

export const reviewRepository = new ReviewRepository();

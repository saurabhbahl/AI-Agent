import { FilterQuery, UpdateQuery } from 'mongoose';
import { Product, IProduct } from '../models/Product.model';

export class ProductRepository {
  async findById(id: string): Promise<IProduct | null> {
    return Product.findById(id).populate('category', 'name slug');
  }

  async findBySlug(slug: string): Promise<IProduct | null> {
    return Product.findOne({ slug }).populate('category', 'name slug');
  }

  async findAll(
    filter: FilterQuery<IProduct>,
    skip: number,
    limit: number,
    sort: Record<string, 1 | -1>,
  ): Promise<{ products: IProduct[]; total: number }> {
    const [products, total] = await Promise.all([
      Product.find(filter).populate('category', 'name slug').sort(sort).skip(skip).limit(limit),
      Product.countDocuments(filter),
    ]);
    return { products, total };
  }

  async create(data: Partial<IProduct>): Promise<IProduct> {
    return Product.create(data);
  }

  async updateById(id: string, data: UpdateQuery<IProduct>): Promise<IProduct | null> {
    return Product.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate(
      'category',
      'name slug',
    );
  }

  async deleteById(id: string): Promise<IProduct | null> {
    return Product.findByIdAndDelete(id);
  }

  async updateStock(id: string, stock: number): Promise<IProduct | null> {
    return Product.findByIdAndUpdate(id, { stock }, { new: true });
  }

  async count(filter: FilterQuery<IProduct> = {}): Promise<number> {
    return Product.countDocuments(filter);
  }

  async getLowStock(threshold: number): Promise<IProduct[]> {
    return Product.find({ stock: { $lte: threshold }, isActive: true })
      .populate('category', 'name slug')
      .sort({ stock: 1 });
  }

  async updateRating(productId: string, rating: number, numReviews: number): Promise<void> {
    await Product.findByIdAndUpdate(productId, { rating, numReviews });
  }
}

export const productRepository = new ProductRepository();

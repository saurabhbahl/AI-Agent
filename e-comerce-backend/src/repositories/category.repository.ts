import { FilterQuery, UpdateQuery } from 'mongoose';
import { Category, ICategory } from '../models/Category.model';

export class CategoryRepository {
  async findById(id: string): Promise<ICategory | null> {
    return Category.findById(id);
  }

  async findBySlug(slug: string): Promise<ICategory | null> {
    return Category.findOne({ slug });
  }

  async findAll(filter: FilterQuery<ICategory> = {}): Promise<ICategory[]> {
    return Category.find(filter).sort({ name: 1 });
  }

  async findActive(): Promise<ICategory[]> {
    return Category.find({ isActive: true }).sort({ name: 1 });
  }

  async create(data: Partial<ICategory>): Promise<ICategory> {
    return Category.create(data);
  }

  async updateById(id: string, data: UpdateQuery<ICategory>): Promise<ICategory | null> {
    return Category.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async deleteById(id: string): Promise<ICategory | null> {
    return Category.findByIdAndDelete(id);
  }

  async count(filter: FilterQuery<ICategory> = {}): Promise<number> {
    return Category.countDocuments(filter);
  }
}

export const categoryRepository = new CategoryRepository();

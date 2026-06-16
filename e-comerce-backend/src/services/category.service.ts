import { NotFoundError, ConflictError } from '../utils/ApiError';
import { categoryRepository } from '../repositories/category.repository';
import { productRepository } from '../repositories/product.repository';

export class CategoryService {
  async getCategories(includeInactive = false) {
    return includeInactive
      ? categoryRepository.findAll()
      : categoryRepository.findActive();
  }

  async getCategoryById(id: string) {
    const category = await categoryRepository.findById(id);
    if (!category) throw new NotFoundError('Category not found');
    return category;
  }

  async getCategoryBySlug(slug: string) {
    const category = await categoryRepository.findBySlug(slug);
    if (!category) throw new NotFoundError('Category not found');
    return category;
  }

  async createCategory(data: { name: string; description?: string; image?: string; isActive?: boolean }) {
    const existing = await categoryRepository.findBySlug(
      data.name.toLowerCase().replace(/\s+/g, '-'),
    );
    if (existing) throw new ConflictError('Category already exists');
    return categoryRepository.create(data);
  }

  async updateCategory(id: string, data: Partial<{ name: string; description: string; image: string; isActive: boolean }>) {
    const category = await categoryRepository.updateById(id, data);
    if (!category) throw new NotFoundError('Category not found');
    return category;
  }

  async deleteCategory(id: string) {
    const products = await productRepository.count({ category: id });
    if (products > 0) throw new ConflictError('Cannot delete category with associated products');
    const category = await categoryRepository.deleteById(id);
    if (!category) throw new NotFoundError('Category not found');
    return category;
  }
}

export const categoryService = new CategoryService();

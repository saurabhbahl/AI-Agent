import { FilterQuery } from 'mongoose';
import { NotFoundError, ConflictError, BadRequestError } from '../utils/ApiError';
import { productRepository } from '../repositories/product.repository';
import { IProduct } from '../models/Product.model';
import { parsePagination } from '../utils/helpers';

export class ProductService {
  async getProducts(query: Record<string, string | undefined>) {
    const { page, limit, sort, order, skip } = parsePagination(query);
    const filter: FilterQuery<IProduct> = { isActive: true };

    if (query.category) {
      filter.category = query.category;
    }
    if (query.search) {
      filter.$text = { $search: query.search };
    }
    if (query.minPrice || query.maxPrice) {
      filter.price = {};
      if (query.minPrice) filter.price.$gte = parseFloat(query.minPrice);
      if (query.maxPrice) filter.price.$lte = parseFloat(query.maxPrice);
    }
    if (query.featured === 'true') {
      filter.isFeatured = true;
    }

    const sortObj: Record<string, 1 | -1> = { [sort]: order as 1 | -1 };
    const { products, total } = await productRepository.findAll(filter, skip, limit, sortObj);

    return {
      data: products,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getProductById(id: string) {
    const product = await productRepository.findById(id);
    if (!product || !product.isActive) throw new NotFoundError('Product not found');
    return product;
  }

  async getProductBySlug(slug: string) {
    const product = await productRepository.findBySlug(slug);
    if (!product || !product.isActive) throw new NotFoundError('Product not found');
    return product;
  }

  async createProduct(data: Partial<IProduct>) {
    const existing = await productRepository.findAll({ sku: data.sku }, 0, 1, {});
    if (existing.total > 0) throw new ConflictError('SKU already exists');
    return productRepository.create(data);
  }

  async updateProduct(id: string, data: Partial<IProduct>) {
    const product = await productRepository.updateById(id, data);
    if (!product) throw new NotFoundError('Product not found');
    return product;
  }

  async deleteProduct(id: string) {
    const product = await productRepository.deleteById(id);
    if (!product) throw new NotFoundError('Product not found');
    return product;
  }

  async updateInventory(id: string, stock: number) {
    if (stock < 0) throw new BadRequestError('Stock cannot be negative');
    const product = await productRepository.updateStock(id, stock);
    if (!product) throw new NotFoundError('Product not found');
    return product;
  }

  async getLowStock(threshold = 10) {
    return productRepository.getLowStock(threshold);
  }

  async getAdminProducts(query: Record<string, string | undefined>) {
    const { page, limit, sort, order, skip } = parsePagination(query);
    const filter: FilterQuery<IProduct> = {};
    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { sku: { $regex: query.search, $options: 'i' } },
      ];
    }
    const sortObj: Record<string, 1 | -1> = { [sort]: order as 1 | -1 };
    const { products, total } = await productRepository.findAll(filter, skip, limit, sortObj);
    return {
      data: products,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }
}

export const productService = new ProductService();

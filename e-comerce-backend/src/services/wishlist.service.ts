import { NotFoundError, ConflictError } from '../utils/ApiError';
import { wishlistRepository } from '../repositories/wishlist.repository';
import { productRepository } from '../repositories/product.repository';
import { IWishlist } from '../models/Wishlist.model';

export class WishlistService {
  private async getOrCreateWishlist(userId: string): Promise<IWishlist> {
    let wishlist = await wishlistRepository.findByUser(userId);
    if (!wishlist) wishlist = await wishlistRepository.create(userId);
    return wishlist;
  }

  async getWishlist(userId: string) {
    return this.getOrCreateWishlist(userId);
  }

  async addProduct(userId: string, productId: string) {
    const product = await productRepository.findById(productId);
    if (!product || !product.isActive) throw new NotFoundError('Product not found');

    const wishlist = await this.getOrCreateWishlist(userId);
    const exists = wishlist.products.some((p) => p.toString() === productId);
    if (exists) throw new ConflictError('Product already in wishlist');

    wishlist.products.push(product._id);
    return wishlistRepository.save(wishlist);
  }

  async removeProduct(userId: string, productId: string) {
    const wishlist = await this.getOrCreateWishlist(userId);
    wishlist.products = wishlist.products.filter((p) => p.toString() !== productId);
    return wishlistRepository.save(wishlist);
  }
}

export const wishlistService = new WishlistService();

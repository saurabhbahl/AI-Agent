import { Wishlist, IWishlist } from '../models/Wishlist.model';

export class WishlistRepository {
  async findByUser(userId: string): Promise<IWishlist | null> {
    return Wishlist.findOne({ user: userId }).populate({
      path: 'products',
      select: 'name slug price images rating stock isActive',
    });
  }

  async create(userId: string): Promise<IWishlist> {
    return Wishlist.create({ user: userId, products: [] });
  }

  async save(wishlist: IWishlist): Promise<IWishlist> {
    await wishlist.save();
    return this.findByUser(wishlist.user.toString()) as Promise<IWishlist>;
  }
}

export const wishlistRepository = new WishlistRepository();

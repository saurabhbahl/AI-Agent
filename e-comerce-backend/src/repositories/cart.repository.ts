import { Cart, ICart } from '../models/Cart.model';

export class CartRepository {
  async findByUser(userId: string): Promise<ICart | null> {
    return Cart.findOne({ user: userId }).populate({
      path: 'items.product',
      select: 'name slug price images stock isActive',
    });
  }

  async create(userId: string): Promise<ICart> {
    return Cart.create({ user: userId, items: [] });
  }

  async save(cart: ICart): Promise<ICart> {
    await cart.save();
    return this.findByUser(cart.user.toString()) as Promise<ICart>;
  }

  async deleteByUser(userId: string): Promise<void> {
    await Cart.findOneAndDelete({ user: userId });
  }
}

export const cartRepository = new CartRepository();

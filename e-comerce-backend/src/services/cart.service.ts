import { NotFoundError, BadRequestError } from '../utils/ApiError';
import { cartRepository } from '../repositories/cart.repository';
import { productRepository } from '../repositories/product.repository';
import { ICart } from '../models/Cart.model';

export class CartService {
  private async getOrCreateCart(userId: string): Promise<ICart> {
    let cart = await cartRepository.findByUser(userId);
    if (!cart) cart = await cartRepository.create(userId);
    return cart;
  }

  async getCart(userId: string) {
    const cart = await this.getOrCreateCart(userId);
    return cart;
  }

  async addItem(userId: string, productId: string, quantity: number) {
    const product = await productRepository.findById(productId);
    if (!product || !product.isActive) throw new NotFoundError('Product not found');
    if (product.stock < quantity) throw new BadRequestError('Insufficient stock');

    const cart = await this.getOrCreateCart(userId);
    const existingIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (existingIndex >= 0) {
      const newQty = cart.items[existingIndex].quantity + quantity;
      if (product.stock < newQty) throw new BadRequestError('Insufficient stock');
      cart.items[existingIndex].quantity = newQty;
      cart.items[existingIndex].price = product.price;
    } else {
      cart.items.push({ product: product._id, quantity, price: product.price });
    }

    return cartRepository.save(cart);
  }

  async updateItem(userId: string, productId: string, quantity: number) {
    const product = await productRepository.findById(productId);
    if (!product) throw new NotFoundError('Product not found');
    if (product.stock < quantity) throw new BadRequestError('Insufficient stock');

    const cart = await this.getOrCreateCart(userId);
    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);
    if (itemIndex < 0) throw new NotFoundError('Item not in cart');

    cart.items[itemIndex].quantity = quantity;
    cart.items[itemIndex].price = product.price;
    return cartRepository.save(cart);
  }

  async removeItem(userId: string, productId: string) {
    const cart = await this.getOrCreateCart(userId);
    cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    return cartRepository.save(cart);
  }

  async clearCart(userId: string) {
    await cartRepository.deleteByUser(userId);
    return { items: [] };
  }

  getCartTotal(cart: ICart): number {
    return cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
}

export const cartService = new CartService();

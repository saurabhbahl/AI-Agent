import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCart, updateCartItem, removeFromCart, selectCartTotal } from '@/store/slices/cartSlice';
import type { Product } from '@/types';

export default function CartPage() {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((state) => state.cart);
  const total = useAppSelector(selectCartTotal);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const tax = Math.round(total * 0.08 * 100) / 100;
  const shipping = total >= 100 ? 0 : 9.99;
  const grandTotal = total + tax + shipping;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-48 mb-8" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground" />
        <h2 className="mt-4 text-2xl font-bold">Your cart is empty</h2>
        <p className="mt-2 text-muted-foreground">Add some products to get started.</p>
        <Button className="mt-6" asChild>
          <Link to="/products">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const product = item.product as Product;
            return (
              <div key={product._id} className="flex gap-4 rounded-lg border p-4">
                <Link to={`/products/${product.slug}`} className="h-24 w-24 shrink-0 overflow-hidden rounded">
                  <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                </Link>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <Link to={`/products/${product.slug}`} className="font-medium hover:text-primary">
                      {product.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">{formatPrice(item.price)} each</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => dispatch(updateCartItem({ productId: product._id, quantity: item.quantity - 1 }))}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => dispatch(updateCartItem({ productId: product._id, quantity: item.quantity + 1 }))}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
                      <Button variant="ghost" size="icon" onClick={() => dispatch(removeFromCart(product._id))}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="h-fit rounded-lg border p-6">
          <h2 className="text-lg font-semibold">Order Summary</h2>
          <Separator className="my-4" />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(total)}</span></div>
            <div className="flex justify-between"><span>Tax (8%)</span><span>{formatPrice(tax)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span></div>
            {total < 100 && <p className="text-xs text-muted-foreground">Free shipping on orders over $100</p>}
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between font-bold">
            <span>Total</span><span>{formatPrice(grandTotal)}</span>
          </div>
          <Button className="mt-6 w-full" size="lg" asChild>
            <Link to="/checkout">Proceed to Checkout</Link>
          </Button>
          <Button variant="outline" className="mt-2 w-full" asChild>
            <Link to="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice, formatDate } from '@/lib/utils';
import { orderApi } from '@/services/endpoints';
import type { Order } from '@/types';

export default function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    orderApi.getById(orderId).then((res) => {
      setOrder(res.data.data || null);
      setLoading(false);
    });
  }, [orderId]);

  if (loading) return <div className="container mx-auto px-4 py-8"><Skeleton className="h-64 w-full" /></div>;
  if (!order) return <div className="container mx-auto px-4 py-16 text-center">Order not found.</div>;

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Order #{order._id.slice(-8).toUpperCase()}</h1>
        <Badge>{order.status}</Badge>
      </div>

      <div className="rounded-lg border p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="font-semibold">Shipping Address</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {order.shippingAddress.street}<br />
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
              {order.shippingAddress.country}
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Order Info</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Date: {formatDate(order.createdAt)}<br />
              Payment: {order.paymentMethod}<br />
              Status: {order.isPaid ? 'Paid' : 'Unpaid'}
            </p>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="mb-4 font-semibold">Items</h3>
          {order.orderItems.map((item, i) => (
            <div key={i} className="flex gap-4 py-3">
              <img src={item.image} alt={item.name} className="h-16 w-16 rounded object-cover" />
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">Qty: {item.quantity} x {formatPrice(item.price)}</p>
              </div>
              <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>

        <Separator />

        <div className="space-y-1 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(order.itemsPrice)}</span></div>
          <div className="flex justify-between"><span>Tax</span><span>{formatPrice(order.taxPrice)}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>{formatPrice(order.shippingPrice)}</span></div>
          <div className="flex justify-between font-bold text-base pt-2"><span>Total</span><span>{formatPrice(order.totalPrice)}</span></div>
        </div>
      </div>

      <Button variant="outline" className="mt-6" asChild>
        <Link to="/orders">Back to Orders</Link>
      </Button>
    </div>
  );
}

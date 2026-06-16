import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice, formatDate } from '@/lib/utils';
import { orderApi } from '@/services/endpoints';
import type { Order } from '@/types';

const statusVariant: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive'> = {
  pending: 'warning',
  processing: 'default',
  shipped: 'secondary',
  delivered: 'success',
  cancelled: 'destructive',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderApi.getMyOrders().then((res) => {
      setOrders(res.data.data || []);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold">No orders yet</h2>
        <p className="mt-2 text-muted-foreground">Start shopping to see your orders here.</p>
        <Button className="mt-6" asChild><Link to="/products">Shop Now</Link></Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Order History</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <Link key={order._id} to={`/orders/${order._id}`} className="block rounded-lg border p-4 transition-shadow hover:shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-medium">Order #{order._id.slice(-8).toUpperCase()}</p>
                <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
              </div>
              <Badge variant={statusVariant[order.status]}>{order.status}</Badge>
              <p className="font-semibold">{formatPrice(order.totalPrice)}</p>
              <p className="text-sm text-muted-foreground">{order.orderItems.length} item(s)</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

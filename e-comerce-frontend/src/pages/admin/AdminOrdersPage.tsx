import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice, formatDate } from '@/lib/utils';
import { adminApi } from '@/services/endpoints';
import type { Order, OrderStatus, User } from '@/types';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const load = async () => {
    setLoading(true);
    const res = await adminApi.getOrders({ limit: 50, status: statusFilter || undefined });
    setOrders(res.data.data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [statusFilter]);

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    await adminApi.updateOrderStatus(orderId, status);
    load();
  };

  const statusVariant: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive'> = {
    pending: 'warning', processing: 'default', shipped: 'secondary', delivered: 'success', cancelled: 'destructive',
  };

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Orders</h1>
        <Select value={statusFilter || 'all'} onValueChange={(v) => setStatusFilter(v === 'all' ? '' : v)}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Filter status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {(['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as OrderStatus[]).map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? <Skeleton className="h-64" /> : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="p-3 text-left">Order ID</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Total</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Update</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const user = order.user as User;
                return (
                  <tr key={order._id} className="border-b">
                    <td className="p-3 font-mono text-xs">{order._id.slice(-8).toUpperCase()}</td>
                    <td className="p-3">{typeof user === 'object' ? user.name : '—'}</td>
                    <td className="p-3">{formatDate(order.createdAt)}</td>
                    <td className="p-3">{formatPrice(order.totalPrice)}</td>
                    <td className="p-3"><Badge variant={statusVariant[order.status]}>{order.status}</Badge></td>
                    <td className="p-3">
                      <Select value={order.status} onValueChange={(v) => updateStatus(order._id, v as OrderStatus)}>
                        <SelectTrigger className="h-8 w-32"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {(['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as OrderStatus[]).map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

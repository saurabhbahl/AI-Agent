import { useEffect, useState } from 'react';
import { DollarSign, Package, ShoppingBag, Users, TrendingUp, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice } from '@/lib/utils';
import { adminApi } from '@/services/endpoints';
import type { DashboardStats } from '@/types';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getDashboard().then((res) => {
      setStats(res.data.data || null);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32" />)}
      </div>
    );
  }

  if (!stats) return null;

  const cards = [
    { title: 'Total Revenue', value: formatPrice(stats.sales.totalRevenue), icon: DollarSign, desc: `${stats.sales.totalOrders} paid orders` },
    { title: 'Products', value: stats.totalProducts.toString(), icon: Package, desc: `${stats.lowStockProducts.length} low stock` },
    { title: 'Orders', value: stats.totalOrders.toString(), icon: ShoppingBag, desc: `Avg ${formatPrice(stats.sales.averageOrderValue)}` },
    { title: 'Customers', value: stats.totalUsers.toString(), icon: Users, desc: `${stats.totalCategories} categories` },
  ];

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ title, value, icon: Icon, desc }) => (
          <Card key={title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value}</div>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" /> Monthly Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.monthlySales.length === 0 ? (
              <p className="text-muted-foreground">No sales data yet.</p>
            ) : (
              <div className="space-y-3">
                {stats.monthlySales.map((month) => (
                  <div key={month.month} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{month.month}</span>
                    <div className="text-right">
                      <p className="font-semibold">{formatPrice(month.revenue)}</p>
                      <p className="text-xs text-muted-foreground">{month.orders} orders</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" /> Low Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.lowStockProducts.length === 0 ? (
              <p className="text-muted-foreground">All products well stocked.</p>
            ) : (
              <div className="space-y-3">
                {stats.lowStockProducts.slice(0, 8).map((product) => (
                  <div key={product._id} className="flex items-center justify-between">
                    <span className="text-sm truncate max-w-[200px]">{product.name}</span>
                    <Badge variant="warning">{product.stock} left</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

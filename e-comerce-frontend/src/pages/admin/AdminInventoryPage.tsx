import { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice } from '@/lib/utils';
import { adminApi } from '@/services/endpoints';
import type { Product } from '@/types';

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingStock, setEditingStock] = useState<Record<string, string>>({});

  const load = async () => {
    setLoading(true);
    const res = await adminApi.getProducts({ limit: 100, sort: 'stock', order: 'asc' });
    setProducts(res.data.data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStock = async (productId: string) => {
    const stock = parseInt(editingStock[productId], 10);
    if (isNaN(stock) || stock < 0) return;
    await adminApi.updateInventory(productId, stock);
    setEditingStock((prev) => { const n = { ...prev }; delete n[productId]; return n; });
    load();
  };

  const lowStock = products.filter((p) => p.stock <= 10);

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Inventory Management</h1>

      {lowStock.length > 0 && (
        <Card className="mb-8 border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" /> {lowStock.length} products low on stock
            </CardTitle>
          </CardHeader>
        </Card>
      )}

      {loading ? <Skeleton className="h-64" /> : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-left">SKU</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Current Stock</th>
                <th className="p-3 text-left">Update Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img src={product.images[0]} alt="" className="h-10 w-10 rounded object-cover" />
                      <span>{product.name}</span>
                      {product.stock <= 10 && <Badge variant="warning">Low</Badge>}
                    </div>
                  </td>
                  <td className="p-3">{product.sku}</td>
                  <td className="p-3">{formatPrice(product.price)}</td>
                  <td className="p-3 font-semibold">{product.stock}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        className="h-8 w-24"
                        placeholder={String(product.stock)}
                        value={editingStock[product._id] || ''}
                        onChange={(e) => setEditingStock({ ...editingStock, [product._id]: e.target.value })}
                      />
                      <Button size="sm" onClick={() => updateStock(product._id)}>Update</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

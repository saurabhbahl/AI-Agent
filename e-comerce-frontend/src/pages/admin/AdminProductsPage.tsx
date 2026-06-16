import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice } from '@/lib/utils';
import { adminApi } from '@/services/endpoints';
import { getErrorMessage } from '@/services/api';
import type { Product, Category } from '@/types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '', description: '', price: '', comparePrice: '', images: '', category: '', brand: '', stock: '', sku: '', isFeatured: false, isActive: true,
  });

  const load = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        adminApi.getProducts({ search: search || undefined, limit: 50 }),
        adminApi.getCategories(),
      ]);
      setProducts(productsRes.data.data || []);
      setCategories(categoriesRes.data.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [search]);

  const resetForm = () => {
    setForm({ name: '', description: '', price: '', comparePrice: '', images: '', category: '', brand: '', stock: '', sku: '', isFeatured: false, isActive: true });
    setEditing(null);
    setShowForm(false);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      comparePrice: product.comparePrice ? String(product.comparePrice) : '',
      images: product.images.join('\n'),
      category: typeof product.category === 'object' ? product.category._id : product.category,
      brand: product.brand || '',
      stock: String(product.stock),
      sku: product.sku,
      isFeatured: product.isFeatured,
      isActive: product.isActive,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const payload = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : undefined,
      images: form.images.split('\n').filter(Boolean),
      category: form.category,
      brand: form.brand || undefined,
      stock: parseInt(form.stock, 10),
      sku: form.sku,
      isFeatured: form.isFeatured,
      isActive: form.isActive,
    };
    try {
      if (editing) await adminApi.updateProduct(editing._id, payload);
      else await adminApi.createProduct(payload);
      resetForm();
      load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    await adminApi.deleteProduct(id);
    load();
  };

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Products</h1>
        <div className="flex gap-2">
          <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-48" />
          <Button onClick={() => { resetForm(); setShowForm(true); }}>
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </div>
      </div>

      {showForm && (
        <Card className="mb-8">
          <CardHeader><CardTitle>{editing ? 'Edit Product' : 'New Product'}</CardTitle></CardHeader>
          <CardContent>
            {error && <div className="mb-4 text-sm text-destructive">{error}</div>}
            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
              <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
              <div><Label>SKU</Label><Input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required /></div>
              <div><Label>Price</Label><Input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required /></div>
              <div><Label>Compare Price</Label><Input type="number" step="0.01" value={form.comparePrice} onChange={(e) => setForm({ ...form, comparePrice: e.target.value })} /></div>
              <div><Label>Stock</Label><Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required /></div>
              <div><Label>Brand</Label><Input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} /></div>
              <div>
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2"><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={3} /></div>
              <div className="md:col-span-2"><Label>Image URLs (one per line)</Label><Textarea value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} required rows={2} /></div>
              <div className="flex gap-4 md:col-span-2">
                <label className="flex items-center gap-2"><input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} /> Featured</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Active</label>
              </div>
              <div className="flex gap-2 md:col-span-2">
                <Button type="submit">{editing ? 'Update' : 'Create'}</Button>
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-left">SKU</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Stock</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img src={product.images[0]} alt="" className="h-10 w-10 rounded object-cover" />
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </td>
                  <td className="p-3">{product.sku}</td>
                  <td className="p-3">{formatPrice(product.price)}</td>
                  <td className="p-3">{product.stock}</td>
                  <td className="p-3">
                    <Badge variant={product.isActive ? 'success' : 'destructive'}>{product.isActive ? 'Active' : 'Inactive'}</Badge>
                  </td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(product)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(product._id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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

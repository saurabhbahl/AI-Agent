import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { productApi, categoryApi } from '@/services/endpoints';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addToCart } from '@/store/slices/cartSlice';
import { addToWishlist, removeFromWishlist, fetchWishlist } from '@/store/slices/wishlistSlice';
import type { Product, Category, Pagination } from '@/types';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const wishlistProducts = useAppSelector((state) => state.wishlist.products);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  const page = parseInt(searchParams.get('page') || '1', 10);
  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'createdAt';
  const order = (searchParams.get('order') || 'desc') as 'asc' | 'desc';
  const featured = searchParams.get('featured') === 'true';

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await productApi.getAll({
        page,
        limit: 12,
        category: category || undefined,
        search: search || undefined,
        sort,
        order,
        featured: featured || undefined,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      });
      setProducts(data.data || []);
      setPagination(data.pagination || null);
    } finally {
      setLoading(false);
    }
  }, [page, category, search, sort, order, featured, minPrice, maxPrice]);

  useEffect(() => {
    categoryApi.getAll().then((res) => setCategories(res.data.data || []));
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchWishlist());
  }, [isAuthenticated, dispatch]);

  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    if (!updates.page) params.set('page', '1');
    setSearchParams(params);
  };

  const handleAddToCart = async (productId: string) => {
    if (!isAuthenticated) return;
    await dispatch(addToCart({ productId, quantity: 1 }));
  };

  const handleToggleWishlist = async (productId: string) => {
    if (!isAuthenticated) return;
    const isInWishlist = wishlistProducts.some((p) => p._id === productId);
    if (isInWishlist) await dispatch(removeFromWishlist(productId));
    else await dispatch(addToWishlist(productId));
  };

  const applyPriceFilter = () => {
    updateParams({ minPrice, maxPrice, page: '1' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Products</h1>

      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-64">
          <div className="space-y-6 rounded-lg border p-4">
            <div>
              <h3 className="mb-2 font-semibold">Category</h3>
              <Select value={category || 'all'} onValueChange={(v) => updateParams({ category: v === 'all' ? '' : v })}>
                <SelectTrigger><SelectValue placeholder="All Categories" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Price Range</h3>
              <div className="flex gap-2">
                <Input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
                <Input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
              </div>
              <Button className="mt-2 w-full" size="sm" onClick={applyPriceFilter}>Apply</Button>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Sort By</h3>
              <Select value={`${sort}-${order}`} onValueChange={(v) => {
                const [s, o] = v.split('-');
                updateParams({ sort: s, order: o });
              }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt-desc">Newest</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="rating-desc">Top Rated</SelectItem>
                  <SelectItem value="name-asc">Name: A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          {search && <p className="mb-4 text-muted-foreground">Results for &quot;{search}&quot;</p>}
          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="aspect-[3/4]" />)}
            </div>
          ) : products.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">No products found.</div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onAddToCart={isAuthenticated ? handleAddToCart : undefined}
                    onToggleWishlist={isAuthenticated ? handleToggleWishlist : undefined}
                    isInWishlist={wishlistProducts.some((p) => p._id === product._id)}
                  />
                ))}
              </div>
              {pagination && pagination.totalPages > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                  <Button variant="outline" disabled={page <= 1} onClick={() => updateParams({ page: String(page - 1) })}>
                    Previous
                  </Button>
                  <span className="flex items-center px-4 text-sm">
                    Page {page} of {pagination.totalPages}
                  </span>
                  <Button variant="outline" disabled={page >= pagination.totalPages} onClick={() => updateParams({ page: String(page + 1) })}>
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

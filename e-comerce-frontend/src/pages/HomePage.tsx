import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, HeadphonesIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/products/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { productApi, categoryApi } from '@/services/endpoints';
import type { Product, Category } from '@/types';

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          productApi.getAll({ featured: true, limit: 8 }),
          categoryApi.getAll(),
        ]);
        setFeatured(productsRes.data.data || []);
        setCategories(categoriesRes.data.data || []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Discover Amazing Products
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Shop the latest trends with free shipping on orders over $100. Quality guaranteed.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/products">
                Shop Now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/products?featured=true">Featured Deals</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-b py-8">
        <div className="container mx-auto grid gap-6 px-4 md:grid-cols-3">
          {[
            { icon: Truck, title: 'Free Shipping', desc: 'On orders over $100' },
            { icon: Shield, title: 'Secure Payment', desc: '100% secure checkout' },
            { icon: HeadphonesIcon, title: '24/7 Support', desc: 'Dedicated support team' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Shop by Category</h2>
            <Button variant="ghost" asChild>
              <Link to="/products">View All</Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {categories.slice(0, 10).map((cat) => (
              <Link
                key={cat._id}
                to={`/products?category=${cat._id}`}
                className="group overflow-hidden rounded-lg border transition-shadow hover:shadow-md"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={cat.image || 'https://picsum.photos/200'}
                    alt={cat.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <p className="p-3 text-center text-sm font-medium">{cat.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-2xl font-bold">Featured Products</h2>
          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[3/4] w-full" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

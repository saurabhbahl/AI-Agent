import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { productApi } from '@/services/endpoints';
import { formatPrice } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addToCart } from '@/store/slices/cartSlice';
import { addToWishlist, removeFromWishlist, fetchWishlist } from '@/store/slices/wishlistSlice';
import type { Product, Review } from '@/types';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const wishlistProducts = useAppSelector((state) => state.wishlist.products);

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await productApi.getBySlug(slug);
        const p = data.data!;
        setProduct(p);
        const reviewsRes = await productApi.getReviews(p._id);
        setReviews(reviewsRes.data.data || []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchWishlist());
  }, [isAuthenticated, dispatch]);

  if (loading) {
    return (
      <div className="container mx-auto grid gap-8 px-4 py-8 md:grid-cols-2">
        <Skeleton className="aspect-square" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (!product) {
    return <div className="container mx-auto px-4 py-16 text-center">Product not found.</div>;
  }

  const isInWishlist = wishlistProducts.some((p) => p._id === product._id);
  const categoryName = typeof product.category === 'object' ? product.category.name : '';

  const handleAddToCart = () => {
    dispatch(addToCart({ productId: product._id, quantity }));
  };

  const handleToggleWishlist = () => {
    if (isInWishlist) dispatch(removeFromWishlist(product._id));
    else dispatch(addToWishlist(product._id));
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      await productApi.createReview(product._id, reviewForm);
      const reviewsRes = await productApi.getReviews(product._id);
      setReviews(reviewsRes.data.data || []);
      setReviewForm({ rating: 5, title: '', comment: '' });
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <div className="aspect-square overflow-hidden rounded-lg border">
            <img src={product.images[selectedImage]} alt={product.name} className="h-full w-full object-cover" />
          </div>
          {product.images.length > 1 && (
            <div className="mt-4 flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`h-16 w-16 overflow-hidden rounded border-2 ${selectedImage === i ? 'border-primary' : 'border-transparent'}`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          {categoryName && (
            <Link to={`/products?category=${typeof product.category === 'object' ? product.category._id : product.category}`}>
              <Badge variant="secondary">{categoryName}</Badge>
            </Link>
          )}
          <h1 className="mt-2 text-3xl font-bold">{product.name}</h1>
          {product.brand && <p className="text-muted-foreground">{product.brand}</p>}
          <div className="mt-2 flex items-center gap-2">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < Math.round(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
              ))}
            </div>
            <span className="text-sm">{product.rating.toFixed(1)} ({product.numReviews} reviews)</span>
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
            {product.comparePrice && (
              <span className="text-lg text-muted-foreground line-through">{formatPrice(product.comparePrice)}</span>
            )}
          </div>
          <p className="mt-4 text-muted-foreground">{product.description}</p>
          <p className="mt-2 text-sm">SKU: {product.sku}</p>
          <p className={`mt-1 text-sm ${product.stock > 0 ? 'text-green-600' : 'text-destructive'}`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </p>

          {isAuthenticated && product.stock > 0 && (
            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{quantity}</span>
                <Button variant="outline" size="icon" onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button onClick={handleAddToCart} className="flex-1">
                <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
              </Button>
              <Button variant="outline" size="icon" onClick={handleToggleWishlist}>
                <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
            </div>
          )}
        </div>
      </div>

      <Separator className="my-12" />

      <section>
        <h2 className="mb-6 text-2xl font-bold">Customer Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-muted-foreground">No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="rounded-lg border p-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{review.user.name}</span>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                    ))}
                  </div>
                </div>
                <h4 className="mt-1 font-medium">{review.title}</h4>
                <p className="mt-1 text-sm text-muted-foreground">{review.comment}</p>
              </div>
            ))}
          </div>
        )}

        {isAuthenticated && (
          <form onSubmit={handleSubmitReview} className="mt-8 max-w-lg space-y-4 rounded-lg border p-6">
            <h3 className="font-semibold">Write a Review</h3>
            <div>
              <Label>Rating</Label>
              <SelectRating value={reviewForm.rating} onChange={(r) => setReviewForm({ ...reviewForm, rating: r })} />
            </div>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={reviewForm.title} onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="comment">Comment</Label>
              <Textarea id="comment" value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} required rows={4} />
            </div>
            <Button type="submit" disabled={submittingReview}>Submit Review</Button>
          </form>
        )}
      </section>
    </div>
  );
}

function SelectRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <button key={i} type="button" onClick={() => onChange(i + 1)}>
          <Star className={`h-6 w-6 ${i < value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
        </button>
      ))}
    </div>
  );
}

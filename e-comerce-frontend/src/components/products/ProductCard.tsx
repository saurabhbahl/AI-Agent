import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string) => void;
  onToggleWishlist?: (productId: string) => void;
  isInWishlist?: boolean;
}

export function ProductCard({ product, onAddToCart, onToggleWishlist, isInWishlist }: ProductCardProps) {
  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
      <Link to={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
          loading="lazy"
        />
        {discount > 0 && (
          <Badge className="absolute left-2 top-2" variant="destructive">
            -{discount}%
          </Badge>
        )}
        {product.isFeatured && (
          <Badge className="absolute right-2 top-2" variant="secondary">
            Featured
          </Badge>
        )}
      </Link>
      <CardContent className="p-4">
        {product.brand && <p className="text-xs text-muted-foreground">{product.brand}</p>}
        <Link to={`/products/${product.slug}`}>
          <h3 className="mt-1 line-clamp-2 font-medium hover:text-primary">{product.name}</h3>
        </Link>
        <div className="mt-2 flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm">{product.rating.toFixed(1)}</span>
          <span className="text-sm text-muted-foreground">({product.numReviews})</span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-lg font-bold">{formatPrice(product.price)}</span>
          {product.comparePrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.comparePrice)}
            </span>
          )}
        </div>
        {product.stock <= 10 && product.stock > 0 && (
          <p className="mt-1 text-xs text-orange-600">Only {product.stock} left</p>
        )}
        {product.stock === 0 && <p className="mt-1 text-xs text-destructive">Out of stock</p>}
      </CardContent>
      <CardFooter className="gap-2 p-4 pt-0">
        <Button
          className="flex-1"
          size="sm"
          disabled={product.stock === 0}
          onClick={() => onAddToCart?.(product._id)}
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </Button>
        {onToggleWishlist && (
          <Button
            variant="outline"
            size="icon"
            className="shrink-0"
            onClick={() => onToggleWishlist(product._id)}
          >
            <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, User, Search, Menu, LogOut, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { selectCartCount } from '@/store/slices/cartSlice';
import { selectWishlistCount } from '@/store/slices/wishlistSlice';

export function Navbar() {
  const [search, setSearch] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const cartCount = useAppSelector(selectCartCount);
  const wishlistCount = useAppSelector(selectWishlistCount);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
      setMobileOpen(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <Link to="/" className="text-xl font-bold text-primary">
          ShopHub
        </Link>

        <form onSubmit={handleSearch} className="hidden flex-1 max-w-md md:flex">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </form>

        <nav className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" asChild>
            <Link to="/products">Products</Link>
          </Button>
          {isAuthenticated && (
            <>
              <Button variant="ghost" size="icon" asChild>
                <Link to="/wishlist" aria-label="Wishlist">
                  <Heart className="h-5 w-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild className="relative">
                <Link to="/cart" aria-label="Cart">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </Button>
            </>
          )}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              {user?.role === 'admin' && (
                <Button variant="outline" size="sm" asChild>
                  <Link to="/admin">
                    <LayoutDashboard className="mr-1 h-4 w-4" />
                    Admin
                  </Link>
                </Button>
              )}
              <Button variant="ghost" size="sm" asChild>
                <Link to="/profile">
                  <User className="mr-1 h-4 w-4" />
                  {user?.name.split(' ')[0]}
                </Link>
              </Button>
              <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Logout">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Sign Up</Link>
              </Button>
            </div>
          )}
        </nav>

        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {mobileOpen && (
        <div className="border-t px-4 py-4 md:hidden">
          <form onSubmit={handleSearch} className="mb-4">
            <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </form>
          <div className="flex flex-col gap-2">
            <Button variant="ghost" asChild className="justify-start">
              <Link to="/products" onClick={() => setMobileOpen(false)}>Products</Link>
            </Button>
            {isAuthenticated && (
              <>
                <Button variant="ghost" asChild className="justify-start">
                  <Link to="/cart" onClick={() => setMobileOpen(false)}>Cart ({cartCount})</Link>
                </Button>
                <Button variant="ghost" asChild className="justify-start">
                  <Link to="/wishlist" onClick={() => setMobileOpen(false)}>Wishlist ({wishlistCount})</Link>
                </Button>
                <Button variant="ghost" asChild className="justify-start">
                  <Link to="/profile" onClick={() => setMobileOpen(false)}>Profile</Link>
                </Button>
                {user?.role === 'admin' && (
                  <Button variant="ghost" asChild className="justify-start">
                    <Link to="/admin" onClick={() => setMobileOpen(false)}>Admin Dashboard</Link>
                  </Button>
                )}
                <Button variant="ghost" className="justify-start" onClick={handleLogout}>Logout</Button>
              </>
            )}
            {!isAuthenticated && (
              <>
                <Button variant="ghost" asChild className="justify-start">
                  <Link to="/login" onClick={() => setMobileOpen(false)}>Login</Link>
                </Button>
                <Button asChild className="justify-start">
                  <Link to="/register" onClick={() => setMobileOpen(false)}>Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

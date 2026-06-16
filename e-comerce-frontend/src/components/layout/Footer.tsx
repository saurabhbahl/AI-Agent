import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto grid gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <h3 className="text-lg font-bold text-primary">ShopHub</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Your one-stop destination for quality products at great prices.
          </p>
        </div>
        <div>
          <h4 className="font-semibold">Shop</h4>
          <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/products" className="hover:text-primary">All Products</Link></li>
            <li><Link to="/products?featured=true" className="hover:text-primary">Featured</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Account</h4>
          <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/login" className="hover:text-primary">Login</Link></li>
            <li><Link to="/register" className="hover:text-primary">Register</Link></li>
            <li><Link to="/orders" className="hover:text-primary">Order History</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Support</h4>
          <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
            <li>Email: support@shophub.com</li>
            <li>Phone: 1-800-SHOP-HUB</li>
          </ul>
        </div>
      </div>
      <div className="border-t py-4 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} ShopHub. All rights reserved.
      </div>
    </footer>
  );
}

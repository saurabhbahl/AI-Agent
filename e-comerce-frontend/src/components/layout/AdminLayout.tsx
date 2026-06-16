import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Users,
  Warehouse,
  ArrowLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: FolderTree },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/inventory', label: 'Inventory', icon: Warehouse },
];

export function AdminLayout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 border-r bg-muted/30 lg:block">
        <div className="flex h-16 items-center border-b px-6">
          <span className="text-lg font-bold text-primary">ShopHub Admin</span>
        </div>
        <nav className="space-y-1 p-4">
          {navItems.map(({ to, label, icon: Icon, exact }) => {
            const isActive = exact ? location.pathname === to : location.pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t p-4">
          <Button variant="outline" size="sm" className="w-full" asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Store
            </Link>
          </Button>
        </div>
      </aside>
      <div className="flex-1">
        <header className="flex h-16 items-center border-b px-4 lg:hidden">
          <span className="font-bold text-primary">Admin Panel</span>
        </header>
        <div className="overflow-x-auto border-b lg:hidden">
          <nav className="flex gap-1 p-2">
            {navItems.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={cn(
                  'whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium',
                  location.pathname === to || (to !== '/admin' && location.pathname.startsWith(to))
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground',
                )}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <main className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

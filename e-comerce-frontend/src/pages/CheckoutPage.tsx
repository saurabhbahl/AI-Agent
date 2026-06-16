import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatPrice } from '@/lib/utils';
import { orderApi } from '@/services/endpoints';
import { getErrorMessage } from '@/services/api';
import { useAppSelector } from '@/store/hooks';
import { selectCartTotal } from '@/store/slices/cartSlice';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const total = useAppSelector(selectCartTotal);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
  });

  const tax = Math.round(total * 0.08 * 100) / 100;
  const shipping = total >= 100 ? 0 : 9.99;
  const grandTotal = total + tax + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await orderApi.create({ shippingAddress: address, paymentMethod });
      setSuccess(true);
      setTimeout(() => navigate(`/orders/${data.data!._id}`), 2000);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        <h2 className="mt-4 text-2xl font-bold">Order Placed Successfully!</h2>
        <p className="mt-2 text-muted-foreground">Redirecting to order details...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>
      <div className="grid gap-8 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

          <Card>
            <CardHeader><CardTitle>Shipping Address</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="street">Street Address</Label>
                <Input id="street" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input id="state" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input id="zip" value={address.zipCode} onChange={(e) => setAddress({ ...address, zipCode: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} required />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Payment Method (Mock)</CardTitle></CardHeader>
            <CardContent>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="card">Credit/Debit Card</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="cod">Cash on Delivery</SelectItem>
                </SelectContent>
              </Select>
              <p className="mt-2 text-xs text-muted-foreground">This is a mock checkout. No real payment will be processed.</p>
            </CardContent>
          </Card>

          <Button type="submit" size="lg" className="w-full" disabled={loading || total === 0}>
            {loading ? 'Processing...' : `Place Order - ${formatPrice(grandTotal)}`}
          </Button>
        </form>

        <Card className="h-fit">
          <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(total)}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>{formatPrice(tax)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span></div>
            <Separator className="my-2" />
            <div className="flex justify-between font-bold text-base"><span>Total</span><span>{formatPrice(grandTotal)}</span></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

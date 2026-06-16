import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartApi } from '@/services/endpoints';
import { getErrorMessage } from '@/services/api';
import type { CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchCart = createAsyncThunk('cart/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await cartApi.get();
    return data.data!.items;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const addToCart = createAsyncThunk(
  'cart/add',
  async ({ productId, quantity }: { productId: string; quantity: number }, { rejectWithValue }) => {
    try {
      const { data } = await cartApi.addItem(productId, quantity);
      return data.data!.items;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateCartItem = createAsyncThunk(
  'cart/update',
  async ({ productId, quantity }: { productId: string; quantity: number }, { rejectWithValue }) => {
    try {
      const { data } = await cartApi.updateItem(productId, quantity);
      return data.data!.items;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const removeFromCart = createAsyncThunk(
  'cart/remove',
  async (productId: string, { rejectWithValue }) => {
    try {
      const { data } = await cartApi.removeItem(productId);
      return data.data!.items;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const clearCart = createAsyncThunk('cart/clear', async (_, { rejectWithValue }) => {
  try {
    await cartApi.clear();
    return [] as CartItem[];
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    resetCart: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state) => {
        state.loading = false;
        state.items = [];
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export const { resetCart } = cartSlice.actions;

export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartCount = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectCartTotal = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

export default cartSlice.reducer;

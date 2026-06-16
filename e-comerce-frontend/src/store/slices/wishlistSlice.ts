import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { wishlistApi } from '@/services/endpoints';
import { getErrorMessage } from '@/services/api';
import type { Product } from '@/types';

interface WishlistState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  products: [],
  loading: false,
  error: null,
};

export const fetchWishlist = createAsyncThunk('wishlist/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await wishlistApi.get();
    return data.data!.products;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const addToWishlist = createAsyncThunk(
  'wishlist/add',
  async (productId: string, { rejectWithValue }) => {
    try {
      const { data } = await wishlistApi.add(productId);
      return data.data!.products;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/remove',
  async (productId: string, { rejectWithValue }) => {
    try {
      const { data } = await wishlistApi.remove(productId);
      return data.data!.products;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.products = action.payload;
        state.loading = false;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.products = action.payload;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.products = action.payload;
      });
  },
});

export const selectWishlistCount = (state: { wishlist: WishlistState }) =>
  state.wishlist.products.length;

export default wishlistSlice.reducer;

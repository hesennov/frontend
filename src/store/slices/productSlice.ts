import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api';

export interface Product {
  id: number;
  name: string;
  description: string | null;
  base_price: number;
  image: string | null;
  category_id: number;
  category?: { id: number; name: string };
  branchProducts?: Array<{
    branch_id: number;
    stock_count: number;
    price_override: number | null;
    is_active: boolean;
  }>;
}

interface ProductState {
  items: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  isLoading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  items: [],
  meta: {
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 0
  },
  isLoading: false,
  error: null,
};

// Fetch Products from Backend with Pagination Support
export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (params: { branchId?: number; page?: number; limit?: number } | void, { rejectWithValue }) => {
    try {
      const { branchId = 1, page = 1, limit = 12 } = params || {};
      const response = await api.get(`/products?branch_id=${branchId}&page=${page}&limit=${limit}`);
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || 'Ürünler yüklenirken hata oluştu');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.data;
        state.meta = action.payload.meta || state.meta;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default productSlice.reducer;

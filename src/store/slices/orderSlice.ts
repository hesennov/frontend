import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { api } from '@/services/api';

export interface OrderData {
  id: number;
  status: string;
  phone?: string;
  total_price?: number;
  address?: string;
  items?: any[];
  [key: string]: unknown;
}

interface OrderState {
  activeOrders: OrderData[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  isLoading: boolean;
}

const initialState: OrderState = {
  activeOrders: [],
  meta: {
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0
  },
  isLoading: false,
};

export const fetchActiveOrders = createAsyncThunk(
  'order/fetchActive',
  async (params: { page?: number; limit?: number } | void) => {
    const { page = 1, limit = 20 } = params || {};
    const response = await api.get(`/orders/active?page=${page}&limit=${limit}`);
    return response.data;
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addOrderRealtime: (state, action: PayloadAction<OrderData>) => {
      const exists = state.activeOrders.find(o => o.id === action.payload.id);
      if (!exists) {
        state.activeOrders.unshift(action.payload);
        state.meta.total += 1;
      }
    },
    updateOrderStatusRealtime: (state, action: PayloadAction<{ id: number; status: string }>) => {
      const order = state.activeOrders.find((o) => o.id === action.payload.id);
      if (order) {
        order.status = action.payload.status;
        if (action.payload.status === 'DELIVERED' || action.payload.status === 'CANCELLED') {
          state.activeOrders = state.activeOrders.filter(o => o.id !== action.payload.id);
          state.meta.total -= 1;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActiveOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchActiveOrders.fulfilled, (state, action) => {
        state.activeOrders = action.payload.data;
        state.meta = action.payload.meta || state.meta;
        state.isLoading = false;
      })
      .addCase(fetchActiveOrders.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { addOrderRealtime, updateOrderStatusRealtime } = orderSlice.actions;
export default orderSlice.reducer;

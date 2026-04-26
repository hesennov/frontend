import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { api } from '@/services/api';

export interface Branch {
  id: number;
  name: string;
  address: string;
  is_active: boolean;
}

interface BranchState {
  selectedBranchId: number | null;
  branches: Branch[];
  isLoading: boolean;
}

const initialState: BranchState = {
  selectedBranchId: Number(localStorage.getItem('selectedBranchId')) || null,
  branches: [],
  isLoading: false,
};

export const fetchBranches = createAsyncThunk(
  'branch/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/branches');
      return response.data.data || response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || 'Şubeler yüklenirken hata oluştu');
    }
  }
);

const branchSlice = createSlice({
  name: 'branch',
  initialState,
  reducers: {
    selectBranch: (state, action: PayloadAction<number>) => {
      state.selectedBranchId = action.payload;
      localStorage.setItem('selectedBranchId', action.payload.toString());
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBranches.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchBranches.fulfilled, (state, action) => {
        state.isLoading = false;
        state.branches = action.payload;
        if (!state.selectedBranchId && action.payload.length > 0) {
          state.selectedBranchId = action.payload[0].id;
        }
      })
      .addCase(fetchBranches.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { selectBranch } = branchSlice.actions;
export default branchSlice.reducer;

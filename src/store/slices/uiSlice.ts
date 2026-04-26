import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface AlarmItem {
  id: number;
  message: string;
}

interface UiState {
  pendingAlarms: AlarmItem[];
  activeModal: string | null;
  isLoading: boolean;
  isCartOpen: boolean;
}

const initialState: UiState = {
  pendingAlarms: [],
  activeModal: null,
  isLoading: false,
  isCartOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    triggerAlarm: (state, action: PayloadAction<AlarmItem>) => {
      // Don't add if already in pending alarms
      const exists = state.pendingAlarms.find(a => a.id === action.payload.id);
      if (!exists) {
        state.pendingAlarms.push(action.payload);
      }
    },
    clearAlarm: (state, action: PayloadAction<number>) => {
      state.pendingAlarms = state.pendingAlarms.filter(a => a.id !== action.payload);
    },
    clearAllAlarms: (state) => {
      state.pendingAlarms = [];
    },
    openModal: (state, action: PayloadAction<string>) => {
      state.activeModal = action.payload;
    },
    closeModal: (state) => {
      state.activeModal = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    toggleCart: (state) => {
      state.isCartOpen = !state.isCartOpen;
    },
    closeCart: (state) => {
      state.isCartOpen = false;
    },
  },
});

export const { 
  triggerAlarm, 
  clearAlarm, 
  clearAllAlarms,
  openModal, 
  closeModal, 
  setLoading, 
  toggleCart, 
  closeCart 
} = uiSlice.actions;
export default uiSlice.reducer;

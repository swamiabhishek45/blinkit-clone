import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './index';

interface User {
  id: string;
  mobile: string;
  name?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  otpSent: boolean;
  pendingMobile: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isAuthModalOpen: false,
  otpSent: false,
  pendingMobile: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isAuthModalOpen = false;
      state.otpSent = false;
      state.pendingMobile = null;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    openAuthModal: (state) => {
      state.isAuthModalOpen = true;
    },
    closeAuthModal: (state) => {
      state.isAuthModalOpen = false;
      state.otpSent = false;
      state.pendingMobile = null;
    },
    setOtpSent: (state, action: PayloadAction<string>) => {
      state.otpSent = true;
      state.pendingMobile = action.payload;
    }
  },
});

export const {
  setUser,
  logout,
  openAuthModal,
  closeAuthModal,
  setOtpSent,
} = authSlice.actions;

// Selectors
export const selectUser = (state: RootState) => state.auth.user;

export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectIsAuthModalOpen = (state: RootState) => state.auth.isAuthModalOpen;

export const selectOtpSent = (state: RootState) => state.auth.otpSent;
export const selectPendingMobile = (state: RootState) => state.auth.pendingMobile;

export default authSlice.reducer;

// src/store/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../lib/firebase"; // adjust if needed

export const listenToAuthChanges = createAsyncThunk(
  "auth/listenToAuthChanges",
  async (_, { dispatch }) => {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          dispatch(setUser(user));
        } else {
          dispatch(logout());
        }
        resolve(); // only needed to satisfy thunk middleware
      });
    });
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    logout(state) {
      state.user = null;
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;

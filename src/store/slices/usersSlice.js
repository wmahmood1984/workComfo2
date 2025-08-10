// src/store/slices/usersSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import toast from "react-hot-toast";

export const fetchUserProfile = createAsyncThunk(
  "users/fetchUserProfile",
  async (userId) => {
    const ref = doc(db, "users", userId);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error("User not found");
    return { userId, data: snap.data() };
  }
);

// **NEW**: Update profile
export const updateUserProfile = createAsyncThunk(
  "users/updateUserProfile",
  async ({ userId, data }) => {
    await setDoc(doc(db, "users", userId), data, { merge: true });
    toast.success("Profile updated!");
    return { userId, data };
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState: {
    profiles: {}, // { userId: { firstName, lastName, ... } }
    loading: false,
    saving: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profiles[action.payload.userId] = action.payload.data;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update
      .addCase(updateUserProfile.pending, (state) => {
        state.saving = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.saving = false;
        state.profiles[action.payload.userId] = {
          ...state.profiles[action.payload.userId],
          ...action.payload.data,
        };
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message;
      });
  },
});

export default usersSlice.reducer;

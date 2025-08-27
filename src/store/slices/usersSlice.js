import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../lib/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

// Fetch existing profile
export const fetchUserProfile = createAsyncThunk(
  "profile/fetchUserProfile",
  async (uid, { rejectWithValue }) => {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() : null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create profile
export const createUserProfile = createAsyncThunk(
  "profile/createUserProfile",
  async ({ uid, profileData }, { rejectWithValue }) => {
    try {
      const docRef = doc(db, "users", uid);
      await setDoc(docRef, profileData);
      return profileData; // update Redux immediately
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update profile
export const updateUserProfile = createAsyncThunk(
  "profile/updateUserProfile",
  async ({ uid, updates }, { rejectWithValue }) => {
    try {
      const docRef = doc(db, "users", uid);
      await updateDoc(docRef, updates);
      return updates; // merge into Redux state
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearProfile: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createUserProfile.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      // Update
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.data = { ...state.data, ...action.payload };
      });
  },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;

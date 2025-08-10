import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";

export const fetchGigs = createAsyncThunk("gigs/fetchGigs", async () => {
  const snapshot = await getDocs(collection(db, "gigs"));
  const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const shuffled = [...data].sort(() => 0.5 - Math.random());
  return { all: data, shuffled: shuffled.slice(0, 20) };
});

export const fetchAllGigs = createAsyncThunk("gigs/fetchAllGigs", async () => {
  const snapshot = await getDocs(collection(db, "gigs"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
});


const gigsSlice = createSlice({
  name: "gigs",
  initialState: {
    allGigs: [],
    shuffledGigs: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGigs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGigs.fulfilled, (state, action) => {
        state.loading = false;
        state.allGigs = action.payload.all;
        state.shuffledGigs = action.payload.shuffled;
      })
      .addCase(fetchGigs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchAllGigs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllGigs.fulfilled, (state, action) => {
        state.loading = false;
        state.allGigs = action.payload;
      })
      .addCase(fetchAllGigs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default gigsSlice.reducer;

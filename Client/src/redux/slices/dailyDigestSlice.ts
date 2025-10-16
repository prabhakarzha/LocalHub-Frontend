import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store"; // Make sure path is correct

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ✅ Async thunk to fetch daily digest
export const fetchDailyDigest = createAsyncThunk(
  "digest/fetchDailyDigest",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token;

    const response = await axios.get(`${API_BASE_URL}/api/daily-digest`, {
      headers: { Authorization: `Bearer ${token}` }, // private route
    });
    return response.data;
  }
);

// ✅ Slice type
interface DigestState {
  data: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: DigestState = {
  data: null,
  loading: false,
  error: null,
};

// ✅ Create slice
const digestSlice = createSlice({
  name: "digest",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDailyDigest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchDailyDigest.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.data = action.payload;
        }
      )
      .addCase(fetchDailyDigest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch daily digest";
      });
  },
});

export default digestSlice.reducer;

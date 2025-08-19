import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// API Base
const API_URL =
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(
    /\/$/,
    ""
  ) + "/api/users";

// Thunk: fetch total registered users
export const fetchUserCount = createAsyncThunk<
  number,
  void,
  { rejectValue: string }
>("users/fetchCount", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API_URL}/count`);
    // Return totalUsers directly
    return res.data.totalUsers;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch user count"
    );
  }
});

// State type
interface UserState {
  totalUsers: number;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: UserState = {
  totalUsers: 0,
  loading: false,
  error: null,
};

// Slice
const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserCount.fulfilled, (state, action) => {
        state.totalUsers = action.payload; // store total registered users
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchUserCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch user count";
      });
  },
});

export default userSlice.reducer;

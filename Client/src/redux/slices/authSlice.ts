import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Fix: Remove trailing slash from API_URL (to avoid `//api/...`)
const API_URL =
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(
    /\/$/,
    ""
  ) + "/api/auth";

// Register User
export const registerUser = createAsyncThunk<
  any,
  { name: string; email: string; password: string },
  { rejectValue: string }
>("auth/register", async (userData, { rejectWithValue }) => {
  try {
    console.log("Register API Request to:", `${API_URL}/register`);
    const res = await axios.post(`${API_URL}/register`, userData);
    console.log("Register API Response:", res.data);
    return res.data;
  } catch (error: any) {
    console.error(
      "Register API Failed:",
      error.response?.data || error.message
    );
    return rejectWithValue(
      error.response?.data?.message || "Registration failed"
    );
  }
});

// Login User
export const loginUser = createAsyncThunk<
  any,
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async (userData, { rejectWithValue }) => {
  try {
    console.log("Login API Request to:", `${API_URL}/login`, "with", userData);
    const res = await axios.post(`${API_URL}/login`, userData);
    console.log("Login API Response:", res.data);
    return res.data;
  } catch (error: any) {
    console.error("Login API Failed:", error.response?.data || error.message);
    return rejectWithValue(error.response?.data?.message || "Login failed");
  }
});

// Fetch Profile
export const fetchProfile = createAsyncThunk<
  any,
  string,
  { rejectValue: string }
>("auth/profile", async (token, { rejectWithValue }) => {
  try {
    console.log("Fetching Profile...");
    const res = await axios.get(`${API_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Profile API Response:", res.data);
    return res.data;
  } catch (error: any) {
    console.error("Profile API Failed:", error.response?.data || error.message);
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch profile"
    );
  }
});

interface AuthState {
  user: any | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem("token");
    },
    resetLoading: (state) => {
      console.warn("Resetting stuck loading state");
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        console.log("Register Pending...");
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        console.log("Register Fulfilled:", action.payload);
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        console.error("Register Rejected:", action.payload);
        state.loading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Registration failed";
      })
      .addCase(loginUser.pending, (state) => {
        console.log("Login Pending...");
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log("Login Fulfilled:", action.payload);
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        console.error("Login Rejected:", action.payload);
        state.loading = false;
        state.error =
          (action.payload as string) || action.error.message || "Login failed";
      })
      .addCase(fetchProfile.pending, (state) => {
        console.log("Profile Fetch Pending...");
        state.loading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        console.log("Profile Fetch Fulfilled:", action.payload);
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        console.error("Profile Fetch Rejected:", action.payload);
        state.loading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Profile fetch failed";
      });
  },
});

export const { logout, resetLoading } = authSlice.actions;
export default authSlice.reducer;

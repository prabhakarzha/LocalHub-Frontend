import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// API Base
const API_URL =
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(
    /\/$/,
    ""
  ) + "/api/auth";

// Types
interface UserType {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

interface AuthState {
  user: UserType | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// Initial State
const initialState: AuthState = {
  user: null,
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  loading: false,
  error: null,
};

// Thunks
export const registerUser = createAsyncThunk<
  { token: string; user: UserType },
  { name: string; email: string; password: string },
  { rejectValue: string }
>("auth/register", async (userData, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${API_URL}/register`, userData);

    return {
      token: res.data.token,
      user: {
        _id: res.data.user._id,
        name: res.data.user.name,
        email: res.data.user.email,
        role: res.data.user.role, // ✅ correct role will now be saved
      },
    };
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Registration failed"
    );
  }
});

export const loginUser = createAsyncThunk<
  { token: string; user: UserType },
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async (userData, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${API_URL}/login`, userData);
    return {
      token: res.data.token,
      user: {
        _id: res.data.user._id,
        name: res.data.user.name,
        email: res.data.user.email,
        role: res.data.user.role, // ✅ use exactly as returned
      },
    };
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Login failed");
  }
});

export const fetchProfile = createAsyncThunk<
  UserType,
  string,
  { rejectValue: string }
>("auth/profile", async (token, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch profile"
    );
  }
});

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
    },
    resetLoading: (state) => {
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.loading = false;
        state.error = null;
        if (typeof window !== "undefined") {
          localStorage.setItem("token", action.payload.token);
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
      })

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const { user, token } = action.payload;
        console.log(
          "✅ [authSlice] loginUser.fulfilled → user.role:",
          user.role
        ); // Debug

        state.user = user;
        state.token = token;
        state.loading = false;
        state.error = null;
        if (typeof window !== "undefined") {
          localStorage.setItem("token", token);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })

      // PROFILE
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Profile fetch failed";
      });
  },
});

export const { logout, resetLoading } = authSlice.actions;
export default authSlice.reducer;

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";

interface Service {
  _id: string;
  title: string;
  description: string;
  price: string;
  contact: string;
  image?: string;
  provider?: string;
}

export interface ServiceBooking {
  _id: string;
  serviceId: Service;
  userId?: string;
  message?: string;
  contactInfo?: string;
  status?: string;
  createdAt: string;
}

interface ServiceBookingState {
  List: ServiceBooking[];
  loading: boolean;
  error: string | null;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api/servicebookings`
  : "http://localhost:5000/api/servicebookings";

//
// ✅ Async Thunks
//

// Book a service
export const bookService = createAsyncThunk<
  ServiceBooking, // return type
  { serviceId: string; message?: string; contactInfo?: string }, // argument type
  { rejectValue: string; state: RootState } // thunkAPI
>(
  "servicebookings/bookService",
  async (
    { serviceId, message, contactInfo },
    { rejectWithValue, getState }
  ) => {
    try {
      const token =
        getState().auth.token ||
        (typeof window !== "undefined" && localStorage.getItem("token"));

      if (!token) throw new Error("No authentication token found");

      console.log("Booking Payload:", { serviceId, message, contactInfo });

      const res = await axios.post(
        API_URL,
        { serviceId, message, contactInfo },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return res.data.booking as ServiceBooking;
    } catch (error: any) {
      console.error("Booking Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to book service"
      );
    }
  }
);

// Fetch all service bookings
export const fetchServiceBookings = createAsyncThunk<
  ServiceBooking[], // return type
  void, // no argument
  { rejectValue: string; state: RootState }
>(
  "servicebookings/fetchServiceBookings",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token =
        getState().auth.token ||
        (typeof window !== "undefined" && localStorage.getItem("token"));

      if (!token) throw new Error("No authentication token found");

      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (Array.isArray(res.data.bookings)) {
        return res.data.bookings as ServiceBooking[];
      }

      throw new Error("Unexpected API response structure");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch service bookings"
      );
    }
  }
);

// Cancel service booking
export const cancelServiceBooking = createAsyncThunk<
  string, // return booking ID
  string, // booking ID argument
  { rejectValue: string; state: RootState }
>(
  "servicebookings/cancelServiceBooking",
  async (bookingId, { rejectWithValue, getState }) => {
    try {
      const token =
        getState().auth.token ||
        (typeof window !== "undefined" && localStorage.getItem("token"));

      if (!token) throw new Error("No authentication token found");

      await axios.delete(`${API_URL}/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return bookingId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to cancel service booking"
      );
    }
  }
);

//
// ✅ Slice
//

const initialState: ServiceBookingState = {
  List: [],
  loading: false,
  error: null,
};

const serviceBookingSlice = createSlice({
  name: "servicebookings",
  initialState,
  reducers: {
    clearServiceBookings: (state) => {
      state.List = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch bookings
      .addCase(fetchServiceBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchServiceBookings.fulfilled,
        (state, action: PayloadAction<ServiceBooking[]>) => {
          state.loading = false;
          state.List = action.payload;
        }
      )
      .addCase(fetchServiceBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unable to fetch service bookings";
      })

      // Book service
      .addCase(bookService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        bookService.fulfilled,
        (state, action: PayloadAction<ServiceBooking>) => {
          state.loading = false;
          state.List.push(action.payload);
        }
      )
      .addCase(bookService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to book service";
      })

      // Cancel booking
      .addCase(cancelServiceBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        cancelServiceBooking.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.List = state.List.filter(
            (booking) => booking._id !== action.payload
          );
        }
      )
      .addCase(cancelServiceBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to cancel service booking";
      });
  },
});

export const { clearServiceBookings } = serviceBookingSlice.actions;
export default serviceBookingSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store"; // <-- store type import (important)

const API_URL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api/bookings`
  : "http://localhost:5000/api/bookings";

// Fetch user bookings (with proper types)
export const fetchBookings = createAsyncThunk<
  any[], // Return type (list of bookings)
  void, // No argument (underscore `_` ka use hua hai)
  { rejectValue: string; state: RootState } // Types for rejectValue and state
>("bookings/fetchBookings", async (_, { rejectWithValue, getState }) => {
  try {
    const token =
      getState().auth?.token ||
      (typeof window !== "undefined" && localStorage.getItem("token"));

    const res = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.bookings || [];
  } catch (error) {
    return rejectWithValue("Failed to fetch bookings");
  }
});

// Cancel a booking (with proper types)
export const cancelBooking = createAsyncThunk<
  string, // Return type (bookingId jo delete hua)
  string, // Payload type (bookingId pass hoga)
  { rejectValue: string; state: RootState } // Extra options
>(
  "bookings/cancelBooking",
  async (bookingId, { rejectWithValue, getState }) => {
    try {
      const token =
        getState().auth?.token ||
        (typeof window !== "undefined" && localStorage.getItem("token"));

      await axios.delete(`${API_URL}/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return bookingId;
    } catch (error) {
      return rejectWithValue("Failed to cancel booking");
    }
  }
);

// Book an event (already correct)
export const bookEvent = createAsyncThunk<
  any, // Return type (single booking object)
  { eventId: string }, // Payload type
  { rejectValue: string; state: RootState } // Types for state and reject
>("bookings/bookEvent", async ({ eventId }, { rejectWithValue, getState }) => {
  try {
    const token =
      getState().auth?.token ||
      (typeof window !== "undefined" && localStorage.getItem("token"));

    const res = await axios.post(
      API_URL,
      { eventId },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data.booking;
  } catch (error) {
    return rejectWithValue("Failed to RSVP for event");
  }
});

const bookingsSlice = createSlice({
  name: "bookings",
  initialState: {
    list: [] as any[],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Bookings
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unable to fetch bookings";
      })

      // Cancel Booking
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.list = state.list.filter((b) => b._id !== action.payload);
      })

      // Book Event
      .addCase(bookEvent.fulfilled, (state, action) => {
        state.list.push(action.payload);
      });
  },
});

export default bookingsSlice.reducer;

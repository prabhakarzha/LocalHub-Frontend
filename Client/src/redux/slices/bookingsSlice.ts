import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";

const API_URL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api/bookings`
  : "http://localhost:5000/api/bookings";

// Fetch all bookings
export const getBookings = createAsyncThunk<
  any[],
  void,
  { rejectValue: string; state: RootState }
>("bookings/getBookings", async (_, { rejectWithValue, getState }) => {
  try {
    const token =
      getState().auth?.token ||
      (typeof window !== "undefined" && localStorage.getItem("token"));

    const res = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Fetched bookings:", res.data.bookings); // debug

    return res.data.bookings || [];
  } catch (error) {
    return rejectWithValue("Failed to fetch bookings");
  }
});

// Cancel a booking
export const cancelBooking = createAsyncThunk<
  string,
  string,
  { rejectValue: string; state: RootState }
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

// Book an event
export const bookEvent = createAsyncThunk<
  any,
  { eventId: string },
  { rejectValue: string; state: RootState }
>("bookings/bookEvent", async ({ eventId }, { rejectWithValue, getState }) => {
  try {
    const token =
      getState().auth?.token ||
      (typeof window !== "undefined" && localStorage.getItem("token"));

    const res = await axios.post(
      API_URL,
      { eventId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return res.data.booking;
  } catch (error) {
    return rejectWithValue("Failed to RSVP for event");
  }
});

interface BookingState {
  list: any[];
  loading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  list: [],
  loading: false,
  error: null,
};

const bookingsSlice = createSlice({
  name: "bookings", // match the store key
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch bookings
      .addCase(getBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(getBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unable to fetch bookings";
      })
      // Cancel booking
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.list = state.list.filter((b) => b._id !== action.payload);
      })
      // Book event
      .addCase(bookEvent.fulfilled, (state, action) => {
        state.list.push(action.payload);
      });
  },
});

export default bookingsSlice.reducer;

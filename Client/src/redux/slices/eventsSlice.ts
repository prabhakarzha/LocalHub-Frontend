import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { bookEvent } from "./bookingsSlice";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Normalize events (array format me ensure)
const normalizeEvents = (data: any) => {
  if (!data) return [];
  return Array.isArray(data) ? data : data.events || [];
};

// Fetch all events
export const getEvents = createAsyncThunk("events/getEvents", async () => {
  const response = await axios.get(`${API_BASE_URL}/api/events`);
  return normalizeEvents(response.data);
});

// Add new event (admin)
export const addEvent = createAsyncThunk(
  "events/addEvent",
  async (eventData: any) => {
    await axios.post(`${API_BASE_URL}/api/events`, eventData);
    const response = await axios.get(`${API_BASE_URL}/api/events`);
    return normalizeEvents(response.data);
  }
);

// Edit event
export const editEvent = createAsyncThunk<
  any,
  { id: string; eventData: FormData },
  { rejectValue: string }
>("events/editEvent", async ({ id, eventData }, { rejectWithValue }) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/events/${id}`,
      eventData
    );
    const updatedList = await axios.get(`${API_BASE_URL}/api/events`);
    return normalizeEvents(updatedList.data);
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

// Delete event
export const removeEvent = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("events/removeEvent", async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`${API_BASE_URL}/api/events/${id}`);
    const updatedList = await axios.get(`${API_BASE_URL}/api/events`);
    return normalizeEvents(updatedList.data);
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

const eventsSlice = createSlice({
  name: "events",
  initialState: {
    events: [] as any[],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get Events
      .addCase(getEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(getEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = normalizeEvents(action.payload);
      })
      .addCase(getEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch events";
      })

      // Add Event
      .addCase(addEvent.pending, (state) => {
        state.loading = true;
      })
      .addCase(addEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events = normalizeEvents(action.payload);
      })
      .addCase(addEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add event";
      })

      // Edit Event
      .addCase(editEvent.pending, (state) => {
        state.loading = true;
      })
      .addCase(editEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events = normalizeEvents(action.payload);
      })
      .addCase(editEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to edit event";
      })

      // Delete Event
      .addCase(removeEvent.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events = normalizeEvents(action.payload);
      })
      .addCase(removeEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete event";
      })

      // Sync events after RSVP (booking)
      .addCase(bookEvent.fulfilled, (state) => {
        state.loading = false;
      });
  },
});

export default eventsSlice.reducer;

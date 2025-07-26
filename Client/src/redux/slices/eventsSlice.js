import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "@/lib/api/events";
import { bookEvent } from "./bookingsSlice"; // Booking ke saath events reload karenge

// Normalize events (array format me ensure)
const normalizeEvents = (data) => {
  if (!data) return [];
  return Array.isArray(data) ? data : data.events || [];
};

// Fetch all events
export const getEvents = createAsyncThunk("events/getEvents", async () => {
  const response = await fetchEvents();
  return normalizeEvents(response);
});

// Add new event (admin)
export const addEvent = createAsyncThunk(
  "events/addEvent",
  async (eventData) => {
    await createEvent(eventData);
    const response = await fetchEvents();
    return normalizeEvents(response);
  }
);

// Edit event (admin)
export const editEvent = createAsyncThunk(
  "events/editEvent",
  async ({ id, eventData }) => {
    await updateEvent(id, eventData);
    const response = await fetchEvents();
    return normalizeEvents(response);
  }
);

// Delete event (admin)
export const removeEvent = createAsyncThunk(
  "events/removeEvent",
  async (id) => {
    await deleteEvent(id);
    const response = await fetchEvents();
    return normalizeEvents(response);
  }
);

const eventsSlice = createSlice({
  name: "events",
  initialState: {
    events: [],
    loading: false,
    error: null,
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
        state.error = action.error.message;
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
        state.error = action.error.message;
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
        state.error = action.error.message;
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
        state.error = action.error.message;
      })

      // Sync events after RSVP (booking) so latest list dikhe
      .addCase(bookEvent.fulfilled, (state) => {
        state.loading = false;
      });
  },
});

export default eventsSlice.reducer;

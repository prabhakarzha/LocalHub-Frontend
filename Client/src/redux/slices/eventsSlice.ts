import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { bookEvent } from "./bookingsSlice";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ✅ Normalize events utility
const normalizeEvents = (data: any) => {
  if (!data) return [];
  return Array.isArray(data) ? data : data.events || [];
};

// ✅ Fetch all events with pagination (for users)
export const getEvents = createAsyncThunk(
  "events/getEvents",
  async (
    { page = 1, limit = 6 }: { page?: number; limit?: number } = {},
    { getState },
  ) => {
    const state = getState() as any;
    const token = state.auth.token;

    const response = await axios.get(
      `${API_BASE_URL}/api/events?page=${page}&limit=${limit}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    return response.data;
  },
);

// ✅ Fetch ALL events for admin (no pagination limit)
export const getAllEvents = createAsyncThunk(
  "events/getAllEvents",
  async (_, { getState }) => {
    const state = getState() as any;
    const token = state.auth.token;

    const response = await axios.get(
      `${API_BASE_URL}/api/events/all?limit=1000`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    return response.data;
  },
);

// ✅ Fetch only event count (PUBLIC – no token)
export const fetchEventCount = createAsyncThunk(
  "events/fetchEventCount",
  async () => {
    const response = await axios.get(`${API_BASE_URL}/api/events/count`);
    return response.data.totalEvents || 0;
  },
);

// ✅ Fetch events created by current user
export const getUserEvents = createAsyncThunk(
  "events/getUserEvents",
  async (_, { getState }) => {
    const state = getState() as any;
    const token = state.auth.token;

    const response = await axios.get(
      `${API_BASE_URL}/api/events/user?limit=100`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    return normalizeEvents(response.data);
  },
);

// ✅ Add new event (User/Admin)
export const addEvent = createAsyncThunk(
  "events/addEvent",
  async (eventData: any, { getState }) => {
    const state = getState() as any;
    const token = state.auth.token;

    await axios.post(`${API_BASE_URL}/api/events`, eventData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    const response = await axios.get(`${API_BASE_URL}/api/events`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return normalizeEvents(response.data);
  },
);

// ✅ Approve/Decline Event (Admin)
export const updateEventStatus = createAsyncThunk(
  "events/updateEventStatus",
  async ({ id, status }: { id: string; status: string }, { getState }) => {
    const state = getState() as any;
    const token = state.auth.token;

    await axios.patch(
      `${API_BASE_URL}/api/events/${id}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } },
    );

    const updatedList = await axios.get(`${API_BASE_URL}/api/events`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return normalizeEvents(updatedList.data);
  },
);

// ✅ Edit Event
export const editEvent = createAsyncThunk<
  any,
  { id: string; eventData: FormData },
  { rejectValue: string; state: any }
>(
  "events/editEvent",
  async ({ id, eventData }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as any;
      const token = state.auth.token;

      await axios.put(`${API_BASE_URL}/api/events/${id}`, eventData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedList = await axios.get(`${API_BASE_URL}/api/events`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return normalizeEvents(updatedList.data);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

// ✅ Delete Event
export const removeEvent = createAsyncThunk<
  string,
  string,
  { rejectValue: string; state: any }
>("events/removeEvent", async (id, { rejectWithValue, getState }) => {
  try {
    const state = getState() as any;
    const token = state.auth.token;

    await axios.delete(`${API_BASE_URL}/api/events/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const updatedList = await axios.get(`${API_BASE_URL}/api/events`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return normalizeEvents(updatedList.data);
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

const eventsSlice = createSlice({
  name: "events",
  initialState: {
    events: [] as any[],
    allEvents: [] as any[], // For admin view
    eventCount: 0,
    loading: false,
    error: null as string | null,
    pagination: {
      page: 1,
      totalPages: 1,
      total: 0,
      limit: 6,
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ✅ Get Events (paginated)
      .addCase(getEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(getEvents.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload?.events && action.payload?.pagination) {
          state.events = action.payload.events;
          state.pagination = action.payload.pagination;
          state.eventCount = action.payload.pagination.total || 0;
        } else {
          state.events = normalizeEvents(action.payload);
          state.eventCount = state.events.length;
        }
      })
      .addCase(getEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch events";
      })

      // ✅ Get All Events (Admin)
      .addCase(getAllEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.allEvents = normalizeEvents(action.payload);
        state.eventCount = state.allEvents.length;
        // Also update regular events for backward compatibility
        state.events = state.allEvents;
      })
      .addCase(getAllEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch all events";
      })

      // ✅ Get User Events
      .addCase(getUserEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = normalizeEvents(action.payload);
      })
      .addCase(getUserEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch user events";
      })

      // ✅ Event Count
      .addCase(fetchEventCount.pending, (state) => {})
      .addCase(fetchEventCount.fulfilled, (state, action) => {
        state.eventCount = action.payload;
      })
      .addCase(fetchEventCount.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch event count";
      })

      // ✅ Add Event
      .addCase(addEvent.fulfilled, (state, action) => {
        state.events = normalizeEvents(action.payload);
        state.eventCount = state.events.length;
      })

      // ✅ Approve/Decline Event
      .addCase(updateEventStatus.fulfilled, (state, action) => {
        state.events = normalizeEvents(action.payload);
      })

      // ✅ Edit Event
      .addCase(editEvent.fulfilled, (state, action) => {
        state.events = normalizeEvents(action.payload);
      })

      // ✅ Remove Event
      .addCase(removeEvent.fulfilled, (state, action) => {
        state.events = normalizeEvents(action.payload);
        state.eventCount = state.events.length;
      })

      // ✅ Booking sync
      .addCase(bookEvent.fulfilled, (state) => {
        state.loading = false;
      });
  },
});

export default eventsSlice.reducer;

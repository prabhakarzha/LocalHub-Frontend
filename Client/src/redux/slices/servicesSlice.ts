import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ✅ Normalize services utility
const normalizeServices = (data: any) => {
  if (!data) return [];
  return Array.isArray(data) ? data : data.services || [];
};

export type ServiceType = {
  _id?: string;
  title: string;
  category: string;
  description: string;
  contact: string;
  price: string;
  image?: string;
};

interface ServiceState {
  services: ServiceType[];
  pendingServices: ServiceType[];
  serviceCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: ServiceState = {
  services: [],
  pendingServices: [],
  serviceCount: 0,
  loading: false,
  error: null,
};

// ✅ Fetch all services (protected)
export const getServices = createAsyncThunk(
  "services/getServices",
  async (_, { getState }) => {
    const state = getState() as any;
    const token = state.auth.token;

    const response = await axios.get(`${API_BASE_URL}/api/services`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return normalizeServices(response.data);
  }
);

// ✅ Fetch pending services (admin only)
export const getPendingServices = createAsyncThunk(
  "services/getPendingServices",
  async (_, { getState }) => {
    const state = getState() as any;
    const token = state.auth.token;

    const response = await axios.get(`${API_BASE_URL}/api/services/pending`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return normalizeServices(response.data);
  }
);

// ✅ Fetch services created by current user
export const getUserServices = createAsyncThunk(
  "services/getUserServices",
  async (_, { getState }) => {
    const state = getState() as any;
    const token = state.auth.token;

    const response = await axios.get(`${API_BASE_URL}/api/services/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return normalizeServices(response.data);
  }
);

// ✅ Fetch service count
export const fetchServiceCount = createAsyncThunk(
  "services/fetchServiceCount",
  async (_, { getState }) => {
    const state = getState() as any;
    const token = state.auth.token;

    const response = await axios.get(`${API_BASE_URL}/api/services`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return normalizeServices(response.data).length;
  }
);

// ✅ Add new service
export const addService = createAsyncThunk(
  "services/addService",
  async (serviceData: FormData, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any;
      const token = state.auth.token;

      const response = await axios.post(
        `${API_BASE_URL}/api/services`,
        serviceData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return normalizeServices(response.data);
    } catch (err: any) {
      console.error("Backend error object:", err);
      console.error("Backend response:", err.response);
      return rejectWithValue(err.response?.data || "Failed to create service");
    }
  }
);

// ✅ Edit a service
export const editService = createAsyncThunk(
  "services/editService",
  async (
    { id, serviceData }: { id: string; serviceData: FormData },
    { getState }
  ) => {
    const state = getState() as any;
    const token = state.auth.token;

    await axios.put(`${API_BASE_URL}/api/services/${id}`, serviceData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    const response = await axios.get(`${API_BASE_URL}/api/services`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return normalizeServices(response.data);
  }
);

// ✅ Remove a service
export const removeService = createAsyncThunk(
  "services/removeService",
  async (id: string, { getState }) => {
    const state = getState() as any;
    const token = state.auth.token;

    await axios.delete(`${API_BASE_URL}/api/services/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const response = await axios.get(`${API_BASE_URL}/api/services`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return normalizeServices(response.data);
  }
);

// ✅ Approve/Decline service (admin only)
export const updateServiceStatus = createAsyncThunk(
  "services/updateServiceStatus",
  async ({ id, status }: { id: string; status: string }, { getState }) => {
    const state = getState() as any;
    const token = state.auth.token;

    await axios.patch(
      `${API_BASE_URL}/api/services/${id}/status`,
      { status },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const response = await axios.get(`${API_BASE_URL}/api/services`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return normalizeServices(response.data);
  }
);

const servicesSlice = createSlice({
  name: "services",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ✅ Get Services
      .addCase(getServices.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getServices.fulfilled,
        (state, action: PayloadAction<ServiceType[]>) => {
          state.loading = false;
          state.services = normalizeServices(action.payload);
          state.serviceCount = state.services.length;
        }
      )
      .addCase(getServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch services";
      })

      // ✅ Get pending services
      .addCase(getPendingServices.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getPendingServices.fulfilled,
        (state, action: PayloadAction<ServiceType[]>) => {
          state.loading = false;
          state.pendingServices = action.payload;
        }
      )
      .addCase(getPendingServices.rejected, (state) => {
        state.loading = false;
      })

      // ✅ Get User Services
      .addCase(getUserServices.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getUserServices.fulfilled,
        (state, action: PayloadAction<ServiceType[]>) => {
          state.loading = false;
          state.services = normalizeServices(action.payload);
          state.serviceCount = state.services.length;
        }
      )
      .addCase(getUserServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch user services";
      })

      // ✅ Fetch Service Count
      .addCase(
        fetchServiceCount.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.serviceCount = action.payload;
        }
      )

      // ✅ Add Service
      .addCase(
        addService.fulfilled,
        (state, action: PayloadAction<ServiceType[]>) => {
          state.services = normalizeServices(action.payload);
          state.serviceCount = state.services.length;
        }
      )

      // ✅ Edit Service
      .addCase(
        editService.fulfilled,
        (state, action: PayloadAction<ServiceType[]>) => {
          state.services = normalizeServices(action.payload);
          state.serviceCount = state.services.length;
        }
      )

      // ✅ Remove Service
      .addCase(
        removeService.fulfilled,
        (state, action: PayloadAction<ServiceType[]>) => {
          state.services = normalizeServices(action.payload);
          state.serviceCount = state.services.length;
        }
      )

      // ✅ Approve/Decline Service
      .addCase(
        updateServiceStatus.fulfilled,
        (state, action: PayloadAction<ServiceType[]>) => {
          state.services = normalizeServices(action.payload);
          state.serviceCount = state.services.length;
        }
      );
  },
});

export default servicesSlice.reducer;

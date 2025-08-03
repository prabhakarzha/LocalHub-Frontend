import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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
  loading: boolean;
  error: string | null;
}

const initialState: ServiceState = {
  services: [],
  loading: false,
  error: null,
};

// Fetch all services
export const getServices = createAsyncThunk(
  "services/getServices",
  async () => {
    const res = await axios.get(`${API_BASE_URL}/api/services`);
    return res.data;
  }
);

// Add new service
export const addService = createAsyncThunk(
  "services/addService",
  async (serviceData: FormData) => {
    const res = await axios.post(`${API_BASE_URL}/api/services`, serviceData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  }
);

// Edit a service
export const editService = createAsyncThunk(
  "services/editService",
  async ({ id, serviceData }: { id: string; serviceData: FormData }) => {
    const res = await axios.put(
      `${API_BASE_URL}/api/services/${id}`,
      serviceData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return res.data;
  }
);

// Remove a service
export const removeService = createAsyncThunk(
  "services/removeService",
  async (id: string) => {
    await axios.delete(`${API_BASE_URL}/api/services/${id}`);
    return id;
  }
);

const servicesSlice = createSlice({
  name: "services",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch services
      .addCase(getServices.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getServices.fulfilled,
        (state, action: PayloadAction<ServiceType[]>) => {
          state.loading = false;
          state.services = action.payload;
        }
      )
      .addCase(getServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch services";
      })

      // Add service
      .addCase(
        addService.fulfilled,
        (state, action: PayloadAction<ServiceType>) => {
          state.services.push(action.payload);
        }
      )

      // Edit service
      .addCase(
        editService.fulfilled,
        (state, action: PayloadAction<ServiceType>) => {
          const index = state.services.findIndex(
            (s) => s._id === action.payload._id
          );
          if (index !== -1) {
            state.services[index] = action.payload;
          }
        }
      )

      // Remove service
      .addCase(
        removeService.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.services = state.services.filter(
            (s) => s._id !== action.payload
          );
        }
      );
  },
});

export default servicesSlice.reducer;

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

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
  status?: string;
  createdBy?: {
    name: string;
    email: string;
    _id?: string;
  };
  createdAt?: string;
  updatedAt?: string;
};

// ✅ Pagination type
export type PaginationType = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

interface ServiceState {
  services: ServiceType[];
  allServices: ServiceType[]; // For admin view
  pendingServices: ServiceType[];
  serviceCount: number;
  loading: boolean;
  error: string | null;
  pagination: PaginationType;
}

const initialState: ServiceState = {
  services: [],
  allServices: [],
  pendingServices: [],
  serviceCount: 0,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 1,
  },
};

// ✅ Fetch all services with pagination (protected) - for regular users and admin
export const getServices = createAsyncThunk(
  "services/getServices",
  async (
    { page = 1, limit = 6 }: { page?: number; limit?: number } = {},
    { getState },
  ) => {
    const state = getState() as any;
    const token = state.auth.token;

    const response = await axios.get(
      `${API_BASE_URL}/services?page=${page}&limit=${limit}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    // If the API returns paginated data
    if (response.data?.services && response.data?.pagination) {
      return response.data;
    }

    // Fallback for non-paginated response
    return {
      services: normalizeServices(response.data),
      pagination: {
        page,
        limit,
        total: response.data?.length || 0,
        totalPages: Math.ceil((response.data?.length || 0) / limit),
      },
    };
  },
);

// ✅ Fetch ALL services for admin (no filters) - with pagination support
export const getAllServices = createAsyncThunk(
  "services/getAllServices",
  async (
    { page = 1, limit = 1000 }: { page?: number; limit?: number } = {},
    { getState },
  ) => {
    const state = getState() as any;
    const token = state.auth.token;

    const response = await axios.get(
      `${API_BASE_URL}/services/all?page=${page}&limit=${limit}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (response.data?.services && response.data?.pagination) {
      return response.data;
    }

    return {
      services: normalizeServices(response.data),
      pagination: {
        page,
        limit,
        total: response.data?.length || 0,
        totalPages: Math.ceil((response.data?.length || 0) / limit),
      },
    };
  },
);

// ✅ Fetch pending services (admin only) - with pagination
export const getPendingServices = createAsyncThunk(
  "services/getPendingServices",
  async (
    { page = 1, limit = 10 }: { page?: number; limit?: number } = {},
    { getState },
  ) => {
    const state = getState() as any;
    const token = state.auth.token;

    const response = await axios.get(
      `${API_BASE_URL}/services/pending?page=${page}&limit=${limit}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (response.data?.services && response.data?.pagination) {
      return response.data;
    }

    return {
      services: normalizeServices(response.data),
      pagination: {
        page,
        limit,
        total: response.data?.length || 0,
        totalPages: Math.ceil((response.data?.length || 0) / limit),
      },
    };
  },
);

// ✅ Fetch services created by current user - with pagination
export const getUserServices = createAsyncThunk(
  "services/getUserServices",
  async (
    { page = 1, limit = 6 }: { page?: number; limit?: number } = {},
    { getState },
  ) => {
    const state = getState() as any;
    const token = state.auth.token;

    const response = await axios.get(
      `${API_BASE_URL}/services/user?page=${page}&limit=${limit}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (response.data?.services && response.data?.pagination) {
      return response.data;
    }

    return {
      services: normalizeServices(response.data),
      pagination: {
        page,
        limit,
        total: response.data?.length || 0,
        totalPages: Math.ceil((response.data?.length || 0) / limit),
      },
    };
  },
);

// ✅ Fetch service count (PUBLIC – no token)
export const fetchServiceCount = createAsyncThunk(
  "services/fetchServiceCount",
  async () => {
    const response = await axios.get(`${API_BASE_URL}/services/count`);
    return response.data.totalServices || 0;
  },
);

// ✅ Add new service
export const addService = createAsyncThunk(
  "services/addService",
  async (serviceData: FormData, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any;
      const token = state.auth.token;

      const response = await axios.post(
        `${API_BASE_URL}/services`,
        serviceData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // After adding, fetch the first page to show the new item
      const updatedResponse = await axios.get(
        `${API_BASE_URL}/services?page=1&limit=6`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (updatedResponse.data?.services && updatedResponse.data?.pagination) {
        return updatedResponse.data;
      }

      return {
        services: normalizeServices(updatedResponse.data),
        pagination: {
          page: 1,
          limit: 6,
          total: updatedResponse.data?.length || 0,
          totalPages: Math.ceil((updatedResponse.data?.length || 0) / 6),
        },
      };
    } catch (err: any) {
      console.error("Backend error object:", err);
      console.error("Backend response:", err.response);
      return rejectWithValue(err.response?.data || "Failed to create service");
    }
  },
);

// ✅ Edit a service
export const editService = createAsyncThunk(
  "services/editService",
  async (
    {
      id,
      serviceData,
      page = 1,
    }: { id: string; serviceData: FormData; page?: number },
    { getState },
  ) => {
    const state = getState() as any;
    const token = state.auth.token;

    await axios.put(`${API_BASE_URL}/services/${id}`, serviceData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    // After editing, fetch the current page
    const response = await axios.get(
      `${API_BASE_URL}/services?page=${page}&limit=6`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (response.data?.services && response.data?.pagination) {
      return response.data;
    }

    return {
      services: normalizeServices(response.data),
      pagination: {
        page,
        limit: 6,
        total: response.data?.length || 0,
        totalPages: Math.ceil((response.data?.length || 0) / 6),
      },
    };
  },
);

// ✅ Remove a service
export const removeService = createAsyncThunk(
  "services/removeService",
  async ({ id, page = 1 }: { id: string; page?: number }, { getState }) => {
    const state = getState() as any;
    const token = state.auth.token;

    await axios.delete(`${API_BASE_URL}/services/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // After removing, fetch the current page
    const response = await axios.get(
      `${API_BASE_URL}/services?page=${page}&limit=6`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (response.data?.services && response.data?.pagination) {
      return response.data;
    }

    return {
      services: normalizeServices(response.data),
      pagination: {
        page,
        limit: 6,
        total: response.data?.length || 0,
        totalPages: Math.ceil((response.data?.length || 0) / 6),
      },
    };
  },
);

// ✅ Approve/Decline service (admin only)
export const updateServiceStatus = createAsyncThunk(
  "services/updateServiceStatus",
  async (
    { id, status, page = 1 }: { id: string; status: string; page?: number },
    { getState },
  ) => {
    const state = getState() as any;
    const token = state.auth.token;

    await axios.patch(
      `${API_BASE_URL}/services/${id}/status`,
      { status },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    // After updating status, fetch the current page
    const response = await axios.get(
      `${API_BASE_URL}/services?page=${page}&limit=6`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (response.data?.services && response.data?.pagination) {
      return response.data;
    }

    return {
      services: normalizeServices(response.data),
      pagination: {
        page,
        limit: 6,
        total: response.data?.length || 0,
        totalPages: Math.ceil((response.data?.length || 0) / 6),
      },
    };
  },
);

const servicesSlice = createSlice({
  name: "services",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ✅ Get Services with pagination
      .addCase(getServices.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getServices.fulfilled,
        (
          state,
          action: PayloadAction<{
            services: ServiceType[];
            pagination: PaginationType;
          }>,
        ) => {
          state.loading = false;
          state.services = normalizeServices(action.payload.services);
          state.serviceCount =
            action.payload.pagination.total || state.services.length;
          state.pagination = action.payload.pagination;
        },
      )
      .addCase(getServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch services";
      })

      // ✅ Get All Services with pagination
      .addCase(getAllServices.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getAllServices.fulfilled,
        (
          state,
          action: PayloadAction<{
            services: ServiceType[];
            pagination: PaginationType;
          }>,
        ) => {
          state.loading = false;
          state.allServices = normalizeServices(action.payload.services);
          state.serviceCount =
            action.payload.pagination.total || state.allServices.length;
          state.pagination = action.payload.pagination;
          // Also update regular services for backward compatibility
          state.services = state.allServices;
        },
      )
      .addCase(getAllServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch all services";
      })

      // ✅ Get pending services with pagination
      .addCase(getPendingServices.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getPendingServices.fulfilled,
        (
          state,
          action: PayloadAction<{
            services: ServiceType[];
            pagination: PaginationType;
          }>,
        ) => {
          state.loading = false;
          state.pendingServices = normalizeServices(action.payload.services);
          state.pagination = action.payload.pagination;
        },
      )
      .addCase(getPendingServices.rejected, (state) => {
        state.loading = false;
      })

      // ✅ Get User Services with pagination
      .addCase(getUserServices.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getUserServices.fulfilled,
        (
          state,
          action: PayloadAction<{
            services: ServiceType[];
            pagination: PaginationType;
          }>,
        ) => {
          state.loading = false;
          state.services = normalizeServices(action.payload.services);
          state.serviceCount =
            action.payload.pagination.total || state.services.length;
          state.pagination = action.payload.pagination;
        },
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
        },
      )

      // ✅ Add Service
      .addCase(
        addService.fulfilled,
        (
          state,
          action: PayloadAction<{
            services: ServiceType[];
            pagination: PaginationType;
          }>,
        ) => {
          state.services = normalizeServices(action.payload.services);
          state.serviceCount =
            action.payload.pagination.total || state.services.length;
          state.pagination = action.payload.pagination;
        },
      )

      // ✅ Edit Service
      .addCase(
        editService.fulfilled,
        (
          state,
          action: PayloadAction<{
            services: ServiceType[];
            pagination: PaginationType;
          }>,
        ) => {
          state.services = normalizeServices(action.payload.services);
          state.serviceCount =
            action.payload.pagination.total || state.services.length;
          state.pagination = action.payload.pagination;
        },
      )

      // ✅ Remove Service
      .addCase(
        removeService.fulfilled,
        (
          state,
          action: PayloadAction<{
            services: ServiceType[];
            pagination: PaginationType;
          }>,
        ) => {
          state.services = normalizeServices(action.payload.services);
          state.serviceCount =
            action.payload.pagination.total || state.services.length;
          state.pagination = action.payload.pagination;
        },
      )

      // ✅ Approve/Decline Service
      .addCase(
        updateServiceStatus.fulfilled,
        (
          state,
          action: PayloadAction<{
            services: ServiceType[];
            pagination: PaginationType;
          }>,
        ) => {
          state.services = normalizeServices(action.payload.services);
          state.serviceCount =
            action.payload.pagination.total || state.services.length;
          state.pagination = action.payload.pagination;
        },
      );
  },
});

export default servicesSlice.reducer;

import {
  configureStore,
  combineReducers,
  EnhancedStore,
} from "@reduxjs/toolkit";
import authReducer, { AuthState } from "./slices/authSlice";
import { persistStore, persistReducer } from "redux-persist";
import { useDispatch } from "react-redux";

// ✅ Fix: Create a custom storage adapter for Next.js
const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
      return Promise.resolve();
    },
  };
};

// ✅ Use localStorage on client side, noop storage on server side
const storage =
  typeof window !== "undefined"
    ? require("redux-persist/lib/storage").default
    : createNoopStorage();

const persistConfig = {
  key: "root",
  storage, // Now works on both client and server
  whitelist: ["auth"], // Only persist auth, not events/services
};

// ✅ Define proper types
export interface User {
  _id: string;
  name: string;
  email: string;
  role?: string;
}

// ✅ Export AuthState type
export type { AuthState };

// Create a reducer manager for dynamic injection
export class ReducerManager {
  reducers: Record<string, any>;
  keys: string[];

  constructor(initialReducers: Record<string, any>) {
    this.reducers = { ...initialReducers };
    this.keys = Object.keys(initialReducers);
  }

  add(key: string, reducer: any) {
    if (!this.keys.includes(key)) {
      this.reducers[key] = reducer;
      this.keys.push(key);
      return true;
    }
    return false;
  }

  remove(key: string) {
    if (this.keys.includes(key)) {
      delete this.reducers[key];
      this.keys = this.keys.filter((k) => k !== key);
      return true;
    }
    return false;
  }

  getReducerMap() {
    return { ...this.reducers };
  }
}

// Initial reducers (only auth loads immediately)
const staticReducers = {
  auth: authReducer,
};

// Create reducer manager
export const reducerManager = new ReducerManager(staticReducers);

// Create root reducer with dynamic capability
const rootReducer = combineReducers(reducerManager.getReducerMap());

// Persisted reducer (only auth is persisted)
const persistedReducer = persistReducer(persistConfig, rootReducer);

// ✅ Define custom store type with reducerManager
interface ExtendedStore extends EnhancedStore {
  reducerManager: ReducerManager;
}

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
}) as ExtendedStore; // ✅ Cast to ExtendedStore

// Add dynamic reducer injection to store
store.reducerManager = reducerManager;

// ✅ Define RootState type properly
export type RootState = ReturnType<typeof store.getState> & {
  auth: AuthState;
};

export type AppDispatch = typeof store.dispatch;

// Typed dispatch hook
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Helper function to get fresh persistConfig with current storage
const getPersistConfig = () => ({
  key: "root",
  storage:
    typeof window !== "undefined"
      ? require("redux-persist/lib/storage").default
      : createNoopStorage(),
  whitelist: ["auth"],
});

// Lazy load functions for each slice
export const loadEventsReducer = async () => {
  if (!store.reducerManager.keys.includes("events")) {
    const eventsReducer = (await import("./slices/eventsSlice")).default;
    store.reducerManager.add("events", eventsReducer);
    store.replaceReducer(
      persistReducer(
        getPersistConfig(), // Use fresh config
        combineReducers(store.reducerManager.getReducerMap()),
      ),
    );
  }
};

export const loadServicesReducer = async () => {
  if (!store.reducerManager.keys.includes("services")) {
    const servicesReducer = (await import("./slices/servicesSlice")).default;
    store.reducerManager.add("services", servicesReducer);
    store.replaceReducer(
      persistReducer(
        getPersistConfig(),
        combineReducers(store.reducerManager.getReducerMap()),
      ),
    );
  }
};

export const loadBookingsReducer = async () => {
  if (!store.reducerManager.keys.includes("bookings")) {
    const bookingsReducer = (await import("./slices/bookingsSlice")).default;
    store.reducerManager.add("bookings", bookingsReducer);
    store.replaceReducer(
      persistReducer(
        getPersistConfig(),
        combineReducers(store.reducerManager.getReducerMap()),
      ),
    );
  }
};

export const loadServiceBookingsReducer = async () => {
  if (!store.reducerManager.keys.includes("servicebookings")) {
    const servicebookingsReducer = (
      await import("./slices/serviceBookingSlice")
    ).default;
    store.reducerManager.add("servicebookings", servicebookingsReducer);
    store.replaceReducer(
      persistReducer(
        getPersistConfig(),
        combineReducers(store.reducerManager.getReducerMap()),
      ),
    );
  }
};

export const loadUsersReducer = async () => {
  if (!store.reducerManager.keys.includes("users")) {
    const userReducer = (await import("./slices/userSlice")).default;
    store.reducerManager.add("users", userReducer);
    store.replaceReducer(
      persistReducer(
        getPersistConfig(),
        combineReducers(store.reducerManager.getReducerMap()),
      ),
    );
  }
};

export const loadDigestReducer = async () => {
  if (!store.reducerManager.keys.includes("digest")) {
    const digestReducer = (await import("./slices/dailyDigestSlice")).default;
    store.reducerManager.add("digest", digestReducer);
    store.replaceReducer(
      persistReducer(
        getPersistConfig(),
        combineReducers(store.reducerManager.getReducerMap()),
      ),
    );
  }
};

// Helper to load multiple reducers at once
export const loadReducers = async (reducerNames: string[]) => {
  const loadPromises = reducerNames.map(async (name) => {
    switch (name) {
      case "events":
        await loadEventsReducer();
        break;
      case "bookings":
        await loadBookingsReducer();
        break;
      case "services":
        await loadServicesReducer();
        break;
      case "servicebookings":
        await loadServiceBookingsReducer();
        break;
      case "users":
        await loadUsersReducer();
        break;
      case "digest":
        await loadDigestReducer();
        break;
      default:
        break;
    }
  });

  await Promise.all(loadPromises);
};

// ✅ Only create persistor on client side
export const persistor =
  typeof window !== "undefined" ? persistStore(store) : null;

export default store;

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import eventsReducer from "./slices/eventsSlice";
import authReducer from "./slices/authSlice";
import bookingsReducer from "./slices/bookingsSlice";
import servicesReducer from "./slices/servicesSlice"; // ✅ Added services slice
import servicebookingsReducer from "./slices/serviceBookingSlice";
import userReducer from "./slices/userSlice";
import digestReducer from "./slices/dailyDigestSlice";

import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import { useDispatch } from "react-redux";

// Persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  events: eventsReducer,
  bookings: bookingsReducer,
  services: servicesReducer,
  servicebookings: servicebookingsReducer, // ✅ Added here
  users: userReducer,
  digest: digestReducer, // ✅ Make sure this key exists
});

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed dispatch hook
export const useAppDispatch = () => useDispatch<AppDispatch>();

export const persistor = persistStore(store);
export default store;

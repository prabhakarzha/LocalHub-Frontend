import { configureStore, combineReducers } from "@reduxjs/toolkit";
import eventsReducer from "./slices/eventsSlice";
import authReducer from "./slices/authSlice";
import bookingsReducer from "./slices/bookingsSlice";

import storage from "redux-persist/lib/storage"; // localStorage use hoga
import { persistStore, persistReducer } from "redux-persist";

// Persist config (only auth persist for login)
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // Sirf auth persist hoga (login state ke liye)
};

// Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
  events: eventsReducer,
  bookings: bookingsReducer,
});

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // redux-persist ke warnings avoid karne ke liye
    }),
});

export const persistor = persistStore(store);
export default store;

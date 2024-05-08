import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import { leaderboardsReducer } from "./slices/leaderoards.slice";
export * from "./slices/leaderoards.slice";

export const store = configureStore({
  reducer: {
    leaderboards: leaderboardsReducer,
  },
  middleware: (getDefaultMiddleware) => {
    if (process.env.NODE_ENV === "development")
      return getDefaultMiddleware({
        serializableCheck: false,
      }).concat(logger as any);
    return getDefaultMiddleware({
      serializableCheck: false,
    });
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

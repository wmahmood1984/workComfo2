import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import notificationsReducer from "./slices/notificationsSlice";
import uiReducer from "./slices/uiSlice";
import gigsReducer from "./slices/gigsSlice";
import usersReducer from "./slices/usersSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notifications: notificationsReducer,
    ui: uiReducer,
     gigs: gigsReducer,
      users: usersReducer, // <-- Added
  },
});

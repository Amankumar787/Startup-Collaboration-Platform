import { configureStore } from "@reduxjs/toolkit";
import authReducer        from "./slices/authSlice.js";
import projectReducer     from "./slices/projectSlice.js";
import applicationReducer from "./slices/applicationSlice.js";

const store = configureStore({
  reducer: {
    auth:         authReducer,
    projects:     projectReducer,
    applications: applicationReducer,
  },
});

export default store;
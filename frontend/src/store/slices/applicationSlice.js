import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  applyToProjectApi,
  getMyApplicationsApi,
  getProjectApplicationsApi,
  updateApplicationStatusApi,
} from "../../api/applicationApi.js";

export const applyToProject = createAsyncThunk(
  "applications/apply",
  async ({ projectId, data }, { rejectWithValue }) => {
    try {
      const res = await applyToProjectApi(projectId, data);
      return res?.data?.data || res?.data || res;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to apply"
      );
    }
  }
);

export const fetchMyApplications = createAsyncThunk(
  "applications/fetchMy",
  async (query, { rejectWithValue }) => {
    try {
      const res = await getMyApplicationsApi(query);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch applications");
    }
  }
);

export const fetchProjectApplications = createAsyncThunk(
  "applications/fetchForProject",
  async (projectId, { rejectWithValue }) => {
    try {
      const res = await getProjectApplicationsApi(projectId);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch applications");
    }
  }
);

export const updateAppStatus = createAsyncThunk(
  "applications/updateStatus",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await updateApplicationStatusApi(id, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update status");
    }
  }
);

const applicationSlice = createSlice({
  name: "applications",
  initialState: {
    myApplications:      [],
    projectApplications: [],
    loading:             false,
    error:               null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyApplications.fulfilled, (state, action) => {
        state.myApplications = action.payload.applications;
      })
      .addCase(fetchProjectApplications.fulfilled, (state, action) => {
        const data = action.payload?.data?.data || action.payload?.data || action.payload;
        state.projectApplications = data?.applications || [];
      })
      .addCase(applyToProject.fulfilled, (state, action) => {
        state.myApplications.unshift(action.payload);
      })
      .addCase(updateAppStatus.fulfilled, (state, action) => {
        const updated = action.payload?.data?.data || action.payload?.data || action.payload;
        const idx = state.projectApplications.findIndex(
          (a) => a._id === updated._id
        );
        if (idx !== -1) state.projectApplications[idx] = updated;
      });
  },
});

export default applicationSlice.reducer;
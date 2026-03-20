import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getProjectsApi,
  getProjectByIdApi,
  createProjectApi,
//  updateProjectApi,
  deleteProjectApi,
} from "../../api/projectApi.js";

export const fetchProjects = createAsyncThunk(
  "projects/fetchAll",
  async (query, { rejectWithValue }) => {
    try {
      const res = await getProjectsApi(query);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch projects");
    }
  }
);

export const fetchProjectById = createAsyncThunk(
  "projects/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      const res = await getProjectByIdApi(id);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch project");
    }
  }
);

export const createProject = createAsyncThunk(
  "projects/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await createProjectApi(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create project");
    }
  }
);

export const deleteProject = createAsyncThunk(
  "projects/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteProjectApi(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete project");
    }
  }
);

const projectSlice = createSlice({
  name: "projects",
  initialState: {
    projects:   [],
    current:    null,
    pagination: null,
    loading:    false,
    error:      null,
  },
  reducers: {
    clearCurrent: (state) => { state.current = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending,   (state) => { state.loading = true; })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading    = false;
        const data       = action.payload?.data?.data || action.payload?.data || action.payload;
        state.projects   = data?.projects || [];
        state.pagination = data?.pagination || null;
      })
      .addCase(fetchProjects.rejected,  (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.current = action.payload?.data?.data || action.payload?.data || action.payload;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.unshift(action.payload);
      })

      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter((p) => p._id !== action.payload);
      });
  },
});

export const { clearCurrent } = projectSlice.actions;
export default projectSlice.reducer;
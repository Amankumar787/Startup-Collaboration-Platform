import axiosInstance from "./axiosInstance.js";

export const getProjectsApi = (params) =>
  axiosInstance.get("/projects", { params });

export const getProjectByIdApi = (id) =>
  axiosInstance.get(`/projects/${id}`);

export const createProjectApi = (data) =>
  axiosInstance.post("/projects", data);

export const updateProjectApi = (id, data) =>
  axiosInstance.put(`/projects/${id}`, data);

export const deleteProjectApi = (id) =>
  axiosInstance.delete(`/projects/${id}`);

export const getMyProjectsApi = () =>
  axiosInstance.get("/projects/founder/my");

export const uploadProjectCoverApi = (id, formData) =>
  axiosInstance.post(`/projects/${id}/cover`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
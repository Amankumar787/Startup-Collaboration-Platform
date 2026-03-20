import axiosInstance from "./axiosInstance.js";

export const applyToProjectApi = (projectId, data) =>
  axiosInstance.post(`/applications/project/${projectId}`, data);

export const getMyApplicationsApi = (params) =>
  axiosInstance.get("/applications/my", { params });

export const getProjectApplicationsApi = (projectId, params) =>
  axiosInstance.get(`/applications/project/${projectId}`, { params });

export const updateApplicationStatusApi = (id, data) =>
  axiosInstance.put(`/applications/${id}/status`, data);

export const withdrawApplicationApi = (id) =>
  axiosInstance.put(`/applications/${id}/withdraw`);
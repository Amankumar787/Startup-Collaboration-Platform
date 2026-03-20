import axiosInstance from "./axiosInstance.js";

export const getUserProfileApi = (id) =>
  axiosInstance.get(`/users/${id}`);

export const getDevelopersApi = (params) =>
  axiosInstance.get("/users/developers", { params });

export const updateProfileApi = (data) =>
  axiosInstance.put("/users/profile", data);

export const uploadAvatarApi = (formData) =>
  axiosInstance.post("/users/upload-avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
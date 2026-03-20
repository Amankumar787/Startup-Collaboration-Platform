import axiosInstance from "./axiosInstance.js";

export const getNotificationsApi = (params) =>
  axiosInstance.get("/notifications", { params });

export const markOneReadApi = (id) =>
  axiosInstance.put(`/notifications/${id}/read`);

export const markAllReadApi = () =>
  axiosInstance.put("/notifications/mark-all");

export const deleteNotificationApi = (id) =>
  axiosInstance.delete(`/notifications/${id}`);
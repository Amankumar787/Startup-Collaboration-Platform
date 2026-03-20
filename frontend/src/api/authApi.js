import axiosInstance from "./axiosInstance.js";

export const registerApi = (data) =>
  axiosInstance.post("/auth/register", data);

export const loginApi = (data) =>
  axiosInstance.post("/auth/login", data);

export const getMeApi = () =>
  axiosInstance.get("/auth/me");

export const logoutApi = () =>
  axiosInstance.post("/auth/logout");
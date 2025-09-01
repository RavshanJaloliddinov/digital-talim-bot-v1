import axios from "axios";
import { getToken } from "../utils/storage";

const API = axios.create({
  baseURL: "https://digital-talim-bot.onrender.com",
});

// Tokenni headerga qo‘shamiz
API.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getPurchasedCourses = async () => {
  const response = await API.get("/purchased-courses");
  return response.data.data;
};

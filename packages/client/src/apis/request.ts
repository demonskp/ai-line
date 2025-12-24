import axios from "axios";
import { useAccountStore } from "../store/account-store";
import type { IResult } from "../type";
import { message } from "antd";

const request = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 60 * 1000,
  headers: {
    "Content-Type": "application/json",
  },
});

request.interceptors.request.use((config) => {
  const accessToken = useAccountStore.getState().accessToken;
  if (accessToken) {
    config.headers.Authorization = `${accessToken}`;
  }
  return config;
});

// 业务错误
request.interceptors.response.use((response) => {
  const result = response.data;
  if (result.code !== 0) {
    message.error(result.message);
    throw new Error(result.message);
  }
  return response;
});

request.interceptors.response.use(async (response) => {
  const httpStatus = response.status;
  if (httpStatus === 401) {
    const newAccessToken = await useAccountStore
      .getState()
      .refreshToken()
      .catch(() => undefined);
    if (!newAccessToken) {
      window.location.href = "/login";
      throw new Error("Unauthorized");
    }
    const config = response.config;
    const result = await request(config);
    return result;
  }

  return response;
});

export async function get<T, D = unknown>(url: string, params?: D) {
  const res = await request.get<IResult<T>>(url, { params });
  const result = res.data;
  return result;
}

export async function post<T, D = unknown>(url: string, data?: D) {
  const res = await request.post<IResult<T>>(url, data);
  const result = res.data;
  return result;
}

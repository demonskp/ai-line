import axios from "axios";
import { useAccountStore } from "../store/account-store";
import type { IResult } from "../type";
import { message } from "antd";
import i18next from "i18next";

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

const ERROR_STATUS_MAP = {
  404: "not_found",
  401: "unauthorized",
  500: "internal_server_error",
  400: "bad_request",
};

request.interceptors.response.use(async (response) => {
  const httpCode = response.status;
  if (httpCode === 401) {
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

  if (httpCode !== 200) {
    let errMsg = "";
    switch (httpCode) {
      case 401:
        // 登录验证
        errMsg = `${httpCode}:${i18next.t("Networks.401")}`;
        break;
      case 404:
        errMsg = `${httpCode}:${i18next.t("Networks.404")}`;
        break;
      case 500:
      case 503:
        errMsg = `${httpCode}:${i18next.t("Networks.500+")}`;
        break;
      case 502:
      case 504:
        errMsg = `${httpCode}:${i18next.t("Networks.504|502")}`;
        break;
      default:
        errMsg = i18next.t("Networks.default");
        break;
    }
    if (errMsg) {
      message.error(errMsg);
    }
    throw new Error(response.data.message);
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

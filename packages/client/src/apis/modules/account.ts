import type { IUser } from "@/type";
import { get, post } from "../request";

export async function login(account: string, password: string) {
  const res = await post<{ token: string }>("/api/login", {
    account,
    password,
  });
  console.log(res);
  return res.data;
}

export async function refreshToken() {
  const res = await post<{ token: string }>("/api/refresh_token");
  return res.data;
}

export async function getMyInfo() {
  const res = await get<{ info: IUser; permissions: string[] }>("/api/me");
  return res.data;
}

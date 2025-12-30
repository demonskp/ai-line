import { create } from "zustand";
import { accountApi } from "../apis";
import type { IUser } from "@/type";

interface IAccountStore {
  accessToken?: string;
  account?: string;
  userInfo?: IUser;
  permissions?: string[];
  loginSuccess: (accessToken: string, account: string) => void;
  refreshToken: () => Promise<string>;
  logout: () => void;
  getMyInfo: () => Promise<void>;
}

let refreshPromise: Promise<{ token: string }> | undefined;

export const useAccountStore = create<IAccountStore>((set) => ({
  accessToken: undefined,
  account: undefined,
  loginSuccess: (accessToken, account) => {
    set({ accessToken, account });
  },
  logout: () => {
    set({ accessToken: undefined, account: undefined });
  },
  getMyInfo: async () => {
    const res = await accountApi.getMyInfo();
    set({ userInfo: res.info, permissions: res.permissions });
  },
  refreshToken: async () => {
    if (!refreshPromise) {
      refreshPromise = accountApi.refreshToken();
    }
    const res = await refreshPromise;
    set({ accessToken: res.token });
    refreshPromise = undefined;
    return res.token;
  },
}));

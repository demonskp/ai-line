import { create } from "zustand";
import { accountApi } from "../apis";

interface IAccountStore {
  accessToken?: string;
  account?: string;
  loginSuccess: (accessToken: string, account: string) => void;
  refreshToken: () => Promise<string>;
  logout: () => void;
}

let refreshPromise: Promise<{ accessToken: string }> | undefined;

export const useAccountStore = create<IAccountStore>((set) => ({
  accessToken: undefined,
  account: undefined,
  loginSuccess: (accessToken, account) => {
    set({ accessToken, account });
  },
  logout: () => {
    set({ accessToken: undefined, account: undefined });
  },
  refreshToken: async () => {
    if (!refreshPromise) {
      refreshPromise = accountApi.refreshToken();
    }
    const res = await refreshPromise;
    set({ accessToken: res.accessToken });
    refreshPromise = undefined;
    return res.accessToken;
  },
}));

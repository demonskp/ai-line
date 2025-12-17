import type { Router } from "express";
import { login, refreshToken } from "./login";
import { currentUserInfo, userList } from "./user";

export function loadUnLoginControllers(router: Router) {
  router.post("/api/login", login);
  router.post("/api/refresh_token", refreshToken);
}

export function loadLoginControllers(router: Router) {
  // 用户模块
  router.get("/user", userList);
  router.get("/me", currentUserInfo);
}

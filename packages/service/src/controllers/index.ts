import type { Router } from "express";
import { login } from "./login";
import { currentUserInfo, userList } from "./user";

export function loadUnLoginControllers(router: Router) {
  router.post("/api/login", login);
}

export function loadLoginControllers(router: Router) {
  // 用户模块
  router.get("/user", userList);
  router.get("/me", currentUserInfo);
}

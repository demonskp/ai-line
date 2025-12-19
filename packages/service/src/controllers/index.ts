import type { Router } from "express";
import { login, refreshToken } from "./login";
import { createAccount, currentUserInfo, userList } from "./user";
import { permissionsHelper } from "../helpers";

export function loadUnLoginControllers(router: Router) {
  router.post("/api/login", login);
  router.post("/api/refresh_token", refreshToken);
}

export function loadLoginControllers(router: Router) {
  // 用户模块
  router.get("/user", userList);
  router.get("/me", currentUserInfo);
  router.post(
    "/user/create",
    permissionsHelper.permissionCheck(
      permissionsHelper.AccountManager.CreateAccount
    ),
    createAccount
  );
}

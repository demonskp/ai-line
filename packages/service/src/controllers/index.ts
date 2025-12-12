import type { Router } from "express";
import { health, login } from "./login";

export function loadUnLoginControllers(router: Router) {
  router.post("/api/login", login);
}

export function loadLoginControllers(router: Router) {
  router.get("/health", health);
}

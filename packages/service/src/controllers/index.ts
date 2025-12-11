import type { Router } from "express";
import { validateUser } from "../services/user";
import { resultHelper } from "../helpers";

export function loadControllers(router: Router) {
  router.post("/login", async (req, res) => {
    const { name, password } = req.body;
    const user = await validateUser({ name, password }).catch(
      (err) => undefined
    );
    if (!user) {
      resultHelper.throwError(
        "用户名或密码错误",
        resultHelper.ERROR_CODE.LOGIN_ERROR
      );
    }
    res.json(resultHelper.success(user));
  });
}

import { NextFunction, Request, Response } from "express";
import { contextHelper, jwtHelper, resultHelper } from "../helpers";
import { permissionService, userService } from "../services";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token = req.headers["authorization"];
  if (Array.isArray(token)) {
    token = token[0];
  }
  if (!token) {
    resultHelper.throwError(
      req.t("unauthorized"),
      resultHelper.ERROR_CODE.TOKEN_ERROR
    );
  }
  const payload = jwtHelper.verifyToken(token);
  if (!payload) {
    resultHelper.throwError(
      req.t("unauthorized"),
      resultHelper.ERROR_CODE.TOKEN_ERROR
    );
  }
  const user = await userService.userInfo({ id: payload.id });
  if (!user) {
    resultHelper.throwError(
      req.t("unauthorized"),
      resultHelper.ERROR_CODE.TOKEN_ERROR
    );
  }
  req.user = user;
  contextHelper.set("user", user);

  const permissions = await permissionService.getPermissionsByUserId(user.id);
  req.permissions = permissions.map((p) => p.id);
  next();
};

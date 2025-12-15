import { NextFunction, Request, Response } from "express";
import { contextHelper, jwtHelper, resultHelper } from "../helpers";
import { userService } from "../services";

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
    resultHelper.throwError("未授权", resultHelper.ERROR_CODE.TOKEN_ERROR);
  }
  const payload = jwtHelper.verifyToken(token);
  const user = await userService.userInfo({ id: payload.id });
  if (!user) {
    resultHelper.throwError("未授权", resultHelper.ERROR_CODE.TOKEN_ERROR);
  }
  req.user = user;
  contextHelper.set("user", user);
  next();
};

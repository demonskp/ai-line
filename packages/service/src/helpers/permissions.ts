import { resultHelper } from ".";
import { IMiddleware } from "../type";

export const permissionCheck = (code: string) => {
  const middleware: IMiddleware = async (req, res, next) => {
    const permissions = req.permissions;
    if (!permissions) {
      resultHelper.throwError(req.t("unauthorized"));
    }
    const permission = permissions.find((p) => p.id === code);
    if (!permission) {
      resultHelper.throwError(req.t("unauthorized"));
    }
    next();
  };

  return middleware;
};

// 账号管理
export const AccountManager = {
  CreateAccount: "user_create",
};

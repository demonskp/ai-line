import { Request, Response } from "express";
import { userService } from "../services";
import { encryptHelper, jwtHelper, resultHelper } from "../helpers";

export async function login(req: Request, res: Response) {
  const { account, password } = req.body;
  const user = await userService
    .validateUser(account)
    .catch((err) => undefined);
  if (!user) {
    resultHelper.throwError(
      "用户名或密码错误",
      resultHelper.ERROR_CODE.LOGIN_ERROR
    );
  }
  const isPasswordValid = await encryptHelper.comparePassword(
    password,
    user.password
  );
  if (!isPasswordValid) {
    resultHelper.throwError(
      "用户名或密码错误",
      resultHelper.ERROR_CODE.LOGIN_ERROR
    );
  }
  res.json(
    resultHelper.success({
      user: { name: user.name, account: user.account, email: user.email },
      token: jwtHelper.signToken({ id: user.id, account: user.account }),
    })
  );
}

export async function health(req: Request, res: Response) {
  res.json(resultHelper.success({ message: "ok" }));
}

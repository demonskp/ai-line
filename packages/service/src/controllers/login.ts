import { Request, Response } from "express";
import { userService } from "../services";
import { encryptHelper, jwtHelper, resultHelper } from "../helpers";
import { validate, zod } from "../helpers/validate";

const loginSchema = zod
  .object({
    account: zod.string(),
    password: zod.string(),
  })
  .required();

export async function login(req: Request, res: Response) {
  const { account, password } = validate(loginSchema, req.body);

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

import { Request, Response } from "express";
import { userService } from "../services";
import { encryptHelper, jwtHelper, resultHelper } from "../helpers";
import { validate, zod } from "../helpers/validate";

const REFRESH_TOKEN_COOKIE_NAME = "refresh_token";
const REFRESH_TOKEN_MAX_AGE = 1000 * 60 * 60 * 24 * 30;
const REFRESH_JWT_TOKEN_MAX_AGE = "7d";
const JWT_TOKEN_MAX_AGE = "1h";

const loginSchema = zod
  .object({
    account: zod.string(),
    password: zod.string(),
  })
  .required();

export async function login(req: Request, res: Response) {
  const { account, password } = validate(loginSchema, req.body);

  const dncryptedPassword = encryptHelper.decryptWithPrivateKey(password);

  const user = await userService
    .validateUser(account)
    .catch((err) => undefined);

  if (!user) {
    resultHelper.throwError(
      req.t("account_or_password_error"),
      resultHelper.ERROR_CODE.LOGIN_ERROR
    );
  }
  const isPasswordValid = await encryptHelper.comparePassword(
    dncryptedPassword,
    user.password
  );
  if (!isPasswordValid) {
    resultHelper.throwError(
      req.t("account_or_password_error"),
      resultHelper.ERROR_CODE.LOGIN_ERROR
    );
  }
  res.cookie(
    "refresh_token",
    jwtHelper.signToken({ id: user.id, account: user.account }),
    {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      maxAge: REFRESH_TOKEN_MAX_AGE,
      path: "/api/refresh_token",
    }
  );
  res.json(
    resultHelper.success({
      user: { name: user.name, account: user.account, email: user.email },
      token: jwtHelper.signToken(
        {
          id: user.id,
          account: user.account,
        },
        { expiresIn: JWT_TOKEN_MAX_AGE }
      ),
    })
  );
}

export async function refreshToken(req: Request, res: Response) {
  const refreshToken = req.cookies.refresh_token;
  if (!refreshToken) {
    resultHelper.throwError(req.t("refresh_token_not_found"));
  }
  const decoded = jwtHelper.verifyToken(refreshToken);
  if (!decoded) {
    resultHelper.throwError(req.t("refresh_token_invalid"));
  }
  const user = await userService.userInfo({ id: decoded.id });
  if (!user) {
    resultHelper.throwError(req.t("user_not_found"));
  }
  res.cookie(
    REFRESH_TOKEN_COOKIE_NAME,
    jwtHelper.signToken(
      {
        id: user.id,
        account: user.account,
      },
      { expiresIn: REFRESH_JWT_TOKEN_MAX_AGE }
    ),
    {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      maxAge: REFRESH_TOKEN_MAX_AGE,
      path: "/api/refresh_token",
    }
  );
  res.json(
    resultHelper.success({
      user: { name: user.name, account: user.account, email: user.email },
      token: jwtHelper.signToken(
        {
          id: user.id,
          account: user.account,
        },
        { expiresIn: JWT_TOKEN_MAX_AGE }
      ),
    })
  );
}

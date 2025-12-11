import { Request, Response, NextFunction } from "express";
import { IResult } from "../type";
import { ERROR_CODE } from "../helpers/result";

/**
 * 判断是否为自定义错误（由 throwError 抛出）
 */
const isCustomError = (err: unknown): err is IResult<unknown> => {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    "message" in err &&
    typeof (err as IResult<unknown>).code === "number" &&
    typeof (err as IResult<unknown>).message === "string"
  );
};

/**
 * 根据错误码获取 HTTP 状态码
 */
const getHttpStatus = (code: number): number => {
  switch (code) {
    case ERROR_CODE.LOGIN_ERROR:
    case ERROR_CODE.TOKEN_ERROR:
      return 401;
    default:
      return 400;
  }
};

/**
 * 兜底错误处理中间件 - 捕获所有未处理的错误
 */
export const errorMiddleware = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // 处理自定义错误（由 throwError 抛出）
  if (isCustomError(err)) {
    const result: IResult<null> = {
      code: err.code,
      message: err.message,
      data: null,
    };
    res.status(getHttpStatus(err.code)).json(result);
    return;
  }

  // 处理标准 Error 对象
  if (err instanceof Error) {
    console.error("[Error]", err.stack || err.message);
    const result: IResult<null> = {
      code: ERROR_CODE.COMMON_ERROR,
      message: err.message || "服务器内部错误",
      data: null,
    };
    res.status(500).json(result);
    return;
  }

  // 处理未知错误
  console.error("[Unknown Error]", err);
  const result: IResult<null> = {
    code: ERROR_CODE.COMMON_ERROR,
    message: "服务器内部错误",
    data: null,
  };
  res.status(500).json(result);
};

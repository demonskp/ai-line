import { IResult } from "../type";

export const ERROR_CODE = {
  SUCCESS: 0,
  COMMON_ERROR: 10001, // 通用错误
  LOGIN_ERROR: 10002, // 登录错误
  TOKEN_ERROR: 10003, // 令牌错误
};

export function success<T>(data: T): IResult<T> {
  return {
    code: ERROR_CODE.SUCCESS,
    data,
  };
}

export function throwError(
  message: string,
  code: number = ERROR_CODE.COMMON_ERROR
): never {
  throw {
    code,
    message,
  };
}

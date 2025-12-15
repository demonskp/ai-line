import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";
import { ERROR_CODE, throwError } from "../helpers/result";

export default function validate(
  schema: ZodObject,
  type: "body" | "query" | "params"
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[type]);

    if (!result.success) {
      throwError(result.error.message, ERROR_CODE.VALIDATION_ERROR);
    }
    next();
  };
}

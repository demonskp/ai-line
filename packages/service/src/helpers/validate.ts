import { z } from "zod";
import { ERROR_CODE, throwError } from "./result";

export const zod = z;

export function validate<T>(schema: z.ZodType<T>, value: unknown): T {
  const result = schema.safeParse(value);
  if (!result.success) {
    throwError(
      `${result.error.issues[0].path.join(".")}: ${
        result.error.issues[0].message
      }`,
      ERROR_CODE.VALIDATION_ERROR
    );
  }
  return result.data;
}

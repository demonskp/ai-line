import { randomUUID } from "crypto";
import { contextHelper } from "../helpers";
import { IMiddleware } from "../type";

export const contextMiddleware: IMiddleware = (req, res, next) => {
  contextHelper.run(
    {
      requestId: req.headers["x-request-id"]?.toString() || randomUUID(),
      local: req.headers["locale"]?.toString() || "en-US",
    },
    () => {
      next();
    }
  );
};

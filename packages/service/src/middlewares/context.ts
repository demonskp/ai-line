import { randomUUID } from "crypto";
import { contextHelper } from "../helpers";
import { IMiddleware } from "../type";
import i18next, { TOptions } from "i18next";

export const contextMiddleware: IMiddleware = (req, res, next) => {
  const local = req.headers["locale"]?.toString() || "en";

  const t = (key: string, options?: TOptions) =>
    i18next.t(key, { lng: local, ...options });

  contextHelper.run(
    {
      requestId: req.headers["x-request-id"]?.toString() || randomUUID(),
      local,
      t,
    },
    () => {
      req.t = t;
      next();
    }
  );
};

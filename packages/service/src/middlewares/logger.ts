import { Request, Response, NextFunction } from "express";
import { contextHelper } from "../helpers";
import pino from "pino";

const destination = pino.destination({
  dest: "logs/app.log",
  sync: true,
  mkdir: true,
});

const loggerRoot = pino(
  process.env.NODE_ENV === "production" ? destination : undefined
);

/**
 * 日志中间件 - 记录 HTTP 请求信息
 */
export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const startTime = Date.now();

  // 请求信息
  const method = req.method;
  const url = req.originalUrl || req.url || "unknown";
  const path = req.path || "unknown";
  const requestId = contextHelper.get("requestId");

  const pathLogger = loggerRoot.child({
    requestId,
    method,
    path,
  });

  req.logger = pathLogger;
  contextHelper.set("logger", pathLogger);

  // 响应完成后记录日志
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;
    const statusColor = getStatusColor(statusCode);

    pathLogger.info(
      `url: ${url}, duration: ${duration}ms,  ${statusColor}status: ${statusCode}\x1b[0m`
    );
  });

  next();
};

/**
 * 根据状态码返回对应的颜色代码
 */
const getStatusColor = (statusCode: number): string => {
  if (statusCode >= 500) return "\x1b[31m"; // 红色 - 服务器错误
  if (statusCode >= 400) return "\x1b[33m"; // 黄色 - 客户端错误
  if (statusCode >= 300) return "\x1b[36m"; // 青色 - 重定向
  if (statusCode >= 200) return "\x1b[32m"; // 绿色 - 成功
  return "\x1b[0m"; // 默认
};

export default loggerMiddleware;

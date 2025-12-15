import { Request, Response, NextFunction } from "express";
import { contextHelper } from "../helpers";

/**
 * 日志中间件 - 记录 HTTP 请求信息
 */
export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();

  // 请求信息
  const method = req.method;
  const url = req.originalUrl || req.url;
  const requestId = contextHelper.get("requestId");

  // 响应完成后记录日志
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;
    const statusColor = getStatusColor(statusCode);

    console.log(
      `[${timestamp}] [${requestId}] ${statusColor}${method} ${url} ${statusCode}\x1b[0m - ${duration}ms`
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

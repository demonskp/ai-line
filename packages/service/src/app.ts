import express, { Express, Request, Response } from "express";
import cors from "cors";
import { loggerMiddleware } from "./middlewares/logger";
import { authMiddleware } from "./middlewares/auth";
import { errorMiddleware } from "./middlewares/error";
import { loadControllers } from "./controllers";

const app: Express = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);

// 健康检查接口
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

const authRouter = express.Router();
authRouter.use(authMiddleware);

authRouter.get("/", (req, res) => {
  res.json({ message: "Welcome to AI Line Service!" });
});

loadControllers(authRouter);

// 根路由
app.use("/api", authRouter);

// 错误处理中间件（必须放在所有路由之后）
app.use(errorMiddleware);

export default app;

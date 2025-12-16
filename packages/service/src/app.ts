import express, { Express, Request, Response } from "express";
import cors from "cors";
import { loggerMiddleware } from "./middlewares/logger";
import { authMiddleware } from "./middlewares/auth";
import { errorMiddleware } from "./middlewares/error";
import { loadLoginControllers, loadUnLoginControllers } from "./controllers";
import { contextMiddleware } from "./middlewares/context";
import i18next from "i18next";

const app: Express = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(contextMiddleware);
app.use(loggerMiddleware);

const authRouter = express.Router();
authRouter.use(authMiddleware);

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    message: req.t("hello"),
  });
});

// 不鉴权
loadUnLoginControllers(app);
// 鉴权
loadLoginControllers(authRouter);

// 根路由
app.use("/api", authRouter);

// 错误处理中间件（必须放在所有路由之后）
app.use(errorMiddleware);

export default app;

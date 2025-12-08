import express, { Express, Request, Response } from 'express';
import cors from 'cors';

const app: Express = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 健康检查接口
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 根路由
app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Welcome to AI Line Service!' });
});

export default app;


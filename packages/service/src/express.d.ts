import "express";

declare global {
  namespace Express {
    interface Request {
      token?: string;
      requestId?: string;
      user?: User;
      [key: string]: any;
    }
  }
}

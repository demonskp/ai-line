import { RowDataPacket } from "mysql2";
import { NextFunction, Request, Response } from "express";
import { TOptions } from "i18next";

export interface User extends RowDataPacket {
  id: string;
  name: string;
  account: string;
  email?: string;
  // password: string;
  create_time: Date;
  update_time?: Date;
  pw_changed?: boolean;
}

export interface IResult<T> {
  code: number;
  message?: string;
  data: T;
}

export interface IPagerDatas<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface IContext {
  requestId: string;
  user?: User;
  local?: string;
  t: (key: string, options?: TOptions) => string;
}

export interface Pager {
  page?: number;
  pageSize?: number;
}

export type IController = (req: Request, res: Response) => Promise<void> | void;
export type IMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

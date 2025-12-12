import { RowDataPacket } from "mysql2";

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

export interface Pager {
  page?: number;
  pageSize?: number;
}

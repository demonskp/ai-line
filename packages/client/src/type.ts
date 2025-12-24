export interface IUser {
  id: string;
  name: string;
  account: string;
  email?: string;
}

export interface IResult<T> {
  code: number;
  message?: string;
  data: T;
}

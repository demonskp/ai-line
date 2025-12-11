export interface User {
  id: string;
  name: string;
  email?: string;
  password: string;
  create_time: Date;
  update_time?: Date;
  pw_changed?: boolean;
}

export interface IResult<T> {
  code: number;
  message?: string;
  data: T;
}

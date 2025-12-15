import { randomUUID } from "crypto";
import { RowDataPacket } from "mysql2";
import { databaseHelper, encryptHelper, resultHelper } from "../helpers";
import { IPagerDatas, Pager, User } from "../type";

export async function validateUser(account: string) {
  const userData = await databaseHelper.queryOne<User & { password: string }>(
    "SELECT id, name, account, email, password, create_time, update_time, pw_changed FROM users WHERE account = ?",
    [account]
  );
  return userData ?? undefined;
}

export async function userInfo(
  params: Partial<Pick<User, "account" | "email" | "id">>
) {
  const result = await getUserList(params, { page: 1, pageSize: 1 });

  return result.list[0] ?? undefined;
}

export async function createUser(user: Omit<User, "id">) {
  const { name, password, email, account } = user;
  const userData = await databaseHelper.queryOne<User>(
    "SELECT id, name, email, create_time, update_time, pw_changed FROM users WHERE name = ?",
    [name]
  );
  if (userData) {
    resultHelper.throwError("用户已存在");
  }
  const id = randomUUID();
  const encryptedPassword = await encryptHelper.hashPassword(password);
  const insertId = await databaseHelper.insert(
    "INSERT INTO users (id, name, account, email, password, create_time, update_time, pw_changed) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [id, name, account, email, encryptedPassword, new Date(), new Date(), false]
  );

  return insertId;
}

export async function getUserList(
  params: Partial<Pick<User, "id" | "name" | "account" | "email">>,
  pager: Pager
): Promise<IPagerDatas<User>> {
  const { id, name, account, email } = params;
  const { page = 1, pageSize = 10 } = pager;

  const offset = (page - 1) * pageSize;

  // 构建查询条件
  const conditions: string[] = [];
  const queryParams: any[] = [];

  if (id) {
    conditions.push("id = ?");
    queryParams.push(id);
  }
  if (name) {
    conditions.push("name LIKE ?");
    queryParams.push(`%${name}%`);
  }
  if (account) {
    conditions.push("account LIKE ?");
    queryParams.push(`%${account}%`);
  }
  if (email) {
    conditions.push("email LIKE ?");
    queryParams.push(`%${email}%`);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  // 查询总数
  const countResult = await databaseHelper.queryOne<
    { total: number } & RowDataPacket
  >(`SELECT COUNT(*) as total FROM users ${whereClause}`, queryParams);
  const total = countResult?.total || 0;

  // 查询列表数据
  const list = await databaseHelper.query<User[]>(
    `SELECT id, name, account, email, create_time, update_time, pw_changed FROM users ${whereClause} ORDER BY create_time DESC LIMIT ? OFFSET ?`,
    [...queryParams, pageSize, offset]
  );

  return {
    list,
    total,
    page,
    pageSize,
  };
}

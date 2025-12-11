import { databaseHelper } from "../helpers";
import { User } from "../type";

export async function validateUser(user: Pick<User, "name" | "password">) {
  const { name, password } = user;
  const userData = await databaseHelper.queryOne(
    "SELECT id, name, email, create_time, update_time, pw_changed FROM users WHERE name = ? AND password = ?",
    [name, password]
  );
  return userData ?? undefined;
}

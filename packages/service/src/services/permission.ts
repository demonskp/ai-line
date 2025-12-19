import { databaseHelper } from "../helpers";
import { Permission } from "../type";

export async function getPermissionsByUserId(userId: string) {
  const sql = `select p.id, p.name,p.desc,p.parent_id from user_role ur
LEFT JOIN role_permission rp ON rp.role_id = ur.role_id and rp.delete_time IS NULL 
LEFT JOIN permissions p ON rp.permission_id = p.id  and p.delete_time IS NULL 
WHERE ur.user_id = ? and ur.delete_time IS NULL;`;

  const list = await databaseHelper.query<Permission[]>(sql, [userId]);
  return list;
}

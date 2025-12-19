import { IController } from "../type";
import { userService } from "../services";
import { contextHelper, encryptHelper, resultHelper } from "../helpers";
import { validate, zod } from "../helpers/validate";

const listSchema = zod.object({
  page: zod.number().min(1).default(1),
  pageSize: zod.number().min(1).default(10),
  id: zod.string().optional(),
  name: zod.string().optional(),
  account: zod.string().optional(),
});

export const userList: IController = async (req, res) => {
  const data = validate(listSchema, req.query);

  const userListData = await userService.getUserList(data, {
    page: data.page,
    pageSize: data.pageSize,
  });
  res.json(resultHelper.success(userListData));
};

export const currentUserInfo: IController = async (req, res) => {
  res.json(
    resultHelper.success({ info: req.user, permissions: req.permissions })
  );
};

const createAccountSchema = zod
  .object({
    name: zod.string(),
    account: zod.string(),
    password: zod.string(),
    email: zod.string(),
    role_ids: zod.array(zod.string()),
  })
  .required({
    name: true,
    account: true,
    password: true,
    email: true,
  });

export const createAccount: IController = async (req, res) => {
  const data = validate(createAccountSchema, req.body);

  // 解密
  const decryptedPassword = encryptHelper.decryptWithPrivateKey(data.password);
  if (!decryptedPassword) {
    resultHelper.throwError(req.t("password_decrypt_failed"));
  }
  await userService.createUser(
    {
      ...data,
      password: decryptedPassword,
    },
    data.role_ids
  );
  res.json(resultHelper.success({}));
};

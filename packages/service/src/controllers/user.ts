import { IController } from "../type";
import { userService } from "../services";
import { contextHelper, resultHelper } from "../helpers";
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
  res.json(resultHelper.success({ info: req.user }));
};

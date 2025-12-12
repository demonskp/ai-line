import "dotenv/config";
// import "./express.d";
import app from "./app";
import { databaseHelper } from "./helpers";
import { createUser, getUserList } from "./services/user";

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  // 测试连接
  await databaseHelper.connectTest();

  // 查询是否存在admin用户
  const userList = await getUserList(
    { name: "admin" },
    { page: 1, pageSize: 1 }
  );
  if (userList.total === 0) {
    await createUser({
      name: "admin",
      password: "admin",
      email: "admin@example.com",
      account: "admin",
    });
    console.log("admin create success");
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
}

bootstrap();

import "dotenv/config";
// import "./express.d";
import app from "./app";
import { databaseHelper } from "./helpers";

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  await databaseHelper.connectTest();

  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
}

bootstrap();

import { generateKeyPairSync } from "crypto";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 生成 RSA 密钥对
const { publicKey, privateKey } = generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: "spki",
    format: "pem",
  },
  privateKeyEncoding: {
    type: "pkcs8",
    format: "pem",
  },
});

import { existsSync, readFileSync } from "fs";

// 检查并写入环境变量的辅助函数
function writeEnvVariable(envPath, key, value) {
  let content = "";

  // 如果文件存在，读取现有内容
  if (existsSync(envPath)) {
    content = readFileSync(envPath, "utf-8");

    // 检查是否已存在相同的 key
    const keyPattern = new RegExp(`^${key}=`, "m");
    if (keyPattern.test(content)) {
      throw new Error(`错误: ${key} 已存在于 ${envPath}`);
    }

    // 如果内容不为空且不以换行结尾，添加换行
    if (content.length > 0 && !content.endsWith("\n")) {
      content += "\n";
    }
  }

  // 追加新的键值对
  content += `${key}="${value}"\n`;
  writeFileSync(envPath, content);
}

// 保存公钥到 client/.env
const clientEnvPath = join(__dirname, "../packages/client/.env");
const publicKeyFormatted = publicKey.replace(/\n/g, "\\n");
writeEnvVariable(clientEnvPath, "VITE_PUBLIC_KEY", publicKeyFormatted);
console.log("公钥已写入:", clientEnvPath);

// 保存私钥到 service/.env
const serviceEnvPath = join(__dirname, "../packages/service/.env");
const privateKeyFormatted = privateKey.replace(/\n/g, "\\n");
writeEnvVariable(serviceEnvPath, "PRIVATE_KEY", privateKeyFormatted);
console.log("私钥已写入:", serviceEnvPath);

console.log("\n密钥对生成成功！");

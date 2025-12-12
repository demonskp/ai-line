import bcrypt from "bcrypt";
import crypto from "crypto";

// ==================== 加密密钥配置 ====================
const CRYPTO_SECRET_KEY = process.env.CRYPTO_SECRET_KEY; // 必须是32字节
const CRYPTO_ALGORITHM = "aes-256-gcm";
const BCRYPT_SALT_ROUNDS = 10;

// ==================== Bcrypt 不可逆加密 ====================

/**
 * 使用 bcrypt 对密码进行不可逆加密
 * @param password 原始密码
 * @returns 加密后的哈希值
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
  return bcrypt.hash(password, salt);
}

/**
 * 验证密码是否与哈希值匹配
 * @param password 原始密码
 * @param hashedPassword 加密后的哈希值
 * @returns 是否匹配
 */
export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// ==================== Crypto 可逆加密 ====================

/**
 * 使用 AES-256-GCM 对数据进行可逆加密
 * @param text 要加密的明文
 * @returns 加密后的字符串 (格式: iv:authTag:encryptedData)
 */
export function encrypt(text: string): string {
  // 生成随机初始化向量
  const iv = crypto.randomBytes(16);

  // 确保密钥是32字节
  const key = crypto.scryptSync(CRYPTO_SECRET_KEY, "salt", 32);

  // 创建加密器
  const cipher = crypto.createCipheriv(CRYPTO_ALGORITHM, key, iv);

  // 加密数据
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  // 获取认证标签
  const authTag = cipher.getAuthTag();

  // 返回格式: iv:authTag:encryptedData
  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
}

/**
 * 使用 AES-256-GCM 对数据进行解密
 * @param encryptedText 加密后的字符串 (格式: iv:authTag:encryptedData)
 * @returns 解密后的明文
 */
export function decrypt(encryptedText: string): string {
  // 解析加密字符串
  const [ivHex, authTagHex, encrypted] = encryptedText.split(":");

  if (!ivHex || !authTagHex || !encrypted) {
    throw new Error("无效的加密数据格式");
  }

  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");

  // 确保密钥是32字节
  const key = crypto.scryptSync(CRYPTO_SECRET_KEY, "salt", 32);

  // 创建解密器
  const decipher = crypto.createDecipheriv(CRYPTO_ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  // 解密数据
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

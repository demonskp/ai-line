import jwt, { JwtPayload, SignOptions, VerifyOptions } from "jsonwebtoken";

// 从环境变量获取密钥，默认值仅用于开发环境
const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN: string | number = process.env.JWT_EXPIRES_IN || "7d";

/**
 * JWT Payload 接口
 */
export interface TokenPayload extends JwtPayload {
  userId: number;
  username?: string;
}

/**
 * 生成 JWT Token
 * @param payload - 要编码的数据
 * @param options - 可选的签名配置
 * @returns 生成的 JWT token 字符串
 */
export function signToken(
  payload: Omit<TokenPayload, "iat" | "exp">,
  options?: SignOptions
): string {
  const signOptions: SignOptions = {
    expiresIn: JWT_EXPIRES_IN as SignOptions["expiresIn"],
    ...options,
  };

  return jwt.sign(payload, JWT_SECRET, signOptions);
}

/**
 * 验证并解析 JWT Token
 * @param token - 要验证的 JWT token
 * @param options - 可选的验证配置
 * @returns 解析后的 payload 数据
 * @throws 如果 token 无效或过期，将抛出错误
 */
export function verifyToken(
  token: string,
  options?: VerifyOptions
): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET, options) as TokenPayload;
  } catch (error) {
    return null;
  }
}

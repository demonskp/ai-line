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

/**
 * 解析 JWT Token（不验证签名）
 * 注意：此方法不验证 token 的有效性，仅用于读取 payload
 * @param token - 要解析的 JWT token
 * @returns 解析后的 payload 数据，如果解析失败返回 null
 */
export function decodeToken(token: string): TokenPayload | null {
  const decoded = jwt.decode(token);
  if (decoded && typeof decoded === "object") {
    return decoded as TokenPayload;
  }
  return null;
}

/**
 * 安全验证 Token，返回结果对象而非抛出异常
 * @param token - 要验证的 JWT token
 * @returns 包含验证结果的对象
 */
export function safeVerifyToken(token: string): {
  valid: boolean;
  payload?: TokenPayload;
  error?: string;
} {
  try {
    const payload = verifyToken(token);
    return { valid: true, payload };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return { valid: false, error: errorMessage };
  }
}

/**
 * 检查 Token 是否过期
 * @param token - 要检查的 JWT token
 * @returns 如果过期返回 true，否则返回 false
 */
export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  const exp = decoded?.exp;
  if (!decoded || !exp) {
    return true;
  }
  // exp 是以秒为单位的时间戳
  return exp * 1000 < Date.now();
}

/**
 * 刷新 Token（生成一个新的 token，保留原有 payload）
 * @param token - 原有的 JWT token
 * @param options - 可选的签名配置
 * @returns 新的 JWT token，如果原 token 无效返回 null
 */
export function refreshToken(
  token: string,
  options?: SignOptions
): string | null {
  const decoded = decodeToken(token);
  if (!decoded) {
    return null;
  }

  // 提取自定义 payload，排除 jwt 标准字段
  const { userId, username } = decoded;

  return signToken({ userId, username }, options);
}

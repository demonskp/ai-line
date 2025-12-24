// ==================== RSA 公钥加密配置 ====================
const PUBLIC_KEY = import.meta.env.VITE_PUBLIC_KEY || "";

/**
 * 将 PEM 格式的公钥转换为 ArrayBuffer
 */
function pemToArrayBuffer(pem: string): ArrayBuffer {
  // 移除 PEM 头尾和换行符
  const base64 = pem
    .replace(/-----BEGIN PUBLIC KEY-----/, "")
    .replace(/-----END PUBLIC KEY-----/, "")
    .replace(/\s/g, "");

  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * 使用公钥对数据进行加密 (使用 RSA-OAEP + SHA-256，与 Node.js crypto 模块保持一致)
 * @param text 要加密的明文
 * @returns 加密后的 base64 字符串
 */
export async function encryptWithPublicKey(text: string): Promise<string> {
  try {
    // 将 PEM 公钥转换为 CryptoKey
    const keyBuffer = pemToArrayBuffer(PUBLIC_KEY);
    const publicKey = await crypto.subtle.importKey(
      "spki",
      keyBuffer,
      {
        name: "RSA-OAEP",
        hash: "SHA-256",
      },
      false,
      ["encrypt"]
    );

    // 将明文转换为 ArrayBuffer
    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    // 使用 RSA-OAEP 加密
    const encrypted = await crypto.subtle.encrypt(
      {
        name: "RSA-OAEP",
      },
      publicKey,
      data
    );

    // 转换为 base64
    const bytes = new Uint8Array(encrypted);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  } catch (error) {
    console.error("公钥加密失败:", error);
    return "";
  }
}

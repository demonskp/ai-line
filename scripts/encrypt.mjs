const publicKey =
  "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvMdFkEHkaEQCAHUbFvPG\nFi99vM77lkYARd4xZPZTDjLfnCicNcYfWYo1ubILxxZGVMR9j5G5YxfrTWI01PdB\nB7L0DY47s4IhZ6QltMmna3KjkLJd+zEblFjPSycIGW0uzCBHNXGdXKHtCDQlBuNH\nwxuhSc+PZTmxB3MkD1O5AVzqzSfF+LrRJTzv44K1Hhj4kmSWCiIkblog/jj24NaU\nnHVCzi9vEUHYd8xJM4L7Bkh7cfa9RPDWwkcGgtKvJBeKb9nwl5wk69ZYrXTEUze2\nA7UANbi7RTdSHCyO7Dj/IyDkBwAQrE7zCQrkRK9LnvUCdWfA4DCaddUYTqgvgZRP\nswIDAQAB\n-----END PUBLIC KEY-----\n".replace(
    /\\n/g,
    "\n"
  );

import crypto from "crypto";

/**
 * 使用公钥加密明文
 * @param {string} text - 要加密的明文
 * @returns {string} 加密后的 base64 字符串
 */
function encryptWithPublicKey(text) {
  try {
    const encrypted = crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      },
      Buffer.from(text, "utf8")
    );

    return encrypted.toString("base64");
  } catch (error) {
    console.error("Encryption error:", error);
    return "";
  }
}

const encryptedText = encryptWithPublicKey("admin");
console.log("Encrypted text:", encryptedText);

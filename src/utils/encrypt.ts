import CryptoJS from "crypto-js";

/**
 * 对密码进行加密
 * @param message 内容
 * @param key 键
 * @param iv 值
 * @returns 
 */
export function encryptPwd(message: string, key: string, iv: string) {
  const parsedKey = CryptoJS.enc.Hex.parse(key);
  const parsedIv = CryptoJS.enc.Hex.parse(iv);
  const encrypted = CryptoJS.AES.encrypt(message, parsedKey, {
    iv: parsedIv,
    padding: CryptoJS.pad.ZeroPadding,
  });
  return encrypted.toString();
}

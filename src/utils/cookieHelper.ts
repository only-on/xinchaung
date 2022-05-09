import Cookies from "js-cookie";

/**
 * 清除所有cookie
 */
export function clearAllCookies() {
  const all = Cookies.get();
  for (let cookieName in all) {
    Cookies.remove(cookieName);
  }
}

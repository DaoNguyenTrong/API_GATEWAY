import Cookies from "js-cookie";
import config from "@/configs/constant";

const Token = config.token;
const RefreshToken = config.refreshToken;

// Token accession
export function getToken() {
  const tokenObject = Cookies.get(Token);
  if (tokenObject) return JSON.parse(tokenObject);
  return {};
}
export function setToken(token, expires) {
  return Cookies.set(Token, JSON.stringify(token), { expires });
}
export function removeToken() {
  return Cookies.remove(Token);
}

// Refresh token accession
export function getRefreshToken() {
  const tokenObject = Cookies.get(RefreshToken);
  if (tokenObject) return JSON.parse(tokenObject);
  return {};
}
export function setRefreshToken(token, expires) {
  return Cookies.set(RefreshToken, JSON.stringify(token), { expires });
}
export function removeRefreshToken() {
  return Cookies.remove(RefreshToken);
}

export default {
  getToken,
  setToken,
  removeToken,
  getRefreshToken,
  setRefreshToken,
  removeRefreshToken,
};

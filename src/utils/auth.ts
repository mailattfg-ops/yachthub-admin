export const AUTH_KEY = "loggedin";

export function loginHardcoded(email: string, password: string) {
  if (email === "admin@gmail.com" && password === "admin123") {
    localStorage.setItem(AUTH_KEY, "true");
    return true;
  }
  return false;
}

export function isLoggedIn() {
  return typeof window !== "undefined" && localStorage.getItem(AUTH_KEY) === "true";
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
}

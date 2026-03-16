const ADMIN_TOKEN_KEY = "vmora_admin_token";

export const getAdminToken = () => {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(ADMIN_TOKEN_KEY) ?? "";
};

export const setAdminToken = (token: string) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ADMIN_TOKEN_KEY, token.trim());
};

export const clearAdminToken = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ADMIN_TOKEN_KEY);
};

export const adminHeaders = () => {
  const token = getAdminToken();
  return token ? { "x-admin-token": token } : {};
};

export const adminFetch = (input: RequestInfo | URL, init?: RequestInit) => {
  const headers = {
    ...(init?.headers || {}),
    ...adminHeaders(),
  };
  return fetch(input, { ...init, headers });
};

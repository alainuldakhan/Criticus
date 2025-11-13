const ACCESS_TOKEN_KEY = 'auth.accessToken';
const REFRESH_TOKEN_KEY = 'auth.refreshToken';
const PERSISTENCE_KEY = 'auth.persistence'; // 'local' | 'session'

const isBrowser = typeof window !== 'undefined';

const getStorage = (type) => {
  if (!isBrowser) return null;
  return type === 'session' ? window.sessionStorage : window.localStorage;
};

const getAllStorages = () => {
  if (!isBrowser) return [];
  return [window.localStorage, window.sessionStorage];
};

const removeFromAll = (key) => {
  getAllStorages().forEach((storage) => {
    try {
      storage.removeItem(key);
    } catch (error) {
      // ignore
    }
  });
};

export const getPersistPreference = () => {
  if (!isBrowser) return 'local';
  return window.localStorage.getItem(PERSISTENCE_KEY) ?? 'local';
};

const setPersistPreference = (mode) => {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(PERSISTENCE_KEY, mode);
  } catch (error) {
    // ignore
  }
};

export const setTokens = (accessToken, refreshToken, persist = getPersistPreference() === 'local') => {
  if (!isBrowser) return;

  const mode = persist ? 'local' : 'session';
  const target = getStorage(mode);

  if (!target) return;

  removeFromAll(ACCESS_TOKEN_KEY);
  removeFromAll(REFRESH_TOKEN_KEY);

  try {
    target.setItem(ACCESS_TOKEN_KEY, accessToken);
    target.setItem(REFRESH_TOKEN_KEY, refreshToken);
    setPersistPreference(mode);
  } catch (error) {
    // If storage fails (quota, privacy mode), fall back to in-memory by leaving tokens unset
  }
};

export const clearTokens = () => {
  if (!isBrowser) return;
  removeFromAll(ACCESS_TOKEN_KEY);
  removeFromAll(REFRESH_TOKEN_KEY);
};

export const getAccessToken = () => {
  if (!isBrowser) return null;
  return (
    window.localStorage.getItem(ACCESS_TOKEN_KEY) ??
    window.sessionStorage.getItem(ACCESS_TOKEN_KEY)
  );
};

export const getRefreshToken = () => {
  if (!isBrowser) return null;
  return (
    window.localStorage.getItem(REFRESH_TOKEN_KEY) ??
    window.sessionStorage.getItem(REFRESH_TOKEN_KEY)
  );
};

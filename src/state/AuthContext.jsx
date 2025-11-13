import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../api/auth';
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
  getPersistPreference,
} from './authStorage';

const AuthContext = createContext(null);

const initialState = {
  userId: null,
  email: null,
  roles: [],
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(initialState);
  const [status, setStatus] = useState('idle'); // idle | loading | authenticated | unauthenticated
  const [error, setError] = useState(null);

  const fetchCurrentUser = useCallback(async () => {
    const hasToken = Boolean(getAccessToken());
    if (!hasToken) {
      setUser(initialState);
      setStatus('unauthenticated');
      setError(null);
      return;
    }

    setStatus('loading');
    try {
      const profile = await authApi.me();
      setUser({
        userId: profile.userId,
        email: profile.email,
        roles: profile.roles ?? [],
      });
      setStatus('authenticated');
      setError(null);
    } catch (err) {
      clearTokens();
      setUser(initialState);
      setStatus('unauthenticated');
      setError(err);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const handleAuthSuccess = useCallback(
    async ({ accessToken, refreshToken, userId, email }, options = {}) => {
      const persist =
        options.persist ?? (getPersistPreference() === 'local');
      setTokens(accessToken, refreshToken, persist);
      setUser((current) => ({ ...current, userId, email }));
      setStatus('authenticated');
      setError(null);
      await fetchCurrentUser();
    },
    [fetchCurrentUser]
  );

  const login = useCallback(
    async (payload, options = {}) => {
      setStatus('loading');
      try {
        const response = await authApi.login(payload);
        await handleAuthSuccess(response, options);
        return { ok: true };
      } catch (err) {
        setStatus('unauthenticated');
        setError(err);
        return { ok: false, error: err };
      }
    },
    [handleAuthSuccess]
  );

  const register = useCallback(
    async (payload, options = {}) => {
      setStatus('loading');
      try {
        const response = await authApi.register(payload);
        await handleAuthSuccess(response, options);
        return { ok: true };
      } catch (err) {
        setStatus('unauthenticated');
        setError(err);
        return { ok: false, error: err };
      }
    },
    [handleAuthSuccess]
  );

  const logout = useCallback(async () => {
    const refreshToken = getRefreshToken();
    try {
      if (refreshToken) {
        await authApi.logout({ refreshToken });
      }
    } catch (err) {
      // swallow logout errors
    } finally {
      clearTokens();
      setUser(initialState);
      setStatus('unauthenticated');
      setError(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      status,
      isAuthenticated: status === 'authenticated',
      isLoading: status === 'loading',
      error,
      login,
      register,
      logout,
      refresh: fetchCurrentUser,
    }),
    [user, status, error, login, register, logout, fetchCurrentUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return ctx;
};

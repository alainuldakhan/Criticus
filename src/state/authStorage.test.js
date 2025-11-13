import {
  setTokens,
  getAccessToken,
  getRefreshToken,
  clearTokens,
  getPersistPreference,
} from './authStorage';

describe('authStorage', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  test('stores tokens in localStorage by default', () => {
    setTokens('access-local', 'refresh-local');

    expect(window.localStorage.getItem('auth.accessToken')).toBe('access-local');
    expect(window.sessionStorage.getItem('auth.accessToken')).toBeNull();
    expect(getAccessToken()).toBe('access-local');
    expect(getPersistPreference()).toBe('local');
  });

  test('stores tokens in sessionStorage when persist disabled', () => {
    setTokens('access-session', 'refresh-session', false);

    expect(window.sessionStorage.getItem('auth.accessToken')).toBe('access-session');
    expect(window.localStorage.getItem('auth.accessToken')).toBeNull();
    expect(getAccessToken()).toBe('access-session');
    expect(getPersistPreference()).toBe('session');
  });

  test('clears tokens from both storage types', () => {
    setTokens('token', 'refresh');
    setTokens('session-token', 'session-refresh', false);

    clearTokens();

    expect(getAccessToken()).toBeNull();
    expect(getRefreshToken()).toBeNull();
    expect(window.localStorage.getItem('auth.accessToken')).toBeNull();
    expect(window.sessionStorage.getItem('auth.accessToken')).toBeNull();
  });
});

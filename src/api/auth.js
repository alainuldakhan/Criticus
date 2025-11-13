import http from './http';

export const authApi = {
  register: (payload) => http.post('/auth/register', payload).then((res) => res.data),
  login: (payload) => http.post('/auth/login', payload).then((res) => res.data),
  refresh: (payload) =>
    http.post('/auth/refresh', payload).then((res) => res.data),
  logout: (payload) => http.post('/auth/logout', payload),
  me: () => http.get('/auth/me').then((res) => res.data),
};

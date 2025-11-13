import http from './http';

export const profileApi = {
  getProfile: () => http.get('/v1/me/profile').then((res) => res.data),
  updateProfile: (payload) => http.put('/v1/me/profile', payload).then((res) => res.data),
};

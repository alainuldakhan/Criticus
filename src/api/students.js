import http from './http';

export const studentsApi = {
  search: (params) =>
    http
      .get('/v1/teachers/students', { params })
      .then((res) => res.data),
  create: (payload) =>
    http
      .post('/v1/teachers/students', payload)
      .then((res) => res.data),
  getById: (userId) =>
    http.get(`/v1/teachers/students/${userId}`).then((res) => res.data),
  update: (userId, payload) =>
    http.put(`/v1/teachers/students/${userId}`, payload),
  deactivate: (userId) =>
    http.post(`/v1/teachers/students/${userId}/deactivate`),
  resetPassword: (userId) =>
    http
      .post(`/v1/teachers/students/${userId}/reset-password`)
      .then((res) => res.data),
};

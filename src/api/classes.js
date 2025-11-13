import http from './http';

export const classesApi = {
  list: () => http.get('/v1/teachers/classes').then((res) => res.data),
  allStudents: () =>
    http.get('/v1/teachers/classes/allStudents').then((res) => res.data),
  create: (payload) =>
    http.post('/v1/teachers/classes', payload).then((res) => res.data),
  getById: (classId) =>
    http.get(`/v1/teachers/classes/${classId}`).then((res) => res.data),
  update: (classId, payload) =>
    http.put(`/v1/teachers/classes/${classId}`, payload).then((res) => res.data),
  remove: (classId) => http.delete(`/v1/teachers/classes/${classId}`),
  addMembers: (classId, payload) =>
    http
      .post(`/v1/teachers/classes/${classId}/members`, payload)
      .then((res) => res.data),
  removeMember: (classId, userId) =>
    http.delete(`/v1/teachers/classes/${classId}/members/${userId}`),
  listMembers: (classId) =>
    http.get(`/v1/classes/${classId}/members`).then((res) => res.data),
};

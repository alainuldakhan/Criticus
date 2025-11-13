import http from './http';

export const invitationsApi = {
  create: (classId, payload) =>
    http
      .post(`/v1/teachers/classes/${classId}/invite`, payload)
      .then((res) => res.data),
  accept: (payload) =>
    http.post('/v1/invitations/accept', payload).then((res) => res.data),
};

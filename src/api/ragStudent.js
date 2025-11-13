import http from './http';

export const ragStudentApi = {
  listTopics: (params) =>
    http.get('/rag/student/topics', { params }).then((res) => res.data),
  getTopic: (topicId) =>
    http.get(`/rag/student/topics/${topicId}`).then((res) => res.data),
  createSession: (payload) =>
    http.post('/rag/student/sessions', payload).then((res) => res.data),
  listSessions: (params) =>
    http.get('/rag/student/sessions', { params }).then((res) => res.data),
  getSession: (sessionId) =>
    http.get(`/rag/student/sessions/${sessionId}`).then((res) => res.data),
  submitAnswers: (sessionId, payload) =>
    http
      .post(`/rag/student/sessions/${sessionId}/submit`, payload)
      .then((res) => res.data),
  evaluate: (sessionId) =>
    http
      .post(`/rag/student/sessions/${sessionId}/evaluate`)
      .then((res) => res.data),
  getReport: (sessionId) =>
    http
      .get(`/rag/student/sessions/${sessionId}/report`, {
        responseType: 'text',
      })
      .then((res) => {
        // Backend returns JSON string, parse it
        try {
          return typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
        } catch {
          return res.data;
        }
      }),
};

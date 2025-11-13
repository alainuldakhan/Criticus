import http from './http';

export const ragTeacherApi = {
  createTopic: (payload) =>
    http.post('/rag/teacher/topics', payload).then((res) => res.data),
  listTopics: (params) =>
    http.get('/rag/teacher/topics', { params }).then((res) => res.data),
  getTopic: (topicId) =>
    http.get(`/rag/teacher/topics/${topicId}`).then((res) => res.data),
  listClassSessions: (classId, params) =>
    http
      .get(`/rag/teacher/classes/${classId}/sessions`, { params })
      .then((res) => res.data),
  listStudentSessions: (studentId, params) =>
    http
      .get(`/rag/teacher/students/${studentId}/sessions`, { params })
      .then((res) => res.data),
  getSession: (sessionId) =>
    http.get(`/rag/teacher/sessions/${sessionId}`).then((res) => res.data),
  getReport: (sessionId) =>
    http
      .get(`/rag/teacher/sessions/${sessionId}/report`, {
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
  evaluate: (sessionId) =>
    http
      .post(`/rag/teacher/sessions/${sessionId}/evaluate`)
      .then((res) => res.data),
};

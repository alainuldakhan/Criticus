/**
 * Query keys for React Query
 * Centralized location for all query keys to avoid typos and ensure consistency
 */

export const queryKeys = {
  teacher: {
    // Classes
    classes: () => ['teacher', 'classes'],
    class: (classId) => ['teacher', 'classes', classId],
    classMembers: (classId) => ['teacher', 'classes', classId, 'members'],
    
    // Students
    students: () => ['teacher', 'students'],
    student: (studentId) => ['teacher', 'students', studentId],
    allStudents: () => ['teacher', 'classes', 'allStudents'],
    
    // Topics
    topics: () => ['teacher', 'topics'],
    topic: (topicId) => ['teacher', 'topics', topicId],
    
    // Invitations
    invitations: () => ['teacher', 'invitations'],
    
    // RAG/Sessions
    ragSessions: () => ['teacher', 'rag', 'sessions'],
    studentSessions: (studentId) => ['teacher', 'rag', 'students', studentId],
    classSessions: (classId) => ['teacher', 'rag', 'classes', classId],
  },
  
  student: {
    // Topics
    topics: (filters) => ['student', 'topics', filters],
    topic: (topicId) => ['student', 'topics', topicId],
    
    // Sessions
    sessions: (filters) => ['student', 'sessions', filters],
    session: (sessionId) => ['student', 'sessions', sessionId],
    
    // Reports
    reports: () => ['student', 'reports'],
  },
  
  // Auth & Profile
  auth: {
    me: () => ['auth', 'me'],
    profile: () => ['profile'],
  },
  
  // Dashboard
  dashboard: {
    teacher: () => ['dashboard', 'teacher'],
    student: () => ['dashboard', 'student'],
  },
};

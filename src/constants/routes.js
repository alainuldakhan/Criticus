/**
 * Application routes
 * Centralized location for all route paths
 */

export const routes = {
    home: '/',

    auth: {
        login: '/auth/login',
        register: '/auth/register',
        logout: '/auth/logout',
    },

    profile: '/profile',

    teacher: {
        base: '/teacher',
        dashboard: '/teacher',
        classes: '/teacher/classes',
        classDetail: (classId) => `/teacher/classes/${classId}`,
        students: '/teacher/students',
        studentDetail: (studentId) => `/teacher/students/${studentId}`,
        invitations: '/teacher/invitations',
        rag: '/teacher/rag',
        topics: '/teacher/topics',
        topicCreate: '/teacher/topics/create',
        topicDetail: (topicId) => `/teacher/topics/${topicId}`,
    },

    student: {
        base: '/student',
        dashboard: '/student',
        topics: '/student/topics',
        topicDetail: (topicId) => `/student/topics/${topicId}`,
        sessions: '/student/sessions',
        sessionDetail: (sessionId) => `/student/sessions/${sessionId}`,
        reports: '/student/reports',
    },
};

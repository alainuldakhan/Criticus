/**
 * Default values for forms
 */

export const formDefaults = {
    class: {
        name: '',
        grade: '',
        year: '',
    },

    topic: {
        title: '',
        conspect: '',
        questions: [],
    },

    student: {
        firstName: '',
        lastName: '',
        email: '',
    },

    auth: {
        email: '',
        password: '',
        rememberMe: false,
    },

    register: {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: 'Student',
    },
};

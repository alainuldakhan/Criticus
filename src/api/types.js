export const Role = {
  Student: 'Student',
  Teacher: 'Teacher',
};

export const AuthResponses = {
  AuthResponse: () => ({}),
};

export const AuthRequests = {
  RegisterRequest: {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  },
  LoginRequest: {
    email: '',
    password: '',
  },
  RefreshRequest: {
    refreshToken: '',
  },
};

export const ClassRequests = {
  CreateClassRequest: {
    name: '',
    grade: null,
    year: null,
  },
  UpdateClassRequest: {
    name: '',
    grade: null,
    year: null,
  },
  AddMembersRequest: {
    userIds: [],
    emails: [],
  },
};

export const StudentRequests = {
  CreateStudentRequest: {
    email: '',
    password: null,
    firstName: null,
    lastName: null,
    classes: [],
  },
  UpdateStudentRequest: {
    firstName: null,
    lastName: null,
    classesAdd: [],
    classesRemove: [],
  },
};

export const RagRequests = {
  CreateStudentSessionRequest: {
    topicId: '',
  },
  SubmitAnswersRequest: {
    answers: [],
  },
  CreateTopicRequest: {
    title: '',
    questions: [],
    conspect: '',
    generateConspect: false,
  },
};

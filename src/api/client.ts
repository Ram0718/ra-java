import axios from 'axios';
import type {
  User,
  CourseModule,
  TopicDetails,
  QuestionSummary,
  QuestionDetails,
  CodeRunResult,
  CodeSubmitResult,
  DashboardStats,
  LearningMaterial,
  AssessmentResult
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('jm_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const errCode = error.response?.data?.errorCode;
      if (errCode === 'SESSION_TERMINATED_ON_ANOTHER_DEVICE') {
        localStorage.removeItem('jm_token');
        localStorage.removeItem('jm_user');
        window.dispatchEvent(new CustomEvent('single-session-terminated'));
      }
    }
    return Promise.reject(error);
  }
);

// --- AUTH API ---
export const authApi = {
  googleLogin: async (data: { email: string; fullName?: string; profileImageUrl?: string; deviceInfo?: string }) => {
    const res = await apiClient.post<{ success: boolean; data: { token: string; user: User } }>('/auth/google', data);
    return res.data.data;
  },
  adminLogin: async (data: { email: string; password: string }) => {
    const res = await apiClient.post<{ success: boolean; data: { token: string; user: User } }>('/auth/admin-login', data);
    return res.data.data;
  },
  getMe: async () => {
    const res = await apiClient.get<{ success: boolean; data: User }>('/auth/me');
    return res.data.data;
  },
  logout: async () => {
    const res = await apiClient.post<{ success: boolean; message: string }>('/auth/logout');
    return res.data;
  },
};

// --- PAYMENT API ---
export const paymentApi = {
  createOrder: async () => {
    const res = await apiClient.post<{
      success: boolean;
      data: {
        orderId: string;
        amount: number;
        currency: string;
        keyId: string;
        receiptNumber: string;
        businessName: string;
        description: string;
      };
    }>('/payments/order');
    return res.data.data;
  },
  verifyPayment: async (data: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    paymentMethod?: string;
  }) => {
    const res = await apiClient.post<{
      success: boolean;
      message: string;
      data: {
        verified: boolean;
        status: string;
        courseAccess: boolean;
        receiptNumber: string;
        transactionReference: string;
        verifiedAt: string;
      };
    }>('/payments/verify', data);
    return res.data.data;
  },
  getHistory: async () => {
    const res = await apiClient.get<{ success: boolean; data: any[] }>('/payments/history');
    return res.data.data;
  },
};

// --- LEARNING API ---
export const learningApi = {
  getModules: async () => {
    const res = await apiClient.get<{ success: boolean; data: CourseModule[] }>('/learning/modules');
    return res.data.data;
  },
  getModuleDetails: async (slug: string) => {
    const res = await apiClient.get<{ success: boolean; data: any }>(`/learning/modules/${slug}`);
    return res.data.data;
  },
  getTopicDetails: async (slug: string) => {
    const res = await apiClient.get<{ success: boolean; data: TopicDetails }>(`/learning/topics/${slug}`);
    return res.data.data;
  },
  markRead: async (topicId: number) => {
    const res = await apiClient.post<{ success: boolean; data: any }>(`/learning/topics/${topicId}/mark-read`);
    return res.data.data;
  },
  trackTime: async (topicId: number, seconds: number) => {
    const res = await apiClient.post<{ success: boolean; data: any }>(`/learning/topics/${topicId}/track-time?seconds=${seconds}`);
    return res.data.data;
  },
};

// --- CODING API ---
export const codingApi = {
  getTopicQuestions: async (topicId: number) => {
    const res = await apiClient.get<{ success: boolean; data: QuestionSummary[] }>(`/coding/topics/${topicId}/questions`);
    return res.data.data;
  },
  getQuestionDetails: async (slug: string) => {
    const res = await apiClient.get<{ success: boolean; data: QuestionDetails }>(`/coding/questions/${slug}`);
    return res.data.data;
  },
  runCode: async (sourceCode: string, customInput?: string) => {
    const res = await apiClient.post<{ success: boolean; data: CodeRunResult }>('/coding/run', {
      sourceCode,
      customInput,
    });
    return res.data.data;
  },
  submitCode: async (questionId: string, sourceCode: string) => {
    const res = await apiClient.post<{ success: boolean; data: CodeSubmitResult }>('/coding/submit', {
      questionId,
      sourceCode,
    });
    return res.data.data;
  },
  getEditorial: async (slug: string) => {
    const res = await apiClient.get<{ success: boolean; data: { editorialSolution: string; explanation: string } }>(
      `/coding/questions/${slug}/editorial`
    );
    return res.data.data;
  },
};

// --- DASHBOARD API ---
export const dashboardApi = {
  getSummary: async () => {
    const res = await apiClient.get<{ success: boolean; data: DashboardStats }>('/dashboard/summary');
    return res.data.data;
  },
};

// --- ASSESSMENT API ---
export const assessmentApi = {
  getTopicAssessment: async (topicId: number) => {
    const res = await apiClient.get<{ success: boolean; data: any }>(`/assessments/topic/${topicId}`);
    return res.data.data;
  },
  submitAssessment: async (assessmentId: number, answers: Record<number, number>) => {
    const res = await apiClient.post<{ success: boolean; data: AssessmentResult }>(
      `/assessments/${assessmentId}/submit`,
      { answers }
    );
    return res.data.data;
  },
  getHistory: async () => {
    const res = await apiClient.get<{ success: boolean; data: any[] }>('/assessments/history');
    return res.data.data;
  },
};

// --- MATERIALS API ---
export const materialApi = {
  getAll: async () => {
    const res = await apiClient.get<{ success: boolean; data: LearningMaterial[] }>('/materials');
    return res.data.data;
  },
  registerDownload: async (materialId: number) => {
    const res = await apiClient.post<{ success: boolean; data: any }>(`/materials/${materialId}/download`);
    return res.data.data;
  },
};

// --- INTERVIEW API ---
export const interviewApi = {
  getTopics: async () => {
    const res = await apiClient.get<{ success: boolean; data: any[] }>('/interview/topics');
    return res.data.data;
  },
  getMockSession: async () => {
    const res = await apiClient.get<{ success: boolean; data: any }>('/interview/mock-session');
    return res.data.data;
  },
};

// --- ADMIN API ---
export const adminApi = {
  getAnalytics: async () => {
    const res = await apiClient.get<{ success: boolean; data: any }>('/admin/analytics');
    return res.data.data;
  },
  getStudents: async () => {
    const res = await apiClient.get<{ success: boolean; data: any[] }>('/admin/students');
    return res.data.data;
  },
  toggleStudentStatus: async (userId: string) => {
    const res = await apiClient.post<{ success: boolean; data: { active: boolean } }>(
      `/admin/students/${userId}/toggle-status`
    );
    return res.data.data;
  },
  createQuestion: async (data: any) => {
    const res = await apiClient.post<{ success: boolean; data: any }>('/admin/questions', data);
    return res.data.data;
  },
  uploadMaterial: async (data: any) => {
    const res = await apiClient.post<{ success: boolean; data: any }>('/admin/materials', data);
    return res.data.data;
  },
};

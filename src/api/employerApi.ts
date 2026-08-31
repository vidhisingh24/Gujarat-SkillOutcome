import { apiClient } from './client';
import type { VerificationRequest, SkillGapTheme } from '../data/mockData';

export interface EmployerFeedbackResponse {
  feedback: {
    id: string;
    traineeId: string;
    text: string;
  };
  skillGap?: SkillGapTheme;
}

export const employerApi = {
  getVerifications: async (): Promise<VerificationRequest[]> => {
    return apiClient.get<VerificationRequest[]>('/employer/verifications');
  },

  updateVerification: async (id: string, status: 'confirmed' | 'denied'): Promise<VerificationRequest> => {
    return apiClient.patch<VerificationRequest>(`/employer/verifications/${id}`, { status });
  },

  submitFeedback: async (traineeId: string, text: string): Promise<EmployerFeedbackResponse> => {
    return apiClient.post<EmployerFeedbackResponse>('/employer/feedback', { traineeId, text });
  }
};
export default employerApi;

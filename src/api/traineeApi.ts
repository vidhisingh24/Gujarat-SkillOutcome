import { apiClient } from './client';
import type { TraineeProfile, CheckIn } from '../data/mockData';

export interface TraineeOutcomesResponse {
  employment: TraineeProfile['employment'];
  checkins: CheckIn[];
}

export const traineeApi = {
  getProfile: async (): Promise<TraineeProfile> => {
    return apiClient.get<TraineeProfile>('/trainee/profile');
  },

  getCheckins: async (): Promise<CheckIn[]> => {
    return apiClient.get<CheckIn[]>('/trainee/checkins');
  },

  submitCheckin: async (data: {
    checkInId: string;
    employmentStatus: string;
    salaryBand: string;
    trainingRelated: boolean;
    satisfaction: number;
    reasonForLeaving: string;
    feedbackText: string;
  }): Promise<CheckIn> => {
    return apiClient.post<CheckIn>('/trainee/checkins', data);
  },

  getOutcomes: async (): Promise<TraineeOutcomesResponse> => {
    return apiClient.get<TraineeOutcomesResponse>('/trainee/outcomes');
  }
};
export default traineeApi;

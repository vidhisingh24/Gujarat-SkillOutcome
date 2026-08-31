import { apiClient } from './client';
import type { ProgrammeScorecard } from '../data/mockData';

export interface ProviderOverviewResponse {
  providerInfo: {
    name: string;
    code: string;
    district: string;
    status: string;
  };
  metrics: {
    traineeCount: number;
    placementRate: number;
    sixMonthRetention: number;
    mismatchRate: number;
  };
  programmes: ProgrammeScorecard[];
}

export const providerApi = {
  getOverview: async (): Promise<ProviderOverviewResponse> => {
    return apiClient.get<ProviderOverviewResponse>('/provider/overview');
  }
};
export default providerApi;

import { apiClient } from './client';
import type { DistrictMetric, ProgrammeScorecard, SkillGapTheme } from '../data/mockData';

export interface GovOverviewResponse {
  totalTrainees: number;
  placementRate: number;
  threeMonthRetention: number;
  sixMonthRetention: number;
  twelveMonthRetention: number;
  mismatchRate: number;
  responseRate: number;
}

export interface GovAlertsResponse {
  total: number;
  redCount: number;
  yellowCount: number;
  list: Array<{
    id: string;
    severity: 'RED' | 'YELLOW';
    message: string;
    programmeId: string;
    date: string;
  }>;
}

export const governmentApi = {
  getOverview: async (): Promise<GovOverviewResponse> => {
    return apiClient.get<GovOverviewResponse>('/government/overview');
  },

  getDistricts: async (): Promise<DistrictMetric[]> => {
    return apiClient.get<DistrictMetric[]>('/government/districts');
  },

  getProgrammes: async (): Promise<ProgrammeScorecard[]> => {
    return apiClient.get<ProgrammeScorecard[]>('/government/programmes');
  },

  getSkillGaps: async (): Promise<SkillGapTheme[]> => {
    return apiClient.get<SkillGapTheme[]>('/government/skill-gaps');
  },

  getAlerts: async (): Promise<GovAlertsResponse> => {
    return apiClient.get<GovAlertsResponse>('/government/alerts');
  }
};
export default governmentApi;

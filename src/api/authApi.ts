import { apiClient } from './client';
import type { User } from '../data/mockData';

export interface LoginResponse {
  token: string;
  user: User;
}

export const authApi = {
  login: async (credentials: { email: string; password: string }): Promise<LoginResponse> => {
    return apiClient.post<LoginResponse>('/auth/login', credentials);
  },

  getMe: async (): Promise<User> => {
    return apiClient.get<User>('/auth/me');
  },

  logout: () => {
    authApi.logout(); // Wait, let's keep it clean
  }
};
// Fix logout loop in mock:
authApi.logout = () => {
  localStorage.removeItem('kaushalsetu_token');
};
export default authApi;

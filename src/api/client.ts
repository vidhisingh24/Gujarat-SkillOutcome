import { mockUsers, mockCheckins, mockVerifications, mockEmployerFeedbacks, mockProviderOverview, mockGovOverview, mockGovDistricts, mockGovProgrammes, mockGovSkillGaps, mockGovAlerts, updateMockVerificationStatus } from '../data/mockData';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

// Helper to retrieve token from localStorage
export const getToken = (): string | null => localStorage.getItem('kaushalsetu_token');
export const setToken = (token: string) => localStorage.setItem('kaushalsetu_token', token);
export const removeToken = () => localStorage.removeItem('kaushalsetu_token');

// Helper to handle API error format: { error: "human-readable message" }
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// Simulate latency for mock data
const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

export const apiClient = {
  async get<T>(endpoint: string): Promise<T> {
    if (USE_MOCK) {
      await delay();
      return handleMockGet<T>(endpoint);
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new ApiError(errData.error || 'Something went wrong', response.status);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to connect to the server. Please check if the backend is running.', 500);
    }
  },

  async post<T>(endpoint: string, body: any): Promise<T> {
    if (USE_MOCK) {
      await delay();
      return handleMockPost<T>(endpoint, body);
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new ApiError(errData.error || 'Something went wrong', response.status);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to connect to the server. Please check if the backend is running.', 500);
    }
  },

  async patch<T>(endpoint: string, body: any): Promise<T> {
    if (USE_MOCK) {
      await delay();
      return handleMockPatch<T>(endpoint, body);
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new ApiError(errData.error || 'Something went wrong', response.status);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to connect to the server. Please check if the backend is running.', 500);
    }
  }
};

// ---------------- MOCK REQUEST ROUTER ----------------

function handleMockGet<T>(endpoint: string): T {
  // Check auth headers by simulating validation
  const token = getToken();
  const isLoggedIn = !!token;

  if (endpoint.startsWith('/auth/me')) {
    if (!isLoggedIn) throw new ApiError('Unauthorized', 401);
    // Find user with this token
    const mockUserRecord = Object.values(mockUsers).find(u => u.token === token);
    if (!mockUserRecord) throw new ApiError('Unauthorized', 401);
    return mockUserRecord.user as unknown as T;
  }

  // Trainee Protected Endpoints
  if (endpoint.startsWith('/trainee/')) {
    if (!isLoggedIn) throw new ApiError('Unauthorized', 401);
    const mockUserRecord = Object.values(mockUsers).find(u => u.token === token);
    if (!mockUserRecord || mockUserRecord.user.role !== 'trainee') throw new ApiError('Forbidden', 403);

    if (endpoint === '/trainee/profile') {
      return mockUserRecord.profile as unknown as T;
    }
    if (endpoint === '/trainee/checkins') {
      return mockCheckins as unknown as T;
    }
    if (endpoint === '/trainee/outcomes') {
      // Returns employment + checkins
      return {
        employment: mockUserRecord.profile.employment,
        checkins: mockCheckins
      } as unknown as T;
    }
  }

  // Employer Protected Endpoints
  if (endpoint.startsWith('/employer/')) {
    if (!isLoggedIn) throw new ApiError('Unauthorized', 401);
    const mockUserRecord = Object.values(mockUsers).find(u => u.token === token);
    if (!mockUserRecord || mockUserRecord.user.role !== 'employer') throw new ApiError('Forbidden', 403);

    if (endpoint === '/employer/verifications') {
      return mockVerifications as unknown as T;
    }
  }

  // Provider Protected Endpoints
  if (endpoint.startsWith('/provider/')) {
    if (!isLoggedIn) throw new ApiError('Unauthorized', 401);
    const mockUserRecord = Object.values(mockUsers).find(u => u.token === token);
    if (!mockUserRecord || mockUserRecord.user.role !== 'provider') throw new ApiError('Forbidden', 403);

    if (endpoint === '/provider/overview') {
      return mockProviderOverview as unknown as T;
    }
  }

  // Government Protected Endpoints
  if (endpoint.startsWith('/government/')) {
    if (!isLoggedIn) throw new ApiError('Unauthorized', 401);
    const mockUserRecord = Object.values(mockUsers).find(u => u.token === token);
    if (!mockUserRecord || mockUserRecord.user.role !== 'government') throw new ApiError('Forbidden', 403);

    if (endpoint === '/government/overview') {
      return mockGovOverview as unknown as T;
    }
    if (endpoint === '/government/districts') {
      return mockGovDistricts as unknown as T;
    }
    if (endpoint === '/government/programmes') {
      return mockGovProgrammes as unknown as T;
    }
    if (endpoint === '/government/skill-gaps') {
      return mockGovSkillGaps as unknown as T;
    }
    if (endpoint === '/government/alerts') {
      return mockGovAlerts as unknown as T;
    }
  }

  throw new ApiError('Resource not found', 404);
}

function handleMockPost<T>(endpoint: string, body: any): T {
  if (endpoint === '/auth/login') {
    const { email, password } = body;
    if (!email || !password) throw new ApiError('Invalid request data', 400);

    const userRecord = mockUsers[email];
    // Simple password check (accept password123)
    if (!userRecord || password !== 'password123') {
      throw new ApiError('Invalid credentials', 401);
    }

    // Set token locally
    setToken(userRecord.token);
    return {
      token: userRecord.token,
      user: userRecord.user
    } as unknown as T;
  }

  const token = getToken();
  const isLoggedIn = !!token;
  if (!isLoggedIn) throw new ApiError('Unauthorized', 401);

  if (endpoint === '/trainee/checkins') {
    const userRecord = Object.values(mockUsers).find(u => u.token === token);
    if (!userRecord || userRecord.user.role !== 'trainee') throw new ApiError('Forbidden', 403);

    // Save submitted checkin
    const newCheckin = {
      id: 'chk_' + Math.random().toString(36).substr(2, 9),
      cycle: body.checkInId === 'chk_02' ? '6_month' as const : '12_month' as const,
      status: 'completed' as const,
      dueDate: new Date().toISOString().split('T')[0],
      submittedDate: new Date().toISOString().split('T')[0],
      employmentStatus: body.employmentStatus,
      salaryBand: body.salaryBand,
      trainingRelated: body.trainingRelated,
      satisfaction: body.satisfaction,
      feedbackText: body.feedbackText
    };

    // Update checkin list status in memory
    const existing = mockCheckins.find(c => c.id === body.checkInId);
    if (existing) {
      existing.status = 'completed';
      existing.submittedDate = newCheckin.submittedDate;
      existing.employmentStatus = newCheckin.employmentStatus;
      existing.salaryBand = newCheckin.salaryBand;
      existing.trainingRelated = newCheckin.trainingRelated;
      existing.satisfaction = newCheckin.satisfaction;
      existing.feedbackText = newCheckin.feedbackText;
    } else {
      mockCheckins.push(newCheckin);
    }

    // Update profile employment status based on response
    if (userRecord.profile.employment) {
      userRecord.profile.employment.status = body.employmentStatus;
      userRecord.profile.employment.salaryBand = body.salaryBand;
      userRecord.profile.employment.verificationStatus = 'pending';
    }

    return newCheckin as unknown as T;
  }

  if (endpoint === '/employer/feedback') {
    const userRecord = Object.values(mockUsers).find(u => u.token === token);
    if (!userRecord || userRecord.user.role !== 'employer') throw new ApiError('Forbidden', 403);

    const newFeedback = {
      id: 'fb_' + Math.random().toString(36).substr(2, 9),
      traineeId: body.traineeId,
      text: body.text
    };
    mockEmployerFeedbacks.push(newFeedback);

    // Simulate generated SkillGap result
    const newSkillGap = {
      id: 'gap_' + Math.random().toString(36).substr(2, 9),
      category: 'Practical Skill Gap' as const,
      themeText: body.text,
      count: 1,
      confidence: 0.9,
      district: 'Ahmedabad',
      recentKeywords: ['workplace', 'skills']
    };
    mockGovSkillGaps.push(newSkillGap);

    return {
      feedback: newFeedback,
      skillGap: newSkillGap
    } as unknown as T;
  }

  throw new ApiError('Resource not found', 404);
}

function handleMockPatch<T>(endpoint: string, body: any): T {
  const token = getToken();
  const isLoggedIn = !!token;
  if (!isLoggedIn) throw new ApiError('Unauthorized', 401);

  if (endpoint.startsWith('/employer/verifications/')) {
    const userRecord = Object.values(mockUsers).find(u => u.token === token);
    if (!userRecord || userRecord.user.role !== 'employer') throw new ApiError('Forbidden', 403);

    const id = endpoint.split('/').pop() || '';
    const status = body.status;

    if (status !== 'confirmed' && status !== 'denied') {
      throw new ApiError('Invalid verification status', 400);
    }

    const updated = updateMockVerificationStatus(id, status);
    if (!updated) throw new ApiError('Verification request not found', 404);

    // Update Ravi's profile verification status in mock data if it matches
    const raviRecord = mockUsers['trainee@kaushalsetu.gov.in'];
    if (updated.trainee.id === raviRecord.user.profileRef && raviRecord.profile.employment) {
      raviRecord.profile.employment.verificationStatus = status;
    }

    return updated as unknown as T;
  }

  throw new ApiError('Resource not found', 404);
}

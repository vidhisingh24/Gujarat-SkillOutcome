// Mock Data matching the backend API contract

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'trainee' | 'employer' | 'provider' | 'government';
  profileRef: string;
  profileModel: string;
}

export interface TraineeProfile {
  id: string;
  name: string;
  trade: string;
  batch: string;
  district: string;
  email: string;
  phone: string;
  trainingProvider: {
    id: string;
    name: string;
    code: string;
  };
  programme: {
    id: string;
    name: string;
    sector: string;
  };
  employment: {
    status: 'employed' | 'not_employed' | 'self_employed' | 'changed_job' | 'non_responsive';
    currentRole?: string;
    companyName?: string;
    salaryBand?: string;
    startDate?: string;
    verificationStatus?: 'pending' | 'confirmed' | 'denied';
  } | null;
  isSynthetic: boolean;
}

export interface CheckIn {
  id: string;
  cycle: '3_month' | '6_month' | '12_month';
  status: 'pending' | 'completed' | 'missed';
  dueDate: string;
  submittedDate?: string;
  employmentStatus?: string;
  salaryBand?: string;
  trainingRelated?: boolean;
  satisfaction?: number;
  reasonForLeaving?: string;
  feedbackText?: string;
}

export interface VerificationRequest {
  id: string;
  trainee: {
    id: string;
    name: string;
  };
  district: string;
  cycle: '3_month' | '6_month' | '12_month';
  status: 'pending' | 'confirmed' | 'denied';
  createdDate: string;
  jobRole: string;
  salaryBand: string;
}

export interface SkillGapTheme {
  id: string;
  category: 'Practical Skill Gap' | 'Outdated Equipment' | 'Curriculum Mismatch' | 'Low Salary' | 'Workplace Issues' | 'Migration' | 'Lack of Job Opportunities' | 'Other';
  themeText: string;
  count: number;
  confidence: number; // 0-1
  district: string;
  recentKeywords: string[];
}

export interface ProgrammeScorecard {
  id: string;
  district: string;
  providerName: string;
  programmeName: string;
  trade: string;
  batchCode: string;
  traineeCount: number;
  placementRate: number; // percentage
  sixMonthRetention: number; // percentage
  threeMonthRetention: number;
  twelveMonthRetention: number;
  mismatchRate: number; // percentage
  status: 'RED' | 'YELLOW' | 'GREEN';
  reason?: string;
}

export interface DistrictMetric {
  name: string;
  trainees: number;
  employed: number;
  employmentRate: number; // percentage
}

// ---------------- MOCK STORE ----------------

export const mockUsers: Record<string, { user: User; token: string; profile: any }> = {
  'trainee@kaushalsetu.gov.in': {
    token: 'mock-jwt-token-trainee-ravi',
    user: {
      id: 'usr_trainee_01',
      name: 'Ravi Parmar',
      email: 'trainee@kaushalsetu.gov.in',
      role: 'trainee',
      profileRef: 'trn_ravi_01',
      profileModel: 'Trainee'
    },
    profile: {
      id: 'trn_ravi_01',
      name: 'Ravi Parmar',
      trade: 'CNC Operator',
      batch: 'CNC-2025-BATCH-02',
      district: 'Ahmedabad',
      email: 'trainee@kaushalsetu.gov.in',
      phone: '+91 98765 43210',
      trainingProvider: {
        id: 'prov_ahmedabad_01',
        name: 'Ahmedabad Industrial Technical Center',
        code: 'AITC-380001'
      },
      programme: {
        id: 'prg_cnc_01',
        name: 'Advanced Machine Operations (CNC)',
        sector: 'Capital Goods'
      },
      employment: {
        status: 'employed',
        currentRole: 'Junior CNC Operator',
        companyName: 'Gujarat Precision Tools Pvt Ltd',
        salaryBand: '10,000 - 18,000',
        startDate: '2026-03-10',
        verificationStatus: 'pending'
      },
      isSynthetic: true
    }
  },
  'employer@kaushalsetu.gov.in': {
    token: 'mock-jwt-token-employer-gpt',
    user: {
      id: 'usr_employer_01',
      name: 'Hitesh Patel (HR)',
      email: 'employer@kaushalsetu.gov.in',
      role: 'employer',
      profileRef: 'emp_gpt_01',
      profileModel: 'Employer'
    },
    profile: {
      companyName: 'Gujarat Precision Tools Pvt Ltd',
      registeredNumber: 'EMP-GJ-380012',
      district: 'Ahmedabad'
    }
  },
  'provider@kaushalsetu.gov.in': {
    token: 'mock-jwt-token-provider-aitc',
    user: {
      id: 'usr_provider_01',
      name: 'Director, Ahmedabad Tech Center',
      email: 'provider@kaushalsetu.gov.in',
      role: 'provider',
      profileRef: 'prov_ahmedabad_01',
      profileModel: 'TrainingProvider'
    },
    profile: {
      name: 'Ahmedabad Industrial Technical Center',
      code: 'AITC-380001',
      district: 'Ahmedabad'
    }
  },
  'government@kaushalsetu.gov.in': {
    token: 'mock-jwt-token-government-directorate',
    user: {
      id: 'usr_gov_01',
      name: 'Skill Development Officer',
      email: 'government@kaushalsetu.gov.in',
      role: 'government',
      profileRef: 'gov_dept_01',
      profileModel: 'Government'
    },
    profile: {
      department: 'Directorate of Employment and Training (DET)',
      state: 'Gujarat'
    }
  }
};

// Trainee Check-ins
export const mockCheckins: CheckIn[] = [
  {
    id: 'chk_01',
    cycle: '3_month',
    status: 'completed',
    dueDate: '2026-06-15',
    submittedDate: '2026-06-12',
    employmentStatus: 'employed',
    salaryBand: '10,000 - 18,000',
    trainingRelated: true,
    satisfaction: 4,
    feedbackText: 'Training was highly relevant, but the workshop machines were older than the CNC controllers in the factory.'
  },
  {
    id: 'chk_02',
    cycle: '6_month',
    status: 'pending',
    dueDate: '2026-09-15'
  },
  {
    id: 'chk_03',
    cycle: '12_month',
    status: 'pending',
    dueDate: '2027-03-15'
  }
];

// Employer Verification Requests
export let mockVerifications: VerificationRequest[] = [
  {
    id: 'ver_01',
    trainee: { id: 'trn_ravi_01', name: 'Ravi Parmar' },
    district: 'Ahmedabad',
    cycle: '3_month',
    status: 'confirmed',
    createdDate: '2026-06-12',
    jobRole: 'Junior CNC Operator',
    salaryBand: '10,000 - 18,000'
  },
  {
    id: 'ver_02',
    trainee: { id: 'trn_anil_02', name: 'Anil Solanki' },
    district: 'Ahmedabad',
    cycle: '6_month',
    status: 'pending',
    createdDate: '2026-08-20',
    jobRole: 'CNC Operator',
    salaryBand: '10,000 - 18,000'
  },
  {
    id: 'ver_03',
    trainee: { id: 'trn_nikita_03', name: 'Nikita Patel' },
    district: 'Gandhinagar',
    cycle: '3_month',
    status: 'pending',
    createdDate: '2026-08-25',
    jobRole: 'Data Entry Operator',
    salaryBand: 'Below 10,000'
  }
];

export function updateMockVerificationStatus(id: string, status: 'confirmed' | 'denied') {
  mockVerifications = mockVerifications.map(v => v.id === id ? { ...v, status } : v);
  return mockVerifications.find(v => v.id === id);
}

// Employer Feedbacks & Gaps
export let mockEmployerFeedbacks = [
  {
    id: 'fb_01',
    traineeId: 'trn_ravi_01',
    text: 'Good on theoretical basics, but needs more exposure to newer Siemens CNC controllers. We had to spend 3 weeks retraining him.'
  }
];

// Provider overview & scorecard
export const mockProviderOverview = {
  providerInfo: {
    name: 'Ahmedabad Industrial Technical Center',
    code: 'AITC-380001',
    district: 'Ahmedabad',
    status: 'Active'
  },
  metrics: {
    traineeCount: 420,
    placementRate: 74.5,
    sixMonthRetention: 63.2,
    mismatchRate: 18.5
  },
  programmes: [
    {
      id: 'prg_aitc_cnc',
      district: 'Ahmedabad',
      providerName: 'Ahmedabad Industrial Technical Center',
      programmeName: 'Advanced Machine Operations (CNC)',
      trade: 'CNC Machinist',
      batchCode: 'CNC-2025-BATCH-02',
      traineeCount: 65,
      placementRate: 85.0,
      sixMonthRetention: 72.0,
      threeMonthRetention: 88.0,
      twelveMonthRetention: 65.0,
      mismatchRate: 15.0,
      status: 'GREEN' as const,
      reason: 'Consistently high outcomes and feedback'
    },
    {
      id: 'prg_aitc_welder',
      district: 'Ahmedabad',
      providerName: 'Ahmedabad Industrial Technical Center',
      programmeName: 'Arc & Gas Welding Specialist',
      trade: 'Welder',
      batchCode: 'WLD-2025-BATCH-01',
      traineeCount: 50,
      placementRate: 68.0,
      sixMonthRetention: 58.0,
      threeMonthRetention: 70.0,
      twelveMonthRetention: 52.0,
      mismatchRate: 22.0,
      status: 'YELLOW' as const,
      reason: 'Retention dropped slightly due to migration reasons'
    },
    {
      id: 'prg_aitc_fitter',
      district: 'Ahmedabad',
      providerName: 'Ahmedabad Industrial Technical Center',
      programmeName: 'Industrial Fitter Course',
      trade: 'Fitter',
      batchCode: 'FIT-2025-BATCH-03',
      traineeCount: 80,
      placementRate: 52.0,
      sixMonthRetention: 42.0,
      threeMonthRetention: 60.0,
      twelveMonthRetention: 38.0,
      mismatchRate: 35.0,
      status: 'RED' as const,
      reason: 'High trade mismatch rate (35%) and low 12-month retention (38%)'
    }
  ]
};

// Government Data
export const mockGovOverview = {
  totalTrainees: 1200,
  placementRate: 72.0,
  threeMonthRetention: 77.8,
  sixMonthRetention: 59.1,
  twelveMonthRetention: 56.5,
  mismatchRate: 20.8,
  responseRate: 81.3
};

export const mockGovDistricts: DistrictMetric[] = [
  { name: 'Ahmedabad', trainees: 640, employed: 430, employmentRate: 67.2 },
  { name: 'Gandhinagar', trainees: 120, employed: 94, employmentRate: 78.3 },
  { name: 'Rajkot', trainees: 260, employed: 198, employmentRate: 76.2 },
  { name: 'Surat', trainees: 180, employed: 138, employmentRate: 76.7 }
];

export const mockGovProgrammes: ProgrammeScorecard[] = [
  {
    id: 'prg_fit_ahm',
    district: 'Ahmedabad',
    providerName: 'Ahmedabad Industrial Technical Center',
    programmeName: 'Industrial Fitter Course',
    trade: 'Fitter',
    batchCode: 'FIT-2025-BATCH-03',
    traineeCount: 80,
    placementRate: 52.0,
    sixMonthRetention: 42.0,
    threeMonthRetention: 60.0,
    twelveMonthRetention: 38.0,
    mismatchRate: 35.0,
    status: 'RED',
    reason: 'High trade mismatch rate (35%) and low 12-month retention (38%)'
  },
  {
    id: 'prg_cnc_raj',
    district: 'Rajkot',
    providerName: 'Saurashtra Skill Academy',
    programmeName: 'CNC Operator Course',
    trade: 'CNC Machinist',
    batchCode: 'CNC-RAJK-2025-B1',
    traineeCount: 75,
    placementRate: 88.0,
    sixMonthRetention: 50.0,
    threeMonthRetention: 85.0,
    twelveMonthRetention: 45.0,
    mismatchRate: 12.0,
    status: 'RED',
    reason: 'Retention dropped 2 quarters running (from 85% at 3-mo to 50% at 6-mo)'
  },
  {
    id: 'prg_wld_ahm',
    district: 'Ahmedabad',
    providerName: 'Ahmedabad Industrial Technical Center',
    programmeName: 'Arc & Gas Welding Specialist',
    trade: 'Welder',
    batchCode: 'WLD-2025-BATCH-01',
    traineeCount: 50,
    placementRate: 68.0,
    sixMonthRetention: 58.0,
    threeMonthRetention: 70.0,
    twelveMonthRetention: 52.0,
    mismatchRate: 22.0,
    status: 'YELLOW',
    reason: 'Retention dropped slightly due to migration reasons'
  },
  {
    id: 'prg_elec_sur',
    district: 'Surat',
    providerName: 'Diamond City Skills Institute',
    programmeName: 'Industrial Electrician',
    trade: 'Electrician',
    batchCode: 'ELEC-SUR-2025-B2',
    traineeCount: 90,
    placementRate: 76.0,
    sixMonthRetention: 68.0,
    threeMonthRetention: 80.0,
    twelveMonthRetention: 64.0,
    mismatchRate: 18.0,
    status: 'YELLOW',
    reason: 'Minor wage satisfaction complaints'
  },
  {
    id: 'prg_cnc_ahm',
    district: 'Ahmedabad',
    providerName: 'Ahmedabad Industrial Technical Center',
    programmeName: 'Advanced Machine Operations (CNC)',
    trade: 'CNC Machinist',
    batchCode: 'CNC-2025-BATCH-02',
    traineeCount: 65,
    placementRate: 85.0,
    sixMonthRetention: 72.0,
    threeMonthRetention: 88.0,
    twelveMonthRetention: 65.0,
    mismatchRate: 15.0,
    status: 'GREEN',
    reason: 'Consistently high outcomes and feedback'
  },
  {
    id: 'prg_it_gan',
    district: 'Gandhinagar',
    providerName: 'Gujarat State IT Academy',
    programmeName: 'Office Automation & IT Support',
    trade: 'IT Specialist',
    batchCode: 'IT-GANDH-2025-B4',
    traineeCount: 110,
    placementRate: 92.0,
    sixMonthRetention: 86.0,
    threeMonthRetention: 94.0,
    twelveMonthRetention: 82.0,
    mismatchRate: 8.0,
    status: 'GREEN',
    reason: 'Outstanding placement and stable retention records'
  }
];

export const mockGovSkillGaps: SkillGapTheme[] = [
  {
    id: 'gap_01',
    category: 'Outdated Equipment',
    themeText: 'Outdated equipment vs workplace',
    count: 34,
    confidence: 0.88,
    district: 'Ahmedabad',
    recentKeywords: ['Siemens controllers', 'newer CNC machines', 'manual lathes', 'obsolete systems']
  },
  {
    id: 'gap_02',
    category: 'Curriculum Mismatch',
    themeText: 'Lack of automated PLC logic in classroom',
    count: 22,
    confidence: 0.81,
    district: 'Rajkot',
    recentKeywords: ['PLC programming', 'SCADA systems', 'automation logic']
  },
  {
    id: 'gap_03',
    category: 'Low Salary',
    themeText: 'Low entry-level wages causing early attrition',
    count: 56,
    confidence: 0.94,
    district: 'Statewide',
    recentKeywords: ['under 10k', 'no travel allowance', 'high living costs']
  },
  {
    id: 'gap_04',
    category: 'Migration',
    themeText: 'Out-of-district migration of skilled graduates',
    count: 18,
    confidence: 0.76,
    district: 'Surat',
    recentKeywords: ['home district return', 'accommodation costs', 'language barrier']
  }
];

export const mockGovAlerts = {
  total: 4,
  redCount: 2,
  yellowCount: 2,
  list: [
    {
      id: 'alt_01',
      severity: 'RED',
      message: 'CNC operator, Rajkot — high placement, retention dropped 2 quarters running (from 85% at 3-mo checkin to 50% at 6-mo checkin).',
      programmeId: 'prg_cnc_raj',
      date: '2026-08-25'
    },
    {
      id: 'alt_02',
      severity: 'RED',
      message: 'Industrial Fitter Course, Ahmedabad — high trade mismatch rate (35%) and low 12-month retention (38%).',
      programmeId: 'prg_fit_ahm',
      date: '2026-08-26'
    },
    {
      id: 'alt_03',
      severity: 'YELLOW',
      message: 'Arc & Gas Welding Specialist, Ahmedabad — 6-month retention rate fell below the state target of 60%.',
      programmeId: 'prg_wld_ahm',
      date: '2026-08-27'
    },
    {
      id: 'alt_04',
      severity: 'YELLOW',
      message: 'Industrial Electrician, Surat — wage satisfaction responses index dropped below 3.0.',
      programmeId: 'prg_elec_sur',
      date: '2026-08-28'
    }
  ]
};

// High-level landing page public metrics
export const mockLandingStats = [
  { label: 'Trainees tracked', value: '3.2 lakh' },
  { label: '6-month retention', value: '61%' },
  { label: 'Districts covered', value: '33' },
  { label: 'Programmes flagged', value: '14' }
];

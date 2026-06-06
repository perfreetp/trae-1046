export type ProjectType = 'engineering' | 'procurement' | 'property';

export type ProjectStatus = 'registered' | 'announced' | 'bidding' | 'evaluating' | 'completed' | 'contract' | 'performing';

export interface Project {
  id: string;
  name: string;
  code: string;
  type: ProjectType;
  budget: number;
  purchaser: string;
  agency: string;
  status: ProjectStatus;
  registerDate: string;
  description: string;
  attachments: string[];
}

export type AnnouncementType = 'bidding' | 'clarification' | 'result';
export type AnnouncementStatus = 'pending' | 'approved' | 'rejected';

export interface Announcement {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  type: AnnouncementType;
  content: string;
  submitTime: string;
  status: AnnouncementStatus;
  reviewer: string;
  reviewTime?: string;
  reviewOpinion?: string;
}

export type BiddingStatus = 'scheduled' | 'ongoing' | 'completed';

export interface BiddingSession {
  id: string;
  projectId: string;
  projectName: string;
  startTime: string;
  location: string;
  status: BiddingStatus;
  bondStatus: {
    total: number;
    paid: number;
    unpaid: number;
    refunded: number;
  };
}

export interface Judge {
  id: string;
  name: string;
  expertField: string;
  isRecused: boolean;
  recuseReason?: string;
}

export interface JudgeExtraction {
  id: string;
  projectId: string;
  projectName: string;
  extractTime: string;
  judges: Judge[];
  operator: string;
}

export type ClueSource = 'system' | 'manual' | 'complaint';
export type RiskLevel = 'high' | 'medium' | 'low';
export type ClueStatus = 'pending' | 'processing' | 'closed';

export interface Clue {
  id: string;
  projectId?: string;
  projectName?: string;
  title: string;
  description: string;
  source: ClueSource;
  riskLevel: RiskLevel;
  status: ClueStatus;
  relatedCompanies: string[];
  createTime: string;
  handler?: string;
  handleTime?: string;
  handleResult?: string;
}

export type ComplaintStatus = 'pending' | 'processing' | 'replied' | 'closed';

export interface Complaint {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  content: string;
  complainant: string;
  contact: string;
  submitTime: string;
  status: ComplaintStatus;
  handler?: string;
  replyContent?: string;
  replyTime?: string;
}

export type CreditLevel = 'AAA' | 'AA' | 'A' | 'B' | 'C' | 'D';

export interface Punishment {
  id: string;
  enterpriseId: string;
  title: string;
  content: string;
  punishmentType: string;
  decisionNo: string;
  decisionDate: string;
  scoreDeduction: number;
  documents: string[];
}

export interface CreditEnterprise {
  id: string;
  name: string;
  creditCode: string;
  legalPerson: string;
  contact: string;
  address: string;
  creditScore: number;
  creditLevel: CreditLevel;
  isBlacklisted: boolean;
  blacklistReason?: string;
  blacklistTime?: string;
  punishments: Punishment[];
  projectCount: number;
  winCount: number;
}

export type MilestoneStatus = 'pending' | 'in_progress' | 'completed' | 'delayed';

export interface Milestone {
  id: string;
  contractId: string;
  name: string;
  planDate: string;
  actualDate?: string;
  status: MilestoneStatus;
  description: string;
}

export interface Contract {
  id: string;
  projectId: string;
  projectName: string;
  contractNo: string;
  contractAmount: number;
  partyA: string;
  partyB: string;
  signDate: string;
  startDate: string;
  endDate: string;
  content: string;
  attachments: string[];
  performanceProgress: number;
  milestones: Milestone[];
}

export interface StatisticsData {
  totalProjects: number;
  totalAmount: number;
  ongoingProjects: number;
  completedProjects: number;
  clueCount: number;
  complaintCount: number;
  blacklistCount: number;
  projectTypeStats: Array<{ type: string; count: number; amount: number }>;
  monthlyTrend: Array<{ month: string; count: number; amount: number }>;
  areaStats: Array<{ area: string; count: number }>;
}

export interface TodoItem {
  id: string;
  title: string;
  type: 'announcement' | 'complaint' | 'clue' | 'warning';
  count: number;
  link: string;
}

export interface RiskWarning {
  id: string;
  title: string;
  level: RiskLevel;
  projectName?: string;
  createTime: string;
  description: string;
}

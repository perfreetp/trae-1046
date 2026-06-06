import type { ProjectType, ProjectStatus, AnnouncementType, AnnouncementStatus, BiddingStatus, ClueSource, RiskLevel, ClueStatus, ComplaintStatus, CreditLevel, MilestoneStatus } from '@/types';

export const PROJECT_TYPE_OPTIONS: { label: string; value: ProjectType }[] = [
  { label: '工程招投标', value: 'engineering' },
  { label: '政府采购', value: 'procurement' },
  { label: '产权交易', value: 'property' },
];

export const PROJECT_STATUS_OPTIONS: { label: string; value: ProjectStatus; color: string }[] = [
  { label: '已登记', value: 'registered', color: 'default' },
  { label: '已公告', value: 'announced', color: 'processing' },
  { label: '开标中', value: 'bidding', color: 'processing' },
  { label: '评标中', value: 'evaluating', color: 'processing' },
  { label: '已完成', value: 'completed', color: 'success' },
  { label: '合同备案', value: 'contract', color: 'processing' },
  { label: '履约中', value: 'performing', color: 'processing' },
];

export const ANNOUNCEMENT_TYPE_OPTIONS: { label: string; value: AnnouncementType }[] = [
  { label: '招标公告', value: 'bidding' },
  { label: '澄清公告', value: 'clarification' },
  { label: '中标公告', value: 'result' },
];

export const ANNOUNCEMENT_STATUS_OPTIONS: { label: string; value: AnnouncementStatus; color: string }[] = [
  { label: '待审核', value: 'pending', color: 'warning' },
  { label: '已通过', value: 'approved', color: 'success' },
  { label: '已驳回', value: 'rejected', color: 'error' },
];

export const BIDDING_STATUS_OPTIONS: { label: string; value: BiddingStatus; color: string }[] = [
  { label: '待开标', value: 'scheduled', color: 'default' },
  { label: '进行中', value: 'ongoing', color: 'processing' },
  { label: '已完成', value: 'completed', color: 'success' },
];

export const CLUE_SOURCE_OPTIONS: { label: string; value: ClueSource }[] = [
  { label: '系统发现', value: 'system' },
  { label: '人工标记', value: 'manual' },
  { label: '投诉举报', value: 'complaint' },
];

export const RISK_LEVEL_OPTIONS: { label: string; value: RiskLevel; color: string }[] = [
  { label: '高风险', value: 'high', color: 'error' },
  { label: '中风险', value: 'medium', color: 'warning' },
  { label: '低风险', value: 'low', color: 'success' },
];

export const CLUE_STATUS_OPTIONS: { label: string; value: ClueStatus; color: string }[] = [
  { label: '待处置', value: 'pending', color: 'warning' },
  { label: '处置中', value: 'processing', color: 'processing' },
  { label: '已闭环', value: 'closed', color: 'success' },
];

export const COMPLAINT_STATUS_OPTIONS: { label: string; value: ComplaintStatus; color: string }[] = [
  { label: '待受理', value: 'pending', color: 'warning' },
  { label: '处理中', value: 'processing', color: 'processing' },
  { label: '已答复', value: 'replied', color: 'processing' },
  { label: '已办结', value: 'closed', color: 'success' },
];

export const CREDIT_LEVEL_OPTIONS: { label: string; value: CreditLevel; color: string }[] = [
  { label: 'AAA', value: 'AAA', color: 'success' },
  { label: 'AA', value: 'AA', color: 'success' },
  { label: 'A', value: 'A', color: 'processing' },
  { label: 'B', value: 'B', color: 'default' },
  { label: 'C', value: 'C', color: 'warning' },
  { label: 'D', value: 'D', color: 'error' },
];

export const MILESTONE_STATUS_OPTIONS: { label: string; value: MilestoneStatus; color: string }[] = [
  { label: '未开始', value: 'pending', color: 'default' },
  { label: '进行中', value: 'in_progress', color: 'processing' },
  { label: '已完成', value: 'completed', color: 'success' },
  { label: '已延期', value: 'delayed', color: 'warning' },
];

export const MENU_ITEMS = [
  { key: '/', label: '监管首页', icon: 'Home' },
  { key: '/projects', label: '项目库', icon: 'FolderOpen' },
  { key: '/announcements', label: '公告审核', icon: 'FileCheck' },
  { key: '/bidding', label: '开评标监督', icon: 'Users' },
  { key: '/clues', label: '异常线索', icon: 'AlertTriangle' },
  { key: '/credit', label: '信用档案', icon: 'Award' },
  { key: '/statistics', label: '统计报表', icon: 'BarChart3' },
];

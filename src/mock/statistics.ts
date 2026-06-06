import type { StatisticsData } from '@/types';

export const mockStatisticsData: StatisticsData = {
  totalProjects: 156,
  totalAmount: 1586000000,
  ongoingProjects: 42,
  completedProjects: 98,
  clueCount: 23,
  complaintCount: 15,
  blacklistCount: 3,
  projectTypeStats: [
    { type: '工程招投标', count: 68, amount: 850000000 },
    { type: '政府采购', count: 52, amount: 286000000 },
    { type: '产权交易', count: 36, amount: 450000000 },
  ],
  monthlyTrend: [
    { month: '2026-01', count: 18, amount: 150000000 },
    { month: '2026-02', count: 22, amount: 180000000 },
    { month: '2026-03', count: 25, amount: 220000000 },
    { month: '2026-04', count: 28, amount: 260000000 },
    { month: '2026-05', count: 32, amount: 320000000 },
    { month: '2026-06', count: 31, amount: 456000000 },
  ],
  areaStats: [
    { area: '中心城区', count: 58 },
    { area: '东城区', count: 32 },
    { area: '西城区', count: 28 },
    { area: '南城区', count: 22 },
    { area: '北城区', count: 16 },
  ],
};

export const mockRecentActivities = [
  {
    id: 'RA001',
    type: 'project',
    title: '污水处理厂二期扩建工程完成项目登记',
    time: '2026-06-06 09:15:00',
  },
  {
    id: 'RA002',
    type: 'announcement',
    title: '智慧校园信息化建设项目招标公告已发布',
    time: '2026-06-05 16:30:00',
  },
  {
    id: 'RA003',
    type: 'clue',
    title: '系统发现新的围标串标风险线索',
    time: '2026-06-05 10:20:00',
  },
  {
    id: 'RA004',
    type: 'complaint',
    title: '收到关于城市道路绿化提升工程的投诉',
    time: '2026-06-04 11:20:00',
  },
  {
    id: 'RA005',
    type: 'credit',
    title: '华艺景观公司被列入黑名单',
    time: '2026-01-20 14:00:00',
  },
];

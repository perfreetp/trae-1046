import type { BiddingSession, JudgeExtraction } from '@/types';

export const mockBiddingSessions: BiddingSession[] = [
  {
    id: 'B001',
    projectId: 'P005',
    projectName: '智慧校园信息化建设项目',
    startTime: '2026-06-06 09:30:00',
    location: '市公共资源交易中心开标一室',
    status: 'scheduled',
    bondStatus: {
      total: 8,
      paid: 6,
      unpaid: 2,
      refunded: 0,
    },
  },
  {
    id: 'B002',
    projectId: 'P004',
    projectName: '城市道路绿化提升工程',
    startTime: '2026-06-05 14:00:00',
    location: '市公共资源交易中心开标二室',
    status: 'ongoing',
    bondStatus: {
      total: 12,
      paid: 12,
      unpaid: 0,
      refunded: 0,
    },
  },
  {
    id: 'B003',
    projectId: 'P002',
    projectName: '市直机关办公设备采购项目',
    startTime: '2026-06-04 10:00:00',
    location: '市公共资源交易中心开标三室',
    status: 'completed',
    bondStatus: {
      total: 6,
      paid: 6,
      unpaid: 0,
      refunded: 4,
    },
  },
  {
    id: 'B004',
    projectId: 'P006',
    projectName: '污水处理厂二期扩建工程',
    startTime: '2026-06-15 09:00:00',
    location: '市公共资源交易中心开标一室',
    status: 'scheduled',
    bondStatus: {
      total: 0,
      paid: 0,
      unpaid: 0,
      refunded: 0,
    },
  },
  {
    id: 'B005',
    projectId: 'P008',
    projectName: '老旧写字楼房产转让',
    startTime: '2026-06-08 15:30:00',
    location: '市产权交易中心拍卖大厅',
    status: 'scheduled',
    bondStatus: {
      total: 3,
      paid: 3,
      unpaid: 0,
      refunded: 0,
    },
  },
];

export const mockJudgeExtractions: JudgeExtraction[] = [
  {
    id: 'J001',
    projectId: 'P004',
    projectName: '城市道路绿化提升工程',
    extractTime: '2026-06-05 08:30:00',
    judges: [
      { id: 'E001', name: '张工', expertField: '园林绿化', isRecused: false },
      { id: 'E002', name: '李工', expertField: '工程造价', isRecused: false },
      { id: 'E003', name: '王工', expertField: '市政工程', isRecused: true, recuseReason: '与投标人有利害关系' },
      { id: 'E004', name: '赵工', expertField: '工程监理', isRecused: false },
      { id: 'E005', name: '刘工', expertField: '风景园林', isRecused: false },
    ],
    operator: '系统管理员',
  },
  {
    id: 'J002',
    projectId: 'P002',
    projectName: '市直机关办公设备采购项目',
    extractTime: '2026-06-04 09:00:00',
    judges: [
      { id: 'E006', name: '陈工', expertField: '信息技术', isRecused: false },
      { id: 'E007', name: '周工', expertField: '计算机硬件', isRecused: false },
      { id: 'E008', name: '吴工', expertField: '网络工程', isRecused: false },
      { id: 'E009', name: '郑工', expertField: '信息安全', isRecused: false },
      { id: 'E010', name: '孙工', expertField: '政府采购', isRecused: false },
    ],
    operator: '系统管理员',
  },
];

export const mockEvaluationRecords = [
  {
    id: 'ER001',
    projectId: 'P002',
    projectName: '市直机关办公设备采购项目',
    stage: '资格审查',
    time: '2026-06-04 10:30:00',
    operator: '评标委员会',
    content: '对6家投标人进行资格审查，全部通过',
  },
  {
    id: 'ER002',
    projectId: 'P002',
    projectName: '市直机关办公设备采购项目',
    stage: '技术评审',
    time: '2026-06-04 11:00:00',
    operator: '评标委员会',
    content: '对技术方案进行评审打分',
  },
  {
    id: 'ER003',
    projectId: 'P002',
    projectName: '市直机关办公设备采购项目',
    stage: '价格评审',
    time: '2026-06-04 14:00:00',
    operator: '评标委员会',
    content: '开启投标报价，进行价格分计算',
  },
  {
    id: 'ER004',
    projectId: 'P002',
    projectName: '市直机关办公设备采购项目',
    stage: '汇总打分',
    time: '2026-06-04 15:00:00',
    operator: '评标委员会',
    content: '汇总各评委打分，确定中标候选人',
  },
];

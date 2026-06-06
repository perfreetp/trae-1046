import React, { useState, useMemo } from 'react';
import {
  Row,
  Col,
  Card,
  Button,
  Select,
  DatePicker,
  Table,
  Modal,
  Tag,
  Space,
  Dropdown,
  MenuProps,
  message,
  Divider,
  List,
} from 'antd';
import {
  Download,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  MessageSquare,
  FileText,
  HandshakeIcon,
  TrendingUp as ProgressIcon,
  ClipboardCheck,
} from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import type { ColumnsType } from 'antd/es/table';
import type { Project, Contract, Clue, Complaint, Announcement } from '@/types';
import {
  PROJECT_TYPE_OPTIONS,
  PROJECT_STATUS_OPTIONS,
  ANNOUNCEMENT_TYPE_OPTIONS,
  ANNOUNCEMENT_STATUS_OPTIONS,
  CLUE_SOURCE_OPTIONS,
  RISK_LEVEL_OPTIONS,
  COMPLAINT_STATUS_OPTIONS,
  MILESTONE_STATUS_OPTIONS,
} from '@/utils/constants';
import { formatMoney, formatDateTime, formatDate } from '@/utils/format';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

const mockProjects: Project[] = [
  {
    id: 'P001', name: '市民服务中心装修工程', code: 'GC-2026-001',
    type: 'engineering', budget: 25000000, purchaser: '市政务服务管理局',
    agency: '市政府采购中心', status: 'completed', registerDate: '2026-01-15',
    description: '', attachments: [],
  },
  {
    id: 'P002', name: '市属医院医疗设备采购项目', code: 'CG-2026-005',
    type: 'procurement', budget: 15800000, purchaser: '市卫生健康委员会',
    agency: '市政府采购中心', status: 'performing', registerDate: '2026-02-20',
    description: '', attachments: [],
  },
  {
    id: 'P003', name: '工业园区标准厂房产权转让', code: 'CQ-2026-003',
    type: 'property', budget: 85000000, purchaser: '市工业园区管委会',
    agency: '市产权交易中心', status: 'contract', registerDate: '2026-03-10',
    description: '', attachments: [],
  },
  {
    id: 'P004', name: '城市道路绿化提升工程', code: 'GC-2026-012',
    type: 'engineering', budget: 12000000, purchaser: '市园林绿化局',
    agency: '市公共资源交易中心', status: 'announced', registerDate: '2026-04-05',
    description: '', attachments: [],
  },
  {
    id: 'P005', name: '智慧校园信息化建设项目', code: 'CG-2026-018',
    type: 'procurement', budget: 6800000, purchaser: '市教育局',
    agency: '市政府采购中心', status: 'bidding', registerDate: '2026-04-15',
    description: '', attachments: [],
  },
  {
    id: 'P006', name: '污水处理厂二期扩建工程', code: 'GC-2026-020',
    type: 'engineering', budget: 38000000, purchaser: '市水务局',
    agency: '市公共资源交易中心', status: 'registered', registerDate: '2026-05-08',
    description: '', attachments: [],
  },
  {
    id: 'P007', name: '公立医院医疗设备集中采购', code: 'CG-2026-025',
    type: 'procurement', budget: 18500000, purchaser: '市公立医院管理中心',
    agency: '市政府采购中心', status: 'registered', registerDate: '2026-05-18',
    description: '', attachments: [],
  },
  {
    id: 'P008', name: '老旧写字楼房产转让', code: 'CQ-2026-008',
    type: 'property', budget: 45000000, purchaser: '市机关事务管理局',
    agency: '市产权交易中心', status: 'completed', registerDate: '2026-03-25',
    description: '', attachments: [],
  },
];

const mockContracts: Contract[] = [
  {
    id: 'C001', projectId: 'P002', projectName: '市属医院医疗设备采购项目',
    contractNo: 'HT-2026-025', contractAmount: 15600000,
    partyA: '市卫生健康委员会', partyB: '市医疗器械有限公司',
    signDate: '2026-04-10', startDate: '2026-04-15', endDate: '2026-07-15',
    content: '', attachments: [], performanceProgress: 30, milestones: [],
  },
  {
    id: 'C002', projectId: 'P003', projectName: '工业园区标准厂房产权转让',
    contractNo: 'HT-2026-038', contractAmount: 84500000,
    partyA: '市工业园区管委会', partyB: '市产业投资集团有限公司',
    signDate: '2026-05-15', startDate: '2026-05-15', endDate: '2026-08-15',
    content: '', attachments: [], performanceProgress: 25, milestones: [],
  },
  {
    id: 'C003', projectId: 'P001', projectName: '市民服务中心装修工程',
    contractNo: 'HT-2026-008', contractAmount: 24800000,
    partyA: '市政务服务管理局', partyB: '市建筑工程有限公司',
    signDate: '2026-02-10', startDate: '2026-02-15', endDate: '2026-08-15',
    content: '', attachments: [], performanceProgress: 100, milestones: [],
  },
  {
    id: 'C004', projectId: 'P008', projectName: '老旧写字楼房产转让',
    contractNo: 'HT-2026-015', contractAmount: 44800000,
    partyA: '市机关事务管理局', partyB: '市商业投资有限公司',
    signDate: '2026-04-20', startDate: '2026-04-20', endDate: '2026-07-20',
    content: '', attachments: [], performanceProgress: 100, milestones: [],
  },
];

const mockAnnouncements: Announcement[] = [
  {
    id: 'A001', projectId: 'P006', projectName: '污水处理厂二期扩建工程',
    title: '污水处理厂二期扩建工程招标公告', type: 'bidding',
    content: '', submitTime: '2026-05-10 09:30:00', status: 'pending', reviewer: '',
  },
  {
    id: 'A002', projectId: 'P004', projectName: '城市道路绿化提升工程',
    title: '城市道路绿化提升工程中标公告', type: 'result',
    content: '', submitTime: '2026-05-05 14:20:00', status: 'approved', reviewer: '张三',
    reviewTime: '2026-05-06 10:00:00', reviewOpinion: '公告内容符合要求，同意发布',
  },
  {
    id: 'A003', projectId: 'P005', projectName: '智慧校园信息化建设项目',
    title: '智慧校园信息化建设项目澄清公告', type: 'clarification',
    content: '', submitTime: '2026-05-15 16:45:00', status: 'approved', reviewer: '李四',
    reviewTime: '2026-05-16 09:15:00', reviewOpinion: '澄清内容合规，同意发布',
  },
  {
    id: 'A004', projectId: 'P007', projectName: '公立医院医疗设备集中采购',
    title: '公立医院医疗设备集中采购招标公告', type: 'bidding',
    content: '', submitTime: '2026-05-22 11:00:00', status: 'rejected', reviewer: '王五',
    reviewTime: '2026-05-23 15:30:00', reviewOpinion: '资格条件中存在限制性条款，建议修改',
  },
  {
    id: 'A005', projectId: 'P008', projectName: '老旧写字楼房产转让',
    title: '老旧写字楼房产转让公告', type: 'bidding',
    content: '', submitTime: '2026-04-10 10:00:00', status: 'approved', reviewer: '赵六',
    reviewTime: '2026-04-11 14:00:00', reviewOpinion: '材料齐全，程序合规，同意发布',
  },
];

const mockClues: Clue[] = [
  {
    id: 'CL001', projectId: 'P004', projectName: '城市道路绿化提升工程',
    title: '多家投标单位报价异常接近', description: '5家投标单位报价差异不足1%，涉嫌围标串标',
    source: 'system', riskLevel: 'high', status: 'processing',
    relatedCompanies: ['A公司', 'B公司', 'C公司', 'D公司', 'E公司'],
    createTime: '2026-05-12 10:30:00',
  },
  {
    id: 'CL002', projectId: 'P002', projectName: '市属医院医疗设备采购项目',
    title: '投标单位负责人关系异常', description: '系统检测到两家投标单位法人为夫妻关系',
    source: 'system', riskLevel: 'high', status: 'pending',
    relatedCompanies: ['甲公司', '乙公司'],
    createTime: '2026-05-08 14:20:00',
  },
  {
    id: 'CL003', title: '代理机构人员违规接触投标人',
    description: '有举报称某代理机构项目负责人私下接触潜在投标人',
    source: 'complaint', riskLevel: 'medium', status: 'closed',
    relatedCompanies: [],
    createTime: '2026-04-25 09:15:00',
    handler: '李监管', handleTime: '2026-05-05 16:00:00',
    handleResult: '经核查，情况不属实，予以结案',
  },
  {
    id: 'CL004', projectId: 'P007', projectName: '公立医院医疗设备集中采购',
    title: '技术参数指向特定品牌', description: '招标文件中多项技术参数仅有某品牌满足',
    source: 'manual', riskLevel: 'medium', status: 'pending',
    relatedCompanies: [],
    createTime: '2026-05-25 11:00:00',
  },
];

const mockComplaints: Complaint[] = [
  {
    id: 'CP001', projectId: 'P004', projectName: '城市道路绿化提升工程',
    title: '中标单位业绩造假', content: '投诉人称中标单位提供的类似项目业绩存在造假',
    complainant: '某园林绿化公司', contact: '138****8888',
    submitTime: '2026-05-08 09:00:00', status: 'processing',
    handler: '张监管',
  },
  {
    id: 'CP002', projectId: 'P002', projectName: '市属医院医疗设备采购项目',
    title: '评标过程不公正', content: '投诉人称评标专家存在倾向性打分',
    complainant: '某医疗设备公司', contact: '139****9999',
    submitTime: '2026-05-15 14:30:00', status: 'pending',
  },
  {
    id: 'CP003', projectId: 'P001', projectName: '市民服务中心装修工程',
    title: '工程量计算有误', content: '投诉人称结算工程量与实际不符',
    complainant: '某装修公司', contact: '137****7777',
    submitTime: '2026-03-20 10:00:00', status: 'replied',
    handler: '王监管', replyContent: '已委托第三方造价机构复核，工程量计算无误',
    replyTime: '2026-04-02 15:00:00',
  },
  {
    id: 'CP004', title: '交易平台系统故障', content: '开标当日系统频繁掉线，影响正常投标',
    projectId: '', projectName: '',
    complainant: '匿名', contact: '',
    submitTime: '2026-04-10 16:00:00', status: 'closed',
    handler: '技术部门',
    replyContent: '已排查系统故障原因，优化了服务器配置',
    replyTime: '2026-04-15 10:00:00',
  },
];

type DrillDownType = 'projects' | 'contracts' | 'clues' | 'complaints' | 'announcements' | null;

const Statistics: React.FC = () => {
  const [projectTypeFilter, setProjectTypeFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  const [drillDownType, setDrillDownType] = useState<DrillDownType>(null);
  const [drillDownTitle, setDrillDownTitle] = useState<string>('');
  const [detailModalType, setDetailModalType] = useState<'project' | 'contract' | 'clue' | 'complaint' | 'announcement' | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<any>(null);

  const filteredProjects = useMemo(() => {
    return mockProjects.filter((p) => {
      const matchType = projectTypeFilter === 'all' || p.type === projectTypeFilter;
      let matchDate = true;
      if (dateRange && dateRange[0] && dateRange[1]) {
        const registerDate = dayjs(p.registerDate);
        matchDate = registerDate.isAfter(dateRange[0]) && registerDate.isBefore(dateRange[1]);
      }
      return matchType && matchDate;
    });
  }, [projectTypeFilter, dateRange]);

  const filteredContracts = useMemo(() => {
    return mockContracts.filter((c) => {
      const project = mockProjects.find((p) => p.id === c.projectId);
      const matchType = !project || projectTypeFilter === 'all' || project.type === projectTypeFilter;
      let matchDate = true;
      if (dateRange && dateRange[0] && dateRange[1]) {
        const signDate = dayjs(c.signDate);
        matchDate = signDate.isAfter(dateRange[0]) && signDate.isBefore(dateRange[1]);
      }
      return matchType && matchDate;
    });
  }, [projectTypeFilter, dateRange]);

  const filteredAnnouncements = useMemo(() => {
    return mockAnnouncements.filter((a) => {
      let matchDate = true;
      if (dateRange && dateRange[0] && dateRange[1]) {
        const submitTime = dayjs(a.submitTime);
        matchDate = submitTime.isAfter(dateRange[0]) && submitTime.isBefore(dateRange[1]);
      }
      return matchDate;
    });
  }, [dateRange]);

  const filteredClues = useMemo(() => {
    return mockClues.filter((c) => {
      let matchDate = true;
      if (dateRange && dateRange[0] && dateRange[1]) {
        const createTime = dayjs(c.createTime);
        matchDate = createTime.isAfter(dateRange[0]) && createTime.isBefore(dateRange[1]);
      }
      return matchDate;
    });
  }, [dateRange]);

  const filteredComplaints = useMemo(() => {
    return mockComplaints.filter((c) => {
      let matchDate = true;
      if (dateRange && dateRange[0] && dateRange[1]) {
        const submitTime = dayjs(c.submitTime);
        matchDate = submitTime.isAfter(dateRange[0]) && submitTime.isBefore(dateRange[1]);
      }
      return matchDate;
    });
  }, [dateRange]);

  const stats = useMemo(() => {
    const totalAmount = filteredProjects.reduce((sum, p) => sum + p.budget, 0);
    const completedCount = filteredProjects.filter((p) => p.status === 'completed').length;
    return {
      totalProjects: filteredProjects.length,
      totalAmount,
      completedProjects: completedCount,
      completionRate: filteredProjects.length > 0 ? Math.round((completedCount / filteredProjects.length) * 100) : 0,
      clueCount: filteredClues.length,
      pendingClues: filteredClues.filter((c) => c.status === 'pending').length,
      complaintCount: filteredComplaints.length,
      pendingComplaints: filteredComplaints.filter((c) => c.status === 'pending').length,
      contractCount: filteredContracts.length,
      contractAmount: filteredContracts.reduce((sum, c) => sum + c.contractAmount, 0),
    };
  }, [filteredProjects, filteredClues, filteredComplaints, filteredContracts]);

  const projectTypeChartOption = useMemo(() => {
    const statsByType = PROJECT_TYPE_OPTIONS.map((type) => {
      const count = filteredProjects.filter((p) => p.type === type.value).length;
      const amount = filteredProjects
        .filter((p) => p.type === type.value)
        .reduce((sum, p) => sum + p.budget, 0);
      return { name: type.label, count, amount: amount / 10000 };
    });
    return {
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: { data: ['项目数', '交易金额(万元)'] },
      xAxis: { type: 'category', data: statsByType.map((d) => d.name) },
      yAxis: [{ type: 'value', name: '项目数' }, { type: 'value', name: '金额(万元)' }],
      series: [
        { name: '项目数', type: 'bar', data: statsByType.map((d) => d.count) },
        { name: '交易金额(万元)', type: 'bar', yAxisIndex: 1, data: statsByType.map((d) => d.amount) },
      ],
    };
  }, [filteredProjects]);

  const monthlyTrendOption = useMemo(() => {
    const months = ['2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06'];
    return {
      tooltip: { trigger: 'axis' },
      legend: { data: ['项目数', '交易额(万元)'] },
      xAxis: { type: 'category', boundaryGap: false, data: months },
      yAxis: [{ type: 'value', name: '项目数' }, { type: 'value', name: '金额(万元)' }],
      series: [
        {
          name: '项目数',
          type: 'line',
          smooth: true,
          data: [1, 1, 2, 2, 2, 0],
        },
        {
          name: '交易额(万元)',
          type: 'line',
          smooth: true,
          yAxisIndex: 1,
          data: [2500, 1580, 13000, 6380, 6330, 0],
        },
      ],
    };
  }, []);

  const handleDrillDown = (type: DrillDownType, title: string) => {
    setDrillDownType(type);
    setDrillDownTitle(title);
  };

  const exportToCSV = (
    data: any[],
    filename: string,
    headers: string[],
    keys: string[],
    formatters?: Record<string, (value: any) => string>
  ) => {
    const csvContent = [
      headers.join(','),
      ...data.map((row) =>
        keys
          .map((key) => {
            let value = row[key];
            if (formatters && formatters[key]) {
              value = formatters[key](value);
            }
            if (typeof value === 'string' && value.includes(',')) {
              value = `"${value}"`;
            }
            return value ?? '';
          })
          .join(',')
      ),
    ].join('\n');

    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}_${dayjs().format('YYYYMMDD_HHmmss')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    message.success('导出成功');
  };

  const exportMenuItems: MenuProps['items'] = [
    {
      key: 'projects',
      label: '项目明细报表',
      icon: <FileText size={14} />,
      onClick: () => {
        exportToCSV(
          filteredProjects,
          '项目明细报表',
          ['项目编号', '项目名称', '交易类型', '预算金额', '采购人', '登记日期', '状态'],
          ['code', 'name', 'type', 'budget', 'purchaser', 'registerDate', 'status'],
          {
            type: (v) => PROJECT_TYPE_OPTIONS.find((o) => o.value === v)?.label || v,
            budget: (v) => formatMoney(v),
            status: (v) => PROJECT_STATUS_OPTIONS.find((o) => o.value === v)?.label || v,
          }
        );
      },
    },
    {
      key: 'contracts',
      label: '合同明细报表',
      icon: <HandshakeIcon size={14} />,
      onClick: () => {
        exportToCSV(
          filteredContracts,
          '合同明细报表',
          ['合同编号', '项目名称', '合同金额', '甲方', '乙方', '签订日期', '履约进度'],
          ['contractNo', 'projectName', 'contractAmount', 'partyA', 'partyB', 'signDate', 'performanceProgress'],
          {
            contractAmount: (v) => formatMoney(v),
            performanceProgress: (v) => `${v}%`,
          }
        );
      },
    },
    {
      key: 'announcements',
      label: '公告审核记录',
      icon: <ClipboardCheck size={14} />,
      onClick: () => {
        exportToCSV(
          filteredAnnouncements,
          '公告审核记录',
          ['公告标题', '项目名称', '公告类型', '提交时间', '状态', '审核人', '审核时间'],
          ['title', 'projectName', 'type', 'submitTime', 'status', 'reviewer', 'reviewTime'],
          {
            type: (v) => ANNOUNCEMENT_TYPE_OPTIONS.find((o) => o.value === v)?.label || v,
            status: (v) => ANNOUNCEMENT_STATUS_OPTIONS.find((o) => o.value === v)?.label || v,
          }
        );
      },
    },
    {
      key: 'clues',
      label: '异常线索报表',
      icon: <AlertTriangle size={14} />,
      onClick: () => {
        exportToCSV(
          filteredClues,
          '异常线索报表',
          ['线索标题', '关联项目', '来源', '风险等级', '状态', '创建时间', '处理人'],
          ['title', 'projectName', 'source', 'riskLevel', 'status', 'createTime', 'handler'],
          {
            source: (v) => CLUE_SOURCE_OPTIONS.find((o) => o.value === v)?.label || v,
            riskLevel: (v) => RISK_LEVEL_OPTIONS.find((o) => o.value === v)?.label || v,
          }
        );
      },
    },
    {
      key: 'complaints',
      label: '异议投诉报表',
      icon: <MessageSquare size={14} />,
      onClick: () => {
        exportToCSV(
          filteredComplaints,
          '异议投诉报表',
          ['投诉标题', '关联项目', '投诉人', '提交时间', '状态', '处理人'],
          ['title', 'projectName', 'complainant', 'submitTime', 'status', 'handler'],
          {
            status: (v) => COMPLAINT_STATUS_OPTIONS.find((o) => o.value === v)?.label || v,
          }
        );
      },
    },
    {
      key: 'performance',
      label: '履约进度报表',
      icon: <ProgressIcon size={14} />,
      onClick: () => {
        const performanceData = filteredContracts.flatMap((c) =>
          c.milestones.map((m) => ({
            contractNo: c.contractNo,
            projectName: c.projectName,
            milestoneName: m.name,
            planDate: m.planDate,
            actualDate: m.actualDate || '-',
            status: m.status,
          }))
        );
        exportToCSV(
          performanceData.length > 0 ? performanceData : filteredContracts.map((c) => ({
            contractNo: c.contractNo,
            projectName: c.projectName,
            progress: c.performanceProgress,
            milestoneCount: c.milestones.length,
          })),
          '履约进度报表',
          performanceData.length > 0
            ? ['合同编号', '项目名称', '里程碑名称', '计划日期', '实际日期', '状态']
            : ['合同编号', '项目名称', '履约进度', '里程碑总数'],
          performanceData.length > 0
            ? ['contractNo', 'projectName', 'milestoneName', 'planDate', 'actualDate', 'status']
            : ['contractNo', 'projectName', 'progress', 'milestoneCount'],
          performanceData.length > 0
            ? {
                status: (v) => MILESTONE_STATUS_OPTIONS.find((o) => o.value === v)?.label || v,
              }
            : {
                progress: (v) => `${v}%`,
              }
        );
      },
    },
  ];

  const renderDrillDownTable = () => {
    if (drillDownType === 'projects') {
      const columns: ColumnsType<Project> = [
        { title: '项目编号', dataIndex: 'code', width: 120 },
        { title: '项目名称', dataIndex: 'name', ellipsis: true },
        { title: '类型', dataIndex: 'type', width: 100, render: (v) => PROJECT_TYPE_OPTIONS.find((o) => o.value === v)?.label },
        { title: '预算金额', dataIndex: 'budget', width: 120, render: (v) => formatMoney(v) },
        { title: '采购人', dataIndex: 'purchaser', width: 160 },
        { title: '登记日期', dataIndex: 'registerDate', width: 110, render: (v) => formatDate(v) },
        { title: '状态', dataIndex: 'status', width: 100, render: (v) => PROJECT_STATUS_OPTIONS.find((o) => o.value === v)?.label },
        {
          title: '操作',
          key: 'action',
          width: 80,
          fixed: 'right' as const,
          render: (_, record) => (
            <Button
              type="link"
              size="small"
              onClick={() => {
                setSelectedDetail(record);
                setDetailModalType('project');
              }}
            >
              查看
            </Button>
          ),
        },
      ];
      return <Table columns={columns} dataSource={filteredProjects} rowKey="id" scroll={{ x: 1000 }} pagination={{ pageSize: 10 }} />;
    }

    if (drillDownType === 'contracts') {
      const columns: ColumnsType<Contract> = [
        { title: '合同编号', dataIndex: 'contractNo', width: 120 },
        { title: '项目名称', dataIndex: 'projectName', ellipsis: true },
        { title: '合同金额', dataIndex: 'contractAmount', width: 120, render: (v) => formatMoney(v) },
        { title: '甲方', dataIndex: 'partyA', width: 150 },
        { title: '乙方', dataIndex: 'partyB', width: 150 },
        { title: '签订日期', dataIndex: 'signDate', width: 110, render: (v) => formatDate(v) },
        { title: '履约进度', dataIndex: 'performanceProgress', width: 100, render: (v) => `${v}%` },
        {
          title: '操作',
          key: 'action',
          width: 80,
          fixed: 'right' as const,
          render: (_, record) => (
            <Button
              type="link"
              size="small"
              onClick={() => {
                setSelectedDetail(record);
                setDetailModalType('contract');
              }}
            >
              查看
            </Button>
          ),
        },
      ];
      return <Table columns={columns} dataSource={filteredContracts} rowKey="id" scroll={{ x: 1000 }} pagination={{ pageSize: 10 }} />;
    }

    if (drillDownType === 'announcements') {
      const columns: ColumnsType<Announcement> = [
        { title: '公告标题', dataIndex: 'title', ellipsis: true },
        { title: '项目名称', dataIndex: 'projectName', width: 180, ellipsis: true },
        { title: '类型', dataIndex: 'type', width: 100, render: (v) => ANNOUNCEMENT_TYPE_OPTIONS.find((o) => o.value === v)?.label },
        { title: '提交时间', dataIndex: 'submitTime', width: 160, render: (v) => formatDateTime(v) },
        { title: '状态', dataIndex: 'status', width: 100, render: (v) => ANNOUNCEMENT_STATUS_OPTIONS.find((o) => o.value === v)?.label },
        { title: '审核人', dataIndex: 'reviewer', width: 100, render: (v) => v || '-' },
        {
          title: '操作',
          key: 'action',
          width: 80,
          fixed: 'right' as const,
          render: (_, record) => (
            <Button
              type="link"
              size="small"
              onClick={() => {
                setSelectedDetail(record);
                setDetailModalType('announcement');
              }}
            >
              查看
            </Button>
          ),
        },
      ];
      return <Table columns={columns} dataSource={filteredAnnouncements} rowKey="id" scroll={{ x: 1100 }} pagination={{ pageSize: 10 }} />;
    }

    if (drillDownType === 'clues') {
      const columns: ColumnsType<Clue> = [
        { title: '线索标题', dataIndex: 'title', ellipsis: true },
        { title: '关联项目', dataIndex: 'projectName', width: 180, ellipsis: true, render: (v) => v || '-' },
        { title: '来源', dataIndex: 'source', width: 100, render: (v) => CLUE_SOURCE_OPTIONS.find((o) => o.value === v)?.label },
        { title: '风险等级', dataIndex: 'riskLevel', width: 100, render: (v) => RISK_LEVEL_OPTIONS.find((o) => o.value === v)?.label },
        { title: '状态', dataIndex: 'status', width: 100, render: (v) => {
          const opt = CLUE_SOURCE_OPTIONS.find((o) => o.value === v);
          return opt ? <Tag color={opt.color}>{opt.label}</Tag> : v;
        } },
        { title: '创建时间', dataIndex: 'createTime', width: 160, render: (v) => formatDateTime(v) },
        {
          title: '操作',
          key: 'action',
          width: 80,
          fixed: 'right' as const,
          render: (_, record) => (
            <Button
              type="link"
              size="small"
              onClick={() => {
                setSelectedDetail(record);
                setDetailModalType('clue');
              }}
            >
              查看
            </Button>
          ),
        },
      ];
      return <Table columns={columns} dataSource={filteredClues} rowKey="id" scroll={{ x: 1100 }} pagination={{ pageSize: 10 }} />;
    }

    if (drillDownType === 'complaints') {
      const columns: ColumnsType<Complaint> = [
        { title: '投诉标题', dataIndex: 'title', ellipsis: true },
        { title: '关联项目', dataIndex: 'projectName', width: 180, ellipsis: true, render: (v) => v || '-' },
        { title: '投诉人', dataIndex: 'complainant', width: 120 },
        { title: '提交时间', dataIndex: 'submitTime', width: 160, render: (v) => formatDateTime(v) },
        { title: '状态', dataIndex: 'status', width: 100, render: (v) => COMPLAINT_STATUS_OPTIONS.find((o) => o.value === v)?.label },
        { title: '处理人', dataIndex: 'handler', width: 100, render: (v) => v || '-' },
        {
          title: '操作',
          key: 'action',
          width: 80,
          fixed: 'right' as const,
          render: (_, record) => (
            <Button
              type="link"
              size="small"
              onClick={() => {
                setSelectedDetail(record);
                setDetailModalType('complaint');
              }}
            >
              查看
            </Button>
          ),
        },
      ];
      return <Table columns={columns} dataSource={filteredComplaints} rowKey="id" scroll={{ x: 1100 }} pagination={{ pageSize: 10 }} />;
    }

    return null;
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <Row gutter={[16, 16]} align="middle">
          <Col>
            <Space>
              <span className="text-gray-600">项目类型：</span>
              <Select
                defaultValue="all"
                style={{ width: 140 }}
                onChange={(value) => setProjectTypeFilter(value)}
                value={projectTypeFilter}
              >
                <Option value="all">全部类型</Option>
                {PROJECT_TYPE_OPTIONS.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
              <span className="text-gray-600">日期范围：</span>
              <RangePicker
                onChange={(dates) => setDateRange(dates as [dayjs.Dayjs | null, dayjs.Dayjs | null] | null)}
              />
            </Space>
          </Col>
          <Col flex="auto" />
          <Col>
            <Dropdown menu={{ items: exportMenuItems }} placement="bottomRight">
              <Button type="primary" icon={<Download size={16} />}>
                导出报表
              </Button>
            </Dropdown>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card
            className="shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleDrillDown('projects', '项目明细')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">总项目数</p>
                <p className="text-3xl font-bold text-primary-600 mt-1">{stats.totalProjects}</p>
                <p className="text-xs text-green-600 mt-2">较上月 +12.5%</p>
              </div>
              <div className="p-3 bg-primary-50 rounded-full">
                <BarChart3 size={28} className="text-primary-500" />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            className="shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleDrillDown('contracts', '合同明细')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">总交易额</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{(stats.totalAmount / 100000000).toFixed(2)}亿</p>
                <p className="text-xs text-green-600 mt-2">较上月 +8.3%</p>
              </div>
              <div className="p-3 bg-green-50 rounded-full">
                <TrendingUp size={28} className="text-green-500" />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            className="shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleDrillDown('clues', '异常线索明细')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">异常线索</p>
                <p className="text-3xl font-bold text-orange-600 mt-1">{stats.clueCount}</p>
                <p className="text-xs text-orange-600 mt-2">待处理 {stats.pendingClues} 条</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-full">
                <AlertTriangle size={28} className="text-orange-500" />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            className="shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleDrillDown('complaints', '异议投诉明细')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">异议投诉</p>
                <p className="text-3xl font-bold text-red-600 mt-1">{stats.complaintCount}</p>
                <p className="text-xs text-red-600 mt-2">待处理 {stats.pendingComplaints} 条</p>
              </div>
              <div className="p-3 bg-red-50 rounded-full">
                <MessageSquare size={28} className="text-red-500" />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="按交易类型统计" className="shadow-sm">
            <ReactECharts option={projectTypeChartOption} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="月度趋势" className="shadow-sm">
            <ReactECharts option={monthlyTrendOption} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>

      <Card title="快速统计" className="shadow-sm">
        <Row gutter={16}>
          <Col span={8}>
            <List
              size="small"
              header={<div className="font-medium text-gray-700">项目完成情况</div>}
              dataSource={[
                { label: '已完成项目', value: stats.completedProjects },
                { label: '完成率', value: `${stats.completionRate}%` },
                { label: '进行中项目', value: stats.totalProjects - stats.completedProjects },
              ]}
              renderItem={(item) => (
                <List.Item>
                  <span className="text-gray-600">{item.label}</span>
                  <span className="font-medium">{item.value}</span>
                </List.Item>
              )}
            />
          </Col>
          <Col span={8}>
            <List
              size="small"
              header={<div className="font-medium text-gray-700">合同情况</div>}
              dataSource={[
                { label: '合同总数', value: stats.contractCount },
                { label: '合同总金额', value: formatMoney(stats.contractAmount) },
                { label: '平均合同额', value: formatMoney(stats.contractCount > 0 ? stats.contractAmount / stats.contractCount : 0) },
              ]}
              renderItem={(item) => (
                <List.Item>
                  <span className="text-gray-600">{item.label}</span>
                  <span className="font-medium">{item.value}</span>
                </List.Item>
              )}
            />
          </Col>
          <Col span={8}>
            <List
              size="small"
              header={<div className="font-medium text-gray-700">审核情况</div>}
              dataSource={[
                { label: '公告总数', value: filteredAnnouncements.length },
                { label: '已通过', value: filteredAnnouncements.filter((a) => a.status === 'approved').length },
                { label: '待审核', value: filteredAnnouncements.filter((a) => a.status === 'pending').length },
              ]}
              renderItem={(item) => (
                <List.Item>
                  <span className="text-gray-600">{item.label}</span>
                  <span className="font-medium">{item.value}</span>
                </List.Item>
              )}
            />
          </Col>
        </Row>
      </Card>

      <Modal
        title={drillDownTitle}
        open={drillDownType !== null}
        onCancel={() => setDrillDownType(null)}
        footer={null}
        width={1200}
      >
        {renderDrillDownTable()}
      </Modal>

      <Modal
        title={
          detailModalType === 'project' ? '项目详情' :
          detailModalType === 'contract' ? '合同详情' :
          detailModalType === 'clue' ? '线索详情' :
          detailModalType === 'complaint' ? '投诉详情' :
          detailModalType === 'announcement' ? '公告详情' : '详情'
        }
        open={detailModalType !== null}
        onCancel={() => {
          setDetailModalType(null);
          setSelectedDetail(null);
        }}
        footer={null}
        width={800}
      >
        {selectedDetail && detailModalType === 'project' && (
          <Descriptions column={2} bordered size="small">
            <Descriptions.Item label="项目名称" span={2}>{selectedDetail.name}</Descriptions.Item>
            <Descriptions.Item label="项目编号">{selectedDetail.code}</Descriptions.Item>
            <Descriptions.Item label="交易类型">
              {PROJECT_TYPE_OPTIONS.find((o) => o.value === selectedDetail.type)?.label}
            </Descriptions.Item>
            <Descriptions.Item label="预算金额">{formatMoney(selectedDetail.budget)}</Descriptions.Item>
            <Descriptions.Item label="状态">
              {PROJECT_STATUS_OPTIONS.find((o) => o.value === selectedDetail.status)?.label}
            </Descriptions.Item>
            <Descriptions.Item label="采购人">{selectedDetail.purchaser}</Descriptions.Item>
            <Descriptions.Item label="代理机构">{selectedDetail.agency}</Descriptions.Item>
            <Descriptions.Item label="登记日期">{formatDate(selectedDetail.registerDate)}</Descriptions.Item>
            <Descriptions.Item label="项目描述" span={2}>
              {selectedDetail.description || '无'}
            </Descriptions.Item>
          </Descriptions>
        )}
        {selectedDetail && detailModalType === 'contract' && (
          <Descriptions column={2} bordered size="small">
            <Descriptions.Item label="合同编号" span={2}>{selectedDetail.contractNo}</Descriptions.Item>
            <Descriptions.Item label="项目名称" span={2}>{selectedDetail.projectName}</Descriptions.Item>
            <Descriptions.Item label="合同金额">{formatMoney(selectedDetail.contractAmount)}</Descriptions.Item>
            <Descriptions.Item label="履约进度">{selectedDetail.performanceProgress}%</Descriptions.Item>
            <Descriptions.Item label="甲方">{selectedDetail.partyA}</Descriptions.Item>
            <Descriptions.Item label="乙方">{selectedDetail.partyB}</Descriptions.Item>
            <Descriptions.Item label="签订日期">{formatDate(selectedDetail.signDate)}</Descriptions.Item>
            <Descriptions.Item label="履行期限">
              {formatDate(selectedDetail.startDate)} ~ {formatDate(selectedDetail.endDate)}
            </Descriptions.Item>
            <Descriptions.Item label="合同内容" span={2}>
              {selectedDetail.content || '无'}
            </Descriptions.Item>
          </Descriptions>
        )}
        {selectedDetail && detailModalType === 'clue' && (
          <Descriptions column={2} bordered size="small">
            <Descriptions.Item label="线索标题" span={2}>{selectedDetail.title}</Descriptions.Item>
            <Descriptions.Item label="关联项目">{selectedDetail.projectName || '-'}</Descriptions.Item>
            <Descriptions.Item label="来源">
              {CLUE_SOURCE_OPTIONS.find((o) => o.value === selectedDetail.source)?.label}
            </Descriptions.Item>
            <Descriptions.Item label="风险等级">
              {RISK_LEVEL_OPTIONS.find((o) => o.value === selectedDetail.riskLevel)?.label}
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              {selectedDetail.status}
            </Descriptions.Item>
            <Descriptions.Item label="创建时间">{formatDateTime(selectedDetail.createTime)}</Descriptions.Item>
            <Descriptions.Item label="线索描述" span={2}>{selectedDetail.description}</Descriptions.Item>
            {selectedDetail.handler && (
              <>
                <Descriptions.Item label="处理人">{selectedDetail.handler}</Descriptions.Item>
                <Descriptions.Item label="处理时间">
                  {selectedDetail.handleTime ? formatDateTime(selectedDetail.handleTime) : '-'}
                </Descriptions.Item>
                <Descriptions.Item label="处理结果" span={2}>
                  {selectedDetail.handleResult || '-'}
                </Descriptions.Item>
              </>
            )}
          </Descriptions>
        )}
        {selectedDetail && detailModalType === 'complaint' && (
          <Descriptions column={2} bordered size="small">
            <Descriptions.Item label="投诉标题" span={2}>{selectedDetail.title}</Descriptions.Item>
            <Descriptions.Item label="关联项目">{selectedDetail.projectName || '-'}</Descriptions.Item>
            <Descriptions.Item label="投诉人">{selectedDetail.complainant}</Descriptions.Item>
            <Descriptions.Item label="联系方式">{selectedDetail.contact || '-'}</Descriptions.Item>
            <Descriptions.Item label="提交时间">{formatDateTime(selectedDetail.submitTime)}</Descriptions.Item>
            <Descriptions.Item label="状态">
              {COMPLAINT_STATUS_OPTIONS.find((o) => o.value === selectedDetail.status)?.label}
            </Descriptions.Item>
            <Descriptions.Item label="投诉内容" span={2}>{selectedDetail.content}</Descriptions.Item>
            {selectedDetail.handler && (
              <>
                <Descriptions.Item label="处理人">{selectedDetail.handler}</Descriptions.Item>
                <Descriptions.Item label="回复时间">
                  {selectedDetail.replyTime ? formatDateTime(selectedDetail.replyTime) : '-'}
                </Descriptions.Item>
                <Descriptions.Item label="回复内容" span={2}>
                  {selectedDetail.replyContent || '-'}
                </Descriptions.Item>
              </>
            )}
          </Descriptions>
        )}
        {selectedDetail && detailModalType === 'announcement' && (
          <Descriptions column={2} bordered size="small">
            <Descriptions.Item label="公告标题" span={2}>{selectedDetail.title}</Descriptions.Item>
            <Descriptions.Item label="项目名称">{selectedDetail.projectName}</Descriptions.Item>
            <Descriptions.Item label="公告类型">
              {ANNOUNCEMENT_TYPE_OPTIONS.find((o) => o.value === selectedDetail.type)?.label}
            </Descriptions.Item>
            <Descriptions.Item label="提交时间">{formatDateTime(selectedDetail.submitTime)}</Descriptions.Item>
            <Descriptions.Item label="状态">
              {ANNOUNCEMENT_STATUS_OPTIONS.find((o) => o.value === selectedDetail.status)?.label}
            </Descriptions.Item>
            <Descriptions.Item label="审核人">{selectedDetail.reviewer || '-'}</Descriptions.Item>
            {selectedDetail.reviewTime && (
              <Descriptions.Item label="审核时间">{formatDateTime(selectedDetail.reviewTime)}</Descriptions.Item>
            )}
            {selectedDetail.reviewOpinion && (
              <Descriptions.Item label="审核意见" span={2}>{selectedDetail.reviewOpinion}</Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default Statistics;

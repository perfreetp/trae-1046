import React, { useState, useMemo } from 'react';
import { Row, Col, Card, Table, Button, DatePicker, Select, Space, Tag, message, Dropdown, MenuProps } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import ReactECharts from 'echarts-for-react';
import { DownloadOutlined, BarChartOutlined, PieChartOutlined, LineChartOutlined, FileExcelOutlined, FileTextOutlined } from '@ant-design/icons';
import { mockStatisticsData } from '@/mock/statistics';
import { mockClues, mockComplaints } from '@/mock/clues';
import { PROJECT_TYPE_OPTIONS, PROJECT_STATUS_OPTIONS } from '@/utils/constants';
import { formatMoney, formatDate, formatDateTime } from '@/utils/format';
import type { Project } from '@/types';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

const initialProjects: Project[] = [
  {
    id: 'P001',
    name: '市民服务中心建设项目',
    code: 'GC-2026-001',
    type: 'engineering',
    budget: 280000000,
    purchaser: '市政务服务管理局',
    agency: '市招标代理有限公司',
    status: 'completed',
    registerDate: '2026-01-15',
    description: '新建市民服务中心大楼，总建筑面积约50000平方米',
    attachments: [],
  },
  {
    id: 'P002',
    name: '城市智慧交通系统采购',
    code: 'CG-2026-005',
    type: 'procurement',
    budget: 85000000,
    purchaser: '市交通运输局',
    agency: '市政府采购中心',
    status: 'bidding',
    registerDate: '2026-03-20',
    description: '采购城市智慧交通管理系统及相关设备',
    attachments: [],
  },
  {
    id: 'P003',
    name: '国有土地使用权出让',
    code: 'CQ-2026-002',
    type: 'property',
    budget: 520000000,
    purchaser: '市自然资源和规划局',
    agency: '市公共资源交易中心',
    status: 'completed',
    registerDate: '2026-02-10',
    description: '位于城东新区的商业用地出让，面积约80亩',
    attachments: [],
  },
  {
    id: 'P004',
    name: '城市道路绿化提升工程',
    code: 'GC-2026-012',
    type: 'engineering',
    budget: 12000000,
    purchaser: '市城市管理局',
    agency: '市绿化工程监理公司',
    status: 'performing',
    registerDate: '2026-04-05',
    description: '城市主干道绿化景观提升改造，全长约15公里',
    attachments: [],
  },
  {
    id: 'P005',
    name: '智慧校园信息化建设项目',
    code: 'CG-2026-018',
    type: 'procurement',
    budget: 35000000,
    purchaser: '市教育局',
    agency: '市教育技术装备中心',
    status: 'evaluating',
    registerDate: '2026-04-18',
    description: '市属10所学校智慧校园信息化建设',
    attachments: [],
  },
  {
    id: 'P006',
    name: '污水处理厂二期扩建工程',
    code: 'GC-2026-020',
    type: 'engineering',
    budget: 156000000,
    purchaser: '市水务局',
    agency: '市水务工程建设管理处',
    status: 'bidding',
    registerDate: '2026-05-08',
    description: '日处理能力从5万吨扩建至10万吨',
    attachments: [],
  },
  {
    id: 'P007',
    name: '公立医院医疗设备集中采购',
    code: 'CG-2026-025',
    type: 'procurement',
    budget: 185000000,
    purchaser: '市卫生健康委员会',
    agency: '市医疗器械采购中心',
    status: 'announced',
    registerDate: '2026-05-20',
    description: '市属5家公立医院医疗设备集中采购',
    attachments: [],
  },
  {
    id: 'P008',
    name: '老旧写字楼房产转让',
    code: 'CQ-2026-008',
    type: 'property',
    budget: 45000000,
    purchaser: '市国有资产监督管理委员会',
    agency: '市产权交易中心',
    status: 'contract',
    registerDate: '2026-04-12',
    description: '中心区老政务办公楼整体转让',
    attachments: [],
  },
];

const Statistics: React.FC = () => {
  const [projects] = useState<Project[]>(initialProjects);
  const [reportType, setReportType] = useState<'project' | 'amount' | 'area'>('project');
  const [projectTypeFilter, setProjectTypeFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);

  const getOptionLabel = (options: Array<{ value: string; label: string }>, value: string) => {
    return options.find((opt) => opt.value === value)?.label || value;
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchType = projectTypeFilter === 'all' || p.type === projectTypeFilter;
      let matchDate = true;
      if (dateRange && dateRange[0] && dateRange[1]) {
        const projectDate = dayjs(p.registerDate);
        matchDate = projectDate.isAfter(dateRange[0]) && projectDate.isBefore(dateRange[1]);
      }
      return matchType && matchDate;
    });
  }, [projects, projectTypeFilter, dateRange]);

  const filteredStats = useMemo(() => {
    const totalAmount = filteredProjects.reduce((sum, p) => sum + p.budget, 0);
    const completedCount = filteredProjects.filter((p) => p.status === 'completed').length;
    return {
      totalCount: filteredProjects.length,
      totalAmount,
      completedCount,
      completionRate: filteredProjects.length > 0 ? Math.round((completedCount / filteredProjects.length) * 100) : 0,
    };
  }, [filteredProjects]);

  const monthlyTrendOption = {
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['项目数量', '交易金额'],
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: mockStatisticsData.monthlyTrend.map((item) => item.month),
    },
    yAxis: [
      {
        type: 'value',
        name: '项目数',
      },
      {
        type: 'value',
        name: '金额(万元)',
      },
    ],
    series: [
      {
        name: '项目数量',
        type: 'bar',
        data: mockStatisticsData.monthlyTrend.map((item) => item.count),
        itemStyle: {
          color: '#165DFF',
        },
      },
      {
        name: '交易金额',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        data: mockStatisticsData.monthlyTrend.map((item) => item.amount / 10000),
        itemStyle: {
          color: '#00B42A',
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(0, 180, 42, 0.3)' },
              { offset: 1, color: 'rgba(0, 180, 42, 0.05)' },
            ],
          },
        },
      },
    ],
  };

  const projectTypePieOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}个 ({d}%)',
    },
    legend: {
      bottom: '0',
      left: 'center',
    },
    series: [
      {
        name: '项目类型',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '45%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: true,
          formatter: '{b}\n{d}%',
        },
        data: mockStatisticsData.projectTypeStats.map((item, index) => ({
          value: item.count,
          name: item.type,
          itemStyle: {
            color: ['#165DFF', '#00B42A', '#FF7D00'][index],
          },
        })),
      },
    ],
  };

  const amountTypePieOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}万元 ({d}%)',
    },
    legend: {
      bottom: '0',
      left: 'center',
    },
    series: [
      {
        name: '交易金额',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '45%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: true,
          formatter: '{b}\n{d}%',
        },
        data: mockStatisticsData.projectTypeStats.map((item, index) => ({
          value: item.amount / 10000,
          name: item.type,
          itemStyle: {
            color: ['#165DFF', '#00B42A', '#FF7D00'][index],
          },
        })),
      },
    ],
  };

  const areaBarOption = {
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: mockStatisticsData.areaStats.map((item) => item.area),
    },
    yAxis: {
      type: 'value',
      name: '项目数',
    },
    series: [
      {
        name: '项目数量',
        type: 'bar',
        barWidth: '50%',
        data: mockStatisticsData.areaStats.map((item) => item.count),
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#165DFF' },
              { offset: 1, color: '#4080FF' },
            ],
          },
          borderRadius: [4, 4, 0, 0],
        },
      },
    ],
  };

  const columns: ColumnsType<Project> = [
    {
      title: '项目编号',
      dataIndex: 'code',
      key: 'code',
      width: 140,
    },
    {
      title: '项目名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: '项目类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type) => getOptionLabel(PROJECT_TYPE_OPTIONS, type),
    },
    {
      title: '预算金额',
      dataIndex: 'budget',
      key: 'budget',
      width: 120,
      render: (budget) => formatMoney(budget),
    },
    {
      title: '采购人',
      dataIndex: 'purchaser',
      key: 'purchaser',
      width: 150,
    },
    {
      title: '项目状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const label = getOptionLabel(PROJECT_STATUS_OPTIONS, status);
        const colors: Record<string, string> = {
          registered: 'blue',
          announced: 'cyan',
          bidding: 'orange',
          evaluating: 'purple',
          completed: 'green',
          contract: 'geekblue',
          performing: 'gold',
        };
        return <Tag color={colors[status]}>{label}</Tag>;
      },
    },
    {
      title: '登记日期',
      dataIndex: 'registerDate',
      key: 'registerDate',
      width: 120,
      render: (date) => formatDate(date),
    },
  ];

  const exportToCSV = (data: any[], filename: string, headers: string[], keys: string[]) => {
    const csvContent = [
      headers.join(','),
      ...data.map((item) =>
        keys.map((key) => {
          let value = item[key];
          if (typeof value === 'string' && value.includes(',')) {
            value = `"${value}"`;
          }
          return value || '';
        }).join(',')
      ),
    ].join('\n');

    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${formatDateTime(new Date().toISOString()).replace(/[- :]/g, '')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportProjects = () => {
    const headers = ['项目编号', '项目名称', '项目类型', '预算金额', '采购人', '项目状态', '登记日期', '代理机构', '项目描述'];
    const keys = ['code', 'name', 'typeText', 'budgetText', 'purchaser', 'statusText', 'registerDate', 'agency', 'description'];
    const data = filteredProjects.map((p) => ({
      ...p,
      typeText: getOptionLabel(PROJECT_TYPE_OPTIONS, p.type),
      budgetText: formatMoney(p.budget),
      statusText: getOptionLabel(PROJECT_STATUS_OPTIONS, p.status),
    }));
    exportToCSV(data, '项目明细报表', headers, keys);
    message.success('项目明细导出成功');
  };

  const handleExportStatistics = () => {
    const statsData = [
      { item: '总项目数', value: filteredStats.totalCount, unit: '个' },
      { item: '总交易额', value: formatMoney(filteredStats.totalAmount), unit: '' },
      { item: '已完成项目', value: filteredStats.completedCount, unit: '个' },
      { item: '完成率', value: `${filteredStats.completionRate}%`, unit: '' },
      { item: '异常线索数', value: mockStatisticsData.clueCount, unit: '条' },
      { item: '异议投诉数', value: mockStatisticsData.complaintCount, unit: '件' },
      { item: '黑名单企业数', value: mockStatisticsData.blacklistCount, unit: '家' },
    ];
    const headers = ['统计项', '数值', '单位'];
    const keys = ['item', 'value', 'unit'];
    exportToCSV(statsData, '统计概览报表', headers, keys);
    message.success('统计概览导出成功');
  };

  const handleExportClues = () => {
    const headers = ['线索编号', '线索标题', '风险等级', '线索来源', '关联项目', '状态', '创建时间'];
    const keys = ['id', 'title', 'riskLevelText', 'sourceText', 'projectName', 'statusText', 'createTime'];
    const data = mockClues.map((c) => ({
      ...c,
      riskLevelText: c.riskLevel === 'high' ? '高风险' : c.riskLevel === 'medium' ? '中风险' : '低风险',
      sourceText: c.source === 'system' ? '系统发现' : c.source === 'manual' ? '人工标记' : '投诉举报',
      statusText: c.status === 'pending' ? '待处理' : c.status === 'processing' ? '处理中' : '已办结',
    }));
    exportToCSV(data, '异常线索报表', headers, keys);
    message.success('异常线索导出成功');
  };

  const handleExportComplaints = () => {
    const headers = ['投诉编号', '投诉标题', '关联项目', '投诉人', '联系方式', '状态', '提交时间'];
    const keys = ['id', 'title', 'projectName', 'complainant', 'contact', 'statusText', 'submitTime'];
    const data = mockComplaints.map((c) => ({
      ...c,
      statusText: c.status === 'pending' ? '待受理' : c.status === 'processing' ? '处理中' : c.status === 'replied' ? '已回复' : '已办结',
    }));
    exportToCSV(data, '异议投诉报表', headers, keys);
    message.success('异议投诉导出成功');
  };

  const exportMenuItems: MenuProps['items'] = [
    {
      key: 'projects',
      label: (
        <span onClick={handleExportProjects}>
          <FileExcelOutlined className="mr-2" /> 项目明细报表
        </span>
      ),
    },
    {
      key: 'statistics',
      label: (
        <span onClick={handleExportStatistics}>
          <FileTextOutlined className="mr-2" /> 统计概览报表
        </span>
      ),
    },
    {
      key: 'clues',
      label: (
        <span onClick={handleExportClues}>
          <FileExcelOutlined className="mr-2" /> 异常线索报表
        </span>
      ),
    },
    {
      key: 'complaints',
      label: (
        <span onClick={handleExportComplaints}>
          <FileExcelOutlined className="mr-2" /> 异议投诉报表
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <Space>
              <span className="text-gray-600">统计周期：</span>
              <RangePicker value={dateRange} onChange={(dates) => setDateRange(dates as any)} />
            </Space>
            <Space>
              <span className="text-gray-600">项目类型：</span>
              <Select
                defaultValue="all"
                style={{ width: 140 }}
                value={projectTypeFilter}
                onChange={(value) => setProjectTypeFilter(value)}
              >
                <Option value="all">全部类型</Option>
                <Option value="engineering">工程招投标</Option>
                <Option value="procurement">政府采购</Option>
                <Option value="property">产权交易</Option>
              </Select>
            </Space>
          </div>
          <Dropdown menu={{ items: exportMenuItems }} placement="bottomRight">
            <Button type="primary" icon={<DownloadOutlined />}>
              导出报表
            </Button>
          </Dropdown>
        </div>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card
            title="月度交易趋势"
            className="shadow-sm"
            extra={
              <Space>
                <Button
                  type={reportType === 'project' ? 'primary' : 'default'}
                  size="small"
                  icon={<BarChartOutlined />}
                  onClick={() => setReportType('project')}
                >
                  项目数
                </Button>
                <Button
                  type={reportType === 'amount' ? 'primary' : 'default'}
                  size="small"
                  icon={<LineChartOutlined />}
                  onClick={() => setReportType('amount')}
                >
                  交易额
                </Button>
              </Space>
            }
          >
            <ReactECharts option={monthlyTrendOption} style={{ height: 350 }} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card
            title="交易类型分布"
            className="shadow-sm"
            extra={
              <Space>
                <Button
                  type={reportType === 'project' ? 'primary' : 'default'}
                  size="small"
                  icon={<PieChartOutlined />}
                  onClick={() => setReportType('project')}
                >
                  按数量
                </Button>
                <Button
                  type={reportType === 'area' ? 'primary' : 'default'}
                  size="small"
                  icon={<PieChartOutlined />}
                  onClick={() => setReportType('area')}
                >
                  按金额
                </Button>
              </Space>
            }
          >
            <ReactECharts
              option={reportType === 'area' ? amountTypePieOption : projectTypePieOption}
              style={{ height: 350 }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="各区域项目分布" className="shadow-sm">
            <ReactECharts option={areaBarOption} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="统计概览" className="shadow-sm">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">总项目数</p>
                <p className="text-2xl font-bold text-blue-600">{filteredStats.totalCount}</p>
                <p className="text-xs text-gray-500 mt-1">较上月 +12.5%</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">总交易额</p>
                <p className="text-2xl font-bold text-green-600">{formatMoney(filteredStats.totalAmount)}</p>
                <p className="text-xs text-gray-500 mt-1">较上月 +8.3%</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">已完成项目</p>
                <p className="text-2xl font-bold text-orange-600">{filteredStats.completedCount}</p>
                <p className="text-xs text-gray-500 mt-1">完成率 {filteredStats.completionRate}%</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">异常线索</p>
                <p className="text-2xl font-bold text-red-600">{mockStatisticsData.clueCount}</p>
                <p className="text-xs text-gray-500 mt-1">待处理 8 条</p>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Card
        title="项目明细列表"
        className="shadow-sm"
        extra={
          <Button icon={<DownloadOutlined />} size="small" onClick={handleExportProjects}>
            导出Excel
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredProjects}
          rowKey="id"
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
            pageSize: 10,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  );
};

export default Statistics;

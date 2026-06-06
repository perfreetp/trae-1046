import React, { useState } from 'react';
import { Row, Col, Card, Table, Button, DatePicker, Select, Space, Tag, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import ReactECharts from 'echarts-for-react';
import { DownloadOutlined, BarChartOutlined, PieChartOutlined, LineChartOutlined } from '@ant-design/icons';
import { mockStatisticsData } from '@/mock/statistics';
import { mockProjects } from '@/mock/projects';
import { PROJECT_TYPE_OPTIONS, PROJECT_STATUS_OPTIONS } from '@/utils/constants';
import { formatMoney, formatDate } from '@/utils/format';
import type { Project } from '@/types';

const { RangePicker } = DatePicker;
const { Option } = Select;

const Statistics: React.FC = () => {
  const [reportType, setReportType] = useState<'project' | 'amount' | 'area'>('project');

  const getOptionLabel = (options: Array<{ value: string; label: string }>, value: string) => {
    return options.find((opt) => opt.value === value)?.label || value;
  };

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

  const handleExport = () => {
    message.success('数据导出成功，文件已下载');
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <Space>
              <span className="text-gray-600">统计周期：</span>
              <RangePicker />
            </Space>
            <Space>
              <span className="text-gray-600">项目类型：</span>
              <Select defaultValue="all" style={{ width: 140 }}>
                <Option value="all">全部类型</Option>
                <Option value="engineering">工程招投标</Option>
                <Option value="procurement">政府采购</Option>
                <Option value="property">产权交易</Option>
              </Select>
            </Space>
          </div>
          <Button type="primary" icon={<DownloadOutlined />} onClick={handleExport}>
            导出报表
          </Button>
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
                <p className="text-2xl font-bold text-blue-600">{mockStatisticsData.totalProjects}</p>
                <p className="text-xs text-gray-500 mt-1">较上月 +12.5%</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">总交易额</p>
                <p className="text-2xl font-bold text-green-600">{formatMoney(mockStatisticsData.totalAmount)}</p>
                <p className="text-xs text-gray-500 mt-1">较上月 +8.3%</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">已完成项目</p>
                <p className="text-2xl font-bold text-orange-600">{mockStatisticsData.completedProjects}</p>
                <p className="text-xs text-gray-500 mt-1">完成率 62.8%</p>
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
          <Button icon={<DownloadOutlined />} size="small" onClick={handleExport}>
            导出Excel
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={mockProjects}
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

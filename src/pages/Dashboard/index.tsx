import React from 'react';
import { Row, Col, Card, List, Tag, Timeline } from 'antd';
import { useNavigate } from 'react-router-dom';
import ReactECharts from 'echarts-for-react';
import {
  FolderOpen,
  DollarSign,
  AlertTriangle,
  FileCheck,
  Users,
  Award,
  Clock,
  FileText,
} from 'lucide-react';
import DataCard from '@/components/DataCard';
import { mockStatisticsData, mockRecentActivities } from '@/mock/statistics';
import { mockTodoItems, mockRiskWarnings } from '@/mock/clues';
import { formatMoney, formatDateTime } from '@/utils/format';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const trendOption = {
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
      data: mockStatisticsData.monthlyTrend.map((item) => item.month.slice(5)),
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
      },
    ],
  };

  const pieOption = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      bottom: '0',
      left: 'center',
    },
    series: [
      {
        name: '交易类型',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: false,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold',
          },
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

  const getRiskColor = (level: string) => {
    const colors: Record<string, string> = {
      high: 'red',
      medium: 'orange',
      low: 'green',
    };
    return colors[level] || 'default';
  };

  const getRiskText = (level: string) => {
    const texts: Record<string, string> = {
      high: '高风险',
      medium: '中风险',
      low: '低风险',
    };
    return texts[level] || level;
  };

  return (
    <div className="space-y-6">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <DataCard
            title="交易项目总数"
            value={mockStatisticsData.totalProjects}
            unit="个"
            trend={12.5}
            trendText="较上月"
            icon={<FolderOpen size={24} />}
            color="#165DFF"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <DataCard
            title="累计交易额"
            value={formatMoney(mockStatisticsData.totalAmount)}
            trend={8.3}
            trendText="较上月"
            icon={<DollarSign size={24} />}
            color="#00B42A"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <DataCard
            title="在监项目"
            value={mockStatisticsData.ongoingProjects}
            unit="个"
            trend={-2.1}
            trendText="较上月"
            icon={<Clock size={24} />}
            color="#FF7D00"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <DataCard
            title="异常线索"
            value={mockStatisticsData.clueCount}
            unit="条"
            trend={15.2}
            trendText="较上月"
            icon={<AlertTriangle size={24} />}
            color="#F53F3F"
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="交易趋势" className="shadow-sm">
            <ReactECharts option={trendOption} style={{ height: 320 }} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="待办事项" className="shadow-sm h-full">
            <List
              dataSource={mockTodoItems}
              renderItem={(item) => (
                <List.Item
                  className="cursor-pointer hover:bg-gray-50 px-2 rounded transition-colors"
                  onClick={() => navigate(item.link)}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-primary-50 flex items-center justify-center text-primary-500">
                        {item.type === 'announcement' && <FileCheck size={16} />}
                        {item.type === 'complaint' && <Users size={16} />}
                        {item.type === 'clue' && <AlertTriangle size={16} />}
                        {item.type === 'warning' && <FileText size={16} />}
                      </div>
                      <span className="text-gray-700">{item.title}</span>
                    </div>
                    <Tag color="red" className="ml-2">
                      {item.count}
                    </Tag>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card title="交易类型分布" className="shadow-sm">
            <ReactECharts option={pieOption} style={{ height: 280 }} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="风险预警" className="shadow-sm">
            <List
              dataSource={mockRiskWarnings.slice(0, 4)}
              renderItem={(item) => (
                <List.Item className="px-2">
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-800 truncate flex-1 mr-2">
                        {item.title}
                      </span>
                      <Tag color={getRiskColor(item.level)}>{getRiskText(item.level)}</Tag>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{item.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{formatDateTime(item.createTime)}</p>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="近期动态" className="shadow-sm">
            <Timeline
              items={mockRecentActivities.slice(0, 4).map((activity, index) => ({
                color: ['#165DFF', '#00B42A', '#FF7D00', '#F53F3F'][index],
                children: (
                  <div>
                    <p className="text-sm text-gray-800">{activity.title}</p>
                    <p className="text-xs text-gray-400 mt-1">{formatDateTime(activity.time)}</p>
                  </div>
                ),
              }))}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;

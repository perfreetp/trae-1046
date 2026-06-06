import React, { useState } from 'react';
import {
  Row,
  Col,
  Card,
  Table,
  Button,
  Tag,
  Space,
  Modal,
  Tabs,
  Calendar,
  Statistic,
  Progress,
  Timeline,
  Badge,
} from 'antd';
import { Eye, Calendar as CalendarIcon, Wallet, Users, FileText } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { mockBiddingSessions, mockJudgeExtractions, mockEvaluationRecords } from '@/mock/bidding';
import type { BiddingSession } from '@/types';
import { BIDDING_STATUS_OPTIONS } from '@/utils/constants';
import { formatDateTime, formatDate } from '@/utils/format';

const { TabPane } = Tabs;

const Bidding: React.FC = () => {
  const [isJudgeModal, setIsJudgeModal] = useState(false);
  const [isEvaluationModal, setIsEvaluationModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<BiddingSession | null>(null);
  const [activeTab, setActiveTab] = useState('calendar');

  const getStatusTag = (status: string) => {
    const option = BIDDING_STATUS_OPTIONS.find((o) => o.value === status);
    return option ? <Tag color={option.color}>{option.label}</Tag> : status;
  };

  const columns: ColumnsType<BiddingSession> = [
    {
      title: '项目名称',
      dataIndex: 'projectName',
      key: 'projectName',
      ellipsis: true,
    },
    {
      title: '开标时间',
      dataIndex: 'startTime',
      key: 'startTime',
      width: 170,
      render: (time) => formatDateTime(time),
    },
    {
      title: '开标地点',
      dataIndex: 'location',
      key: 'location',
      width: 220,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => getStatusTag(status),
    },
    {
      title: '保证金',
      dataIndex: 'bondStatus',
      key: 'bondStatus',
      width: 200,
      render: (bond) => (
        <div className="text-xs">
          <span className="text-gray-600">
            已缴: {bond.paid}/{bond.total}
          </span>
          <span className="text-gray-400 mx-2">|</span>
          <span className="text-gray-600">已退: {bond.refunded}</span>
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<Wallet size={14} />}
            onClick={() => {
              setSelectedSession(record);
              Modal.info({
                title: '保证金状态详情',
                width: 500,
                content: (
                  <div className="space-y-4">
                    <Row gutter={16}>
                      <Col span={6}>
                        <Statistic title="应缴" value={record.bondStatus.total} suffix="家" />
                      </Col>
                      <Col span={6}>
                        <Statistic
                          title="已缴"
                          value={record.bondStatus.paid}
                          suffix="家"
                          valueStyle={{ color: '#00B42A' }}
                        />
                      </Col>
                      <Col span={6}>
                        <Statistic
                          title="未缴"
                          value={record.bondStatus.unpaid}
                          suffix="家"
                          valueStyle={{ color: '#F53F3F' }}
                        />
                      </Col>
                      <Col span={6}>
                        <Statistic
                          title="已退"
                          value={record.bondStatus.refunded}
                          suffix="家"
                          valueStyle={{ color: '#165DFF' }}
                        />
                      </Col>
                    </Row>
                    <Progress
                      percent={Math.round((record.bondStatus.paid / record.bondStatus.total) * 100) || 0}
                      status="active"
                    />
                  </div>
                ),
              });
            }}
          >
            保证金
          </Button>
          <Button
            type="link"
            size="small"
            icon={<Users size={14} />}
            onClick={() => setIsJudgeModal(true)}
          >
            评委抽取
          </Button>
          <Button
            type="link"
            size="small"
            icon={<FileText size={14} />}
            onClick={() => setIsEvaluationModal(true)}
          >
            评标留痕
          </Button>
        </Space>
      ),
    },
  ];

  const dateCellRender = (value: dayjs.Dayjs) => {
    const sessions = mockBiddingSessions.filter((s) =>
      dayjs(s.startTime).isSame(value, 'day')
    );
    return (
      <div className="text-xs">
        {sessions.map((session) => (
          <Badge
            key={session.id}
            status={session.status === 'ongoing' ? 'processing' : session.status === 'completed' ? 'success' : 'default'}
            text={session.projectName.slice(0, 8)}
            className="block mb-1"
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab={<span><CalendarIcon size={16} className="mr-2" />开标日历</span>} key="calendar">
            <Calendar dateCellRender={dateCellRender} />
          </TabPane>
          <TabPane tab={<span><Users size={16} className="mr-2" />开标列表</span>} key="list">
            <Table
              columns={columns}
              dataSource={mockBiddingSessions}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `共 ${total} 条记录`,
              }}
            />
          </TabPane>
        </Tabs>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card className="shadow-sm">
            <Statistic
              title="今日开标"
              value={mockBiddingSessions.filter((s) => dayjs(s.startTime).isSame(dayjs(), 'day')).length}
              suffix="个项目"
              valueStyle={{ color: '#165DFF' }}
              prefix={<CalendarIcon size={20} />}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="shadow-sm">
            <Statistic
              title="正在进行"
              value={mockBiddingSessions.filter((s) => s.status === 'ongoing').length}
              suffix="个项目"
              valueStyle={{ color: '#FF7D00' }}
              prefix={<Users size={20} />}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="shadow-sm">
            <Statistic
              title="本周开标"
              value={mockBiddingSessions.filter((s) => dayjs(s.startTime).isSame(dayjs(), 'week')).length}
              suffix="个项目"
              valueStyle={{ color: '#00B42A' }}
              prefix={<FileText size={20} />}
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title="评委抽取记录"
        open={isJudgeModal}
        onCancel={() => setIsJudgeModal(false)}
        footer={null}
        width={700}
      >
        <div className="space-y-4">
          {mockJudgeExtractions.map((extraction) => (
            <Card key={extraction.id} size="small" title={extraction.projectName}>
              <div className="text-xs text-gray-500 mb-2">
                抽取时间：{formatDateTime(extraction.extractTime)} | 操作人：{extraction.operator}
              </div>
              <Table
                size="small"
                columns={[
                  { title: '评委姓名', dataIndex: 'name', key: 'name' },
                  { title: '专业领域', dataIndex: 'expertField', key: 'expertField' },
                  {
                    title: '状态',
                    key: 'status',
                    render: (_, record) =>
                      record.isRecused ? (
                        <Tag color="orange">
                          已回避 - {record.recuseReason}
                        </Tag>
                      ) : (
                        <Tag color="green">正常</Tag>
                      ),
                  },
                ]}
                dataSource={extraction.judges}
                rowKey="id"
                pagination={false}
              />
            </Card>
          ))}
        </div>
      </Modal>

      <Modal
        title="评标过程留痕"
        open={isEvaluationModal}
        onCancel={() => setIsEvaluationModal(false)}
        footer={null}
        width={700}
      >
        <Timeline
          items={mockEvaluationRecords.map((record) => ({
            color: 'blue',
            children: (
              <div className="pb-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-800">{record.stage}</span>
                  <span className="text-xs text-gray-400">{formatDateTime(record.time)}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">操作人：{record.operator}</p>
                <p className="text-sm text-gray-600">{record.content}</p>
              </div>
            ),
          }))}
        />
      </Modal>
    </div>
  );
};

export default Bidding;

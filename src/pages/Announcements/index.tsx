import React, { useState } from 'react';
import {
  Row,
  Col,
  Card,
  Table,
  Button,
  Input,
  Select,
  Tag,
  Space,
  Modal,
  Form,
  message,
  Tabs,
  Alert,
  Descriptions,
} from 'antd';
import { Search, Eye, Check, XCircle, FileDiff, AlertTriangle } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import { mockAnnouncements } from '@/mock/announcements';
import type { Announcement } from '@/types';
import {
  ANNOUNCEMENT_TYPE_OPTIONS,
  ANNOUNCEMENT_STATUS_OPTIONS,
} from '@/utils/constants';
import { formatDateTime } from '@/utils/format';

const { Option } = Select;
const { TabPane } = Tabs;

const Announcements: React.FC = () => {
  const [isDetailModal, setIsDetailModal] = useState(false);
  const [isCompareModal, setIsCompareModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredAnnouncements = statusFilter === 'all'
    ? mockAnnouncements
    : mockAnnouncements.filter((a) => a.status === statusFilter);

  const getStatusTag = (status: string) => {
    const option = ANNOUNCEMENT_STATUS_OPTIONS.find((o) => o.value === status);
    return option ? <Tag color={option.color}>{option.label}</Tag> : status;
  };

  const getTypeText = (type: string) => {
    const option = ANNOUNCEMENT_TYPE_OPTIONS.find((o) => o.value === type);
    return option ? option.label : type;
  };

  const columns: ColumnsType<Announcement> = [
    {
      title: '公告标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: '项目名称',
      dataIndex: 'projectName',
      key: 'projectName',
      width: 200,
      ellipsis: true,
    },
    {
      title: '公告类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type) => getTypeText(type),
    },
    {
      title: '提交时间',
      dataIndex: 'submitTime',
      key: 'submitTime',
      width: 170,
      render: (time) => formatDateTime(time),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => getStatusTag(status),
    },
    {
      title: '审核人',
      dataIndex: 'reviewer',
      key: 'reviewer',
      width: 100,
      render: (reviewer) => reviewer || '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 220,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<Eye size={14} />}
            onClick={() => {
              setSelectedAnnouncement(record);
              setIsDetailModal(true);
            }}
          >
            详情
          </Button>
          <Button
            type="link"
            size="small"
            icon={<FileDiff size={14} />}
            onClick={() => {
              setSelectedAnnouncement(record);
              setIsCompareModal(true);
            }}
          >
            比对
          </Button>
          {record.status === 'pending' && (
            <>
              <Button
                type="link"
                size="small"
                icon={<Check size={14} />}
                onClick={() => message.success('审核通过')}
              >
                通过
              </Button>
              <Button
                type="link"
                size="small"
                danger
                icon={<XCircle size={14} />}
                onClick={() => message.info('已驳回')}
              >
                驳回
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <Row gutter={[16, 16]} align="middle">
          <Col>
            <Space>
              <Select
                defaultValue="all"
                style={{ width: 140 }}
                onChange={(value) => setStatusFilter(value)}
              >
                <Option value="all">全部状态</Option>
                {ANNOUNCEMENT_STATUS_OPTIONS.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
              <Select defaultValue="all" style={{ width: 140 }}>
                <Option value="all">全部类型</Option>
                {ANNOUNCEMENT_TYPE_OPTIONS.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Space>
          </Col>
          <Col flex="auto" />
          <Col>
            <Input
              placeholder="搜索公告标题"
              prefix={<Search size={16} />}
              style={{ width: 240 }}
            />
          </Col>
        </Row>
      </Card>

      <Card className="shadow-sm">
        <Table
          columns={columns}
          dataSource={filteredAnnouncements}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>

      <Modal
        title="公告详情"
        open={isDetailModal}
        onCancel={() => setIsDetailModal(false)}
        footer={null}
        width={800}
      >
        {selectedAnnouncement && (
          <div>
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="公告标题" span={2}>
                {selectedAnnouncement.title}
              </Descriptions.Item>
              <Descriptions.Item label="项目名称">
                {selectedAnnouncement.projectName}
              </Descriptions.Item>
              <Descriptions.Item label="公告类型">
                {getTypeText(selectedAnnouncement.type)}
              </Descriptions.Item>
              <Descriptions.Item label="提交时间">
                {formatDateTime(selectedAnnouncement.submitTime)}
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                {getStatusTag(selectedAnnouncement.status)}
              </Descriptions.Item>
              {selectedAnnouncement.reviewer && (
                <>
                  <Descriptions.Item label="审核人">
                    {selectedAnnouncement.reviewer}
                  </Descriptions.Item>
                  <Descriptions.Item label="审核时间">
                    {selectedAnnouncement.reviewTime
                      ? formatDateTime(selectedAnnouncement.reviewTime)
                      : '-'}
                  </Descriptions.Item>
                </>
              )}
              {selectedAnnouncement.reviewOpinion && (
                <Descriptions.Item label="审核意见" span={2}>
                  {selectedAnnouncement.reviewOpinion}
                </Descriptions.Item>
              )}
            </Descriptions>
            <div className="mt-4 p-4 bg-gray-50 rounded">
              <h4 className="text-gray-700 font-medium mb-2">公告内容</h4>
              <pre className="whitespace-pre-wrap text-sm text-gray-600 font-sans">
                {selectedAnnouncement.content}
              </pre>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        title="公告比对与合规检查"
        open={isCompareModal}
        onCancel={() => setIsCompareModal(false)}
        width={900}
        okText="确认通过"
        cancelText="关闭"
        onOk={() => {
          message.success('公告合规，审核通过');
          setIsCompareModal(false);
        }}
      >
        <Tabs defaultActiveKey="compare">
          <TabPane tab="公告比对" key="compare">
            <Row gutter={16}>
              <Col span={12}>
                <Card title="标准模板" size="small" className="h-80 overflow-auto">
                  <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                    一、招标条件
                    本招标项目已由相关部门批准建设...
                    二、项目概况与招标范围
                    1.建设地点：
                    2.建设规模：
                    3.计划工期：
                    三、投标人资格要求
                    1.投标人须具备相应资质...
                  </pre>
                </Card>
              </Col>
              <Col span={12}>
                <Card title="待审核公告" size="small" className="h-80 overflow-auto">
                  <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                    {selectedAnnouncement?.content}
                  </pre>
                </Card>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="资格条件检查" key="compliance">
            <div className="space-y-3">
              <Alert
                message="资格条件检查通过"
                description="未发现明显的限制性条款和不合理资格要求"
                type="success"
                showIcon
              />
              <Alert
                message="注意事项"
                description={
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>资格条件中"近五年类似项目业绩"要求合理</li>
                    <li>项目经理资质要求符合相关规定</li>
                    <li>未发现设定特定行政区域或特定行业业绩要求</li>
                  </ul>
                }
                type="warning"
                showIcon
                icon={<AlertTriangle size={16} />}
              />
            </div>
          </TabPane>
        </Tabs>
      </Modal>
    </div>
  );
};

export default Announcements;

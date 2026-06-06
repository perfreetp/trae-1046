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
  Timeline,
  Descriptions,
  List,
  Alert,
} from 'antd';
import { Search, Plus, Eye, AlertTriangle, MessageSquare, Flag } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import { mockClues, mockComplaints, mockRiskWarnings } from '@/mock/clues';
import type { Clue, Complaint } from '@/types';
import {
  CLUE_STATUS_OPTIONS,
  CLUE_SOURCE_OPTIONS,
  RISK_LEVEL_OPTIONS,
  COMPLAINT_STATUS_OPTIONS,
} from '@/utils/constants';
import { formatDateTime } from '@/utils/format';

const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

const Clues: React.FC = () => {
  const [isDetailModal, setIsDetailModal] = useState(false);
  const [isComplaintModal, setIsComplaintModal] = useState(false);
  const [isClueFormModal, setIsClueFormModal] = useState(false);
  const [selectedClue, setSelectedClue] = useState<Clue | null>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [activeTab, setActiveTab] = useState('clues');
  const [form] = Form.useForm();

  const getLevelTag = (level: string) => {
    const option = RISK_LEVEL_OPTIONS.find((o) => o.value === level);
    return option ? <Tag color={option.color}>{option.label}</Tag> : level;
  };

  const getStatusTag = (status: string, type: 'clue' | 'complaint' = 'clue') => {
    const options = type === 'clue' ? CLUE_STATUS_OPTIONS : COMPLAINT_STATUS_OPTIONS;
    const option = options.find((o) => o.value === status);
    return option ? <Tag color={option.color}>{option.label}</Tag> : status;
  };

  const getSourceText = (source: string) => {
    const option = CLUE_SOURCE_OPTIONS.find((o) => o.value === source);
    return option ? option.label : source;
  };

  const clueColumns: ColumnsType<Clue> = [
    {
      title: '线索标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: '关联项目',
      dataIndex: 'projectName',
      key: 'projectName',
      width: 180,
      render: (name) => name || '-',
    },
    {
      title: '来源',
      dataIndex: 'source',
      key: 'source',
      width: 100,
      render: (source) => getSourceText(source),
    },
    {
      title: '风险等级',
      dataIndex: 'riskLevel',
      key: 'riskLevel',
      width: 100,
      render: (level) => getLevelTag(level),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => getStatusTag(status),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 170,
      render: (time) => formatDateTime(time),
    },
    {
      title: '处理人',
      dataIndex: 'handler',
      key: 'handler',
      width: 100,
      render: (handler) => handler || '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<Eye size={14} />}
            onClick={() => {
              setSelectedClue(record);
              setIsDetailModal(true);
            }}
          >
            详情
          </Button>
          <Button
            type="link"
            size="small"
            icon={<Flag size={14} />}
            onClick={() => message.success('已标记处置')}
          >
            处置
          </Button>
        </Space>
      ),
    },
  ];

  const complaintColumns: ColumnsType<Complaint> = [
    {
      title: '投诉标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: '关联项目',
      dataIndex: 'projectName',
      key: 'projectName',
      width: 180,
    },
    {
      title: '投诉人',
      dataIndex: 'complainant',
      key: 'complainant',
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => getStatusTag(status, 'complaint'),
    },
    {
      title: '提交时间',
      dataIndex: 'submitTime',
      key: 'submitTime',
      width: 170,
      render: (time) => formatDateTime(time),
    },
    {
      title: '处理人',
      dataIndex: 'handler',
      key: 'handler',
      width: 100,
      render: (handler) => handler || '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<Eye size={14} />}
            onClick={() => {
              setSelectedComplaint(record);
              setIsComplaintModal(true);
            }}
          >
            详情
          </Button>
          <Button
            type="link"
            size="small"
            icon={<MessageSquare size={14} />}
            onClick={() => message.success('已受理')}
          >
            受理
          </Button>
        </Space>
      ),
    },
  ];

  const handleSubmitClue = () => {
    form.validateFields().then(() => {
      message.success('线索登记成功');
      setIsClueFormModal(false);
      form.resetFields();
    });
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab={<span><AlertTriangle size={16} className="mr-2" />异常线索</span>} key="clues">
            <div className="mb-4 flex items-center justify-between">
              <Space>
                <Select defaultValue="all" style={{ width: 140 }}>
                  <Option value="all">全部等级</Option>
                  {RISK_LEVEL_OPTIONS.map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
                <Select defaultValue="all" style={{ width: 140 }}>
                  <Option value="all">全部状态</Option>
                  {CLUE_STATUS_OPTIONS.map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Space>
              <Space>
                <Input
                  placeholder="搜索线索"
                  prefix={<Search size={16} />}
                  style={{ width: 240 }}
                />
                <Button
                  type="primary"
                  icon={<Plus size={16} />}
                  onClick={() => setIsClueFormModal(true)}
                >
                  人工标记
                </Button>
              </Space>
            </div>
            <Table
              columns={clueColumns}
              dataSource={mockClues}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `共 ${total} 条记录`,
              }}
            />
          </TabPane>
          <TabPane tab={<span><MessageSquare size={16} className="mr-2" />异议投诉</span>} key="complaints">
            <div className="mb-4 flex items-center justify-between">
              <Space>
                <Select defaultValue="all" style={{ width: 140 }}>
                  <Option value="all">全部状态</Option>
                  {COMPLAINT_STATUS_OPTIONS.map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Space>
              <Input
                placeholder="搜索投诉"
                prefix={<Search size={16} />}
                style={{ width: 240 }}
              />
            </div>
            <Table
              columns={complaintColumns}
              dataSource={mockComplaints}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `共 ${total} 条记录`,
              }}
            />
          </TabPane>
          <TabPane tab={<span><Flag size={16} className="mr-2" />风险预警</span>} key="warnings">
            <List
              dataSource={mockRiskWarnings}
              renderItem={(item) => (
                <List.Item className="px-4 py-3 hover:bg-gray-50 rounded">
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {getLevelTag(item.level)}
                        <span className="font-medium text-gray-800">{item.title}</span>
                      </div>
                      <span className="text-xs text-gray-400">{formatDateTime(item.createTime)}</span>
                    </div>
                    <p className="text-sm text-gray-600">{item.description}</p>
                    {item.projectName && (
                      <p className="text-xs text-primary-500 mt-1">关联项目：{item.projectName}</p>
                    )}
                  </div>
                </List.Item>
              )}
            />
          </TabPane>
        </Tabs>
      </Card>

      <Modal
        title="线索详情"
        open={isDetailModal}
        onCancel={() => setIsDetailModal(false)}
        footer={null}
        width={700}
      >
        {selectedClue && (
          <div>
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="线索标题" span={2}>
                {selectedClue.title}
              </Descriptions.Item>
              <Descriptions.Item label="关联项目">
                {selectedClue.projectName || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="来源">
                {getSourceText(selectedClue.source)}
              </Descriptions.Item>
              <Descriptions.Item label="风险等级">
                {getLevelTag(selectedClue.riskLevel)}
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                {getStatusTag(selectedClue.status)}
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">
                {formatDateTime(selectedClue.createTime)}
              </Descriptions.Item>
              <Descriptions.Item label="处理人">
                {selectedClue.handler || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="处理时间">
                {selectedClue.handleTime ? formatDateTime(selectedClue.handleTime) : '-'}
              </Descriptions.Item>
            </Descriptions>
            <div className="mt-4">
              <h4 className="text-gray-700 font-medium mb-2">线索描述</h4>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                {selectedClue.description}
              </p>
            </div>
            {selectedClue.relatedCompanies.length > 0 && (
              <div className="mt-4">
                <h4 className="text-gray-700 font-medium mb-2">关联企业</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedClue.relatedCompanies.map((company, index) => (
                    <Tag key={index}>{company}</Tag>
                  ))}
                </div>
              </div>
            )}
            {selectedClue.handleResult && (
              <div className="mt-4">
                <h4 className="text-gray-700 font-medium mb-2">处理结果</h4>
                <Alert
                  message={selectedClue.handleResult}
                  type="info"
                  showIcon
                />
              </div>
            )}
            <div className="mt-4">
              <h4 className="text-gray-700 font-medium mb-3">处置时间线</h4>
              <Timeline
                items={[
                  {
                    color: 'blue',
                    children: (
                      <div>
                        <p className="text-sm">线索发现</p>
                        <p className="text-xs text-gray-400">{formatDateTime(selectedClue.createTime)}</p>
                      </div>
                    ),
                  },
                  selectedClue.handleTime && {
                    color: 'green',
                    children: (
                      <div>
                        <p className="text-sm">处理完成</p>
                        <p className="text-xs text-gray-400">{formatDateTime(selectedClue.handleTime)}</p>
                      </div>
                    ),
                  },
                ].filter(Boolean)}
              />
            </div>
          </div>
        )}
      </Modal>

      <Modal
        title="投诉详情"
        open={isComplaintModal}
        onCancel={() => setIsComplaintModal(false)}
        footer={null}
        width={700}
      >
        {selectedComplaint && (
          <div>
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="投诉标题" span={2}>
                {selectedComplaint.title}
              </Descriptions.Item>
              <Descriptions.Item label="关联项目">
                {selectedComplaint.projectName}
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                {getStatusTag(selectedComplaint.status, 'complaint')}
              </Descriptions.Item>
              <Descriptions.Item label="投诉人">
                {selectedComplaint.complainant}
              </Descriptions.Item>
              <Descriptions.Item label="联系方式">
                {selectedComplaint.contact}
              </Descriptions.Item>
              <Descriptions.Item label="提交时间">
                {formatDateTime(selectedComplaint.submitTime)}
              </Descriptions.Item>
              <Descriptions.Item label="处理人">
                {selectedComplaint.handler || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="答复时间">
                {selectedComplaint.replyTime ? formatDateTime(selectedComplaint.replyTime) : '-'}
              </Descriptions.Item>
            </Descriptions>
            <div className="mt-4">
              <h4 className="text-gray-700 font-medium mb-2">投诉内容</h4>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                {selectedComplaint.content}
              </p>
            </div>
            {selectedComplaint.replyContent && (
              <div className="mt-4">
                <h4 className="text-gray-700 font-medium mb-2">答复内容</h4>
                <p className="text-sm text-gray-600 bg-green-50 p-3 rounded border border-green-200">
                  {selectedComplaint.replyContent}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal
        title="人工标记线索"
        open={isClueFormModal}
        onCancel={() => setIsClueFormModal(false)}
        onOk={handleSubmitClue}
        width={600}
        okText="提交"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="线索标题"
            rules={[{ required: true, message: '请输入线索标题' }]}
          >
            <Input placeholder="请输入线索标题" />
          </Form.Item>
          <Form.Item
            name="riskLevel"
            label="风险等级"
            rules={[{ required: true, message: '请选择风险等级' }]}
          >
            <Select placeholder="请选择">
              {RISK_LEVEL_OPTIONS.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="projectId" label="关联项目">
            <Select placeholder="请选择项目" showSearch>
              <Option value="P001">市政务服务中心装修改造工程</Option>
              <Option value="P004">城市道路绿化提升工程</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="description"
            label="线索描述"
            rules={[{ required: true, message: '请输入线索描述' }]}
          >
            <TextArea rows={4} placeholder="请详细描述线索情况" />
          </Form.Item>
          <Form.Item name="relatedCompanies" label="关联企业">
            <Select mode="tags" placeholder="输入企业名称后回车添加">
              <Option value="企业A">企业A</Option>
              <Option value="企业B">企业B</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Clues;

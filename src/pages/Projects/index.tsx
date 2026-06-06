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
  InputNumber,
  DatePicker,
  Progress,
  Timeline,
  message,
} from 'antd';
import { Plus, Search, Eye, FileText, Edit, Clock } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { mockProjects, mockContracts } from '@/mock/projects';
import type { Project, Contract, ProjectType } from '@/types';
import { PROJECT_TYPE_OPTIONS, PROJECT_STATUS_OPTIONS } from '@/utils/constants';
import { formatMoney, formatDate, formatDateTime } from '@/utils/format';

const { Option } = Select;

const Projects: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ProjectType | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContractModal, setIsContractModal] = useState(false);
  const [isPerformanceModal, setIsPerformanceModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [form] = Form.useForm();

  const filteredProjects = activeTab === 'all'
    ? mockProjects
    : mockProjects.filter((p) => p.type === activeTab);

  const getStatusTag = (status: string) => {
    const option = PROJECT_STATUS_OPTIONS.find((o) => o.value === status);
    return option ? <Tag color={option.color}>{option.label}</Tag> : status;
  };

  const getTypeText = (type: string) => {
    const option = PROJECT_TYPE_OPTIONS.find((o) => o.value === type);
    return option ? option.label : type;
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
      render: (type) => getTypeText(type),
    },
    {
      title: '预算金额',
      dataIndex: 'budget',
      key: 'budget',
      width: 130,
      render: (budget) => formatMoney(budget),
    },
    {
      title: '采购人',
      dataIndex: 'purchaser',
      key: 'purchaser',
      width: 160,
      ellipsis: true,
    },
    {
      title: '登记日期',
      dataIndex: 'registerDate',
      key: 'registerDate',
      width: 120,
      render: (date) => formatDate(date),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => getStatusTag(status),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<Eye size={14} />}>
            详情
          </Button>
          <Button
            type="link"
            size="small"
            icon={<FileText size={14} />}
            onClick={() => {
              setSelectedProject(record);
              setIsContractModal(true);
            }}
          >
            合同
          </Button>
          <Button
            type="link"
            size="small"
            icon={<Clock size={14} />}
            onClick={() => {
              const contract = mockContracts.find((c) => c.projectId === record.id);
              if (contract) {
                setSelectedContract(contract);
                setIsPerformanceModal(true);
              } else {
                message.info('该项目暂无合同备案');
              }
            }}
          >
            履约
          </Button>
        </Space>
      ),
    },
  ];

  const handleSubmit = () => {
    form.validateFields().then(() => {
      message.success('项目登记成功');
      setIsModalOpen(false);
      form.resetFields();
    });
  };

  const getMilestoneColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'gray',
      in_progress: 'blue',
      completed: 'green',
      delayed: 'orange',
    };
    return colors[status] || 'gray';
  };

  const getMilestoneText = (status: string) => {
    const texts: Record<string, string> = {
      pending: '未开始',
      in_progress: '进行中',
      completed: '已完成',
      delayed: '已延期',
    };
    return texts[status] || status;
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <Row gutter={[16, 16]} align="middle">
          <Col>
            <Space wrap>
              <Button
                type={activeTab === 'all' ? 'primary' : 'default'}
                onClick={() => setActiveTab('all')}
              >
                全部项目
              </Button>
              {PROJECT_TYPE_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  type={activeTab === option.value ? 'primary' : 'default'}
                  onClick={() => setActiveTab(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </Space>
          </Col>
          <Col flex="auto" />
          <Col>
            <Space>
              <Input
                placeholder="搜索项目名称/编号"
                prefix={<Search size={16} />}
                style={{ width: 240 }}
              />
              <Button type="primary" icon={<Plus size={16} />} onClick={() => setIsModalOpen(true)}>
                项目登记
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card className="shadow-sm">
        <Table
          columns={columns}
          dataSource={filteredProjects}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>

      <Modal
        title="项目登记"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSubmit}
        width={700}
        okText="提交"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="项目名称"
                rules={[{ required: true, message: '请输入项目名称' }]}
              >
                <Input placeholder="请输入项目名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="项目类型"
                rules={[{ required: true, message: '请选择项目类型' }]}
              >
                <Select placeholder="请选择">
                  {PROJECT_TYPE_OPTIONS.map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="budget"
                label="预算金额(元)"
                rules={[{ required: true, message: '请输入预算金额' }]}
              >
                <InputNumber style={{ width: '100%' }} placeholder="请输入预算金额" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="purchaser"
                label="采购人"
                rules={[{ required: true, message: '请输入采购人' }]}
              >
                <Input placeholder="请输入采购人" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="agency" label="代理机构">
                <Input placeholder="请输入代理机构" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="registerDate" label="登记日期">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="description" label="项目描述">
                <Input.TextArea rows={3} placeholder="请输入项目描述" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Modal
        title="合同备案"
        open={isContractModal}
        onCancel={() => setIsContractModal(false)}
        onOk={() => {
          message.success('合同备案成功');
          setIsContractModal(false);
        }}
        width={700}
        okText="保存"
        cancelText="取消"
      >
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="合同编号">
                <Input placeholder="请输入合同编号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="合同金额(元)">
                <InputNumber style={{ width: '100%' }} placeholder="请输入合同金额" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="甲方">
                <Input placeholder="请输入甲方" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="乙方">
                <Input placeholder="请输入乙方" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="签订日期">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="开始日期">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="结束日期">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="合同内容">
                <Input.TextArea rows={3} placeholder="请输入合同主要内容" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="上传合同文件">
                <Button icon={<FileText size={14} />}>选择文件</Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Modal
        title="履约进度跟踪"
        open={isPerformanceModal}
        onCancel={() => setIsPerformanceModal(false)}
        footer={null}
        width={700}
      >
        {selectedContract && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700 font-medium">履约进度</span>
                <span className="text-primary-500 font-semibold">
                  {selectedContract.performanceProgress}%
                </span>
              </div>
              <Progress percent={selectedContract.performanceProgress} status="active" />
            </div>
            <div>
              <h4 className="text-gray-700 font-medium mb-4">里程碑节点</h4>
              <Timeline
                items={selectedContract.milestones.map((ms) => ({
                  color: getMilestoneColor(ms.status),
                  children: (
                    <div className="pb-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-800">{ms.name}</span>
                        <Tag color={getMilestoneColor(ms.status)}>
                          {getMilestoneText(ms.status)}
                        </Tag>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        计划日期：{formatDate(ms.planDate)}
                        {ms.actualDate && ` | 实际日期：${formatDate(ms.actualDate)}`}
                      </p>
                      <p className="text-sm text-gray-500">{ms.description}</p>
                    </div>
                  ),
                }))}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Projects;

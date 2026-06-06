import React, { useState, useMemo } from 'react';
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
  Descriptions,
  Divider,
} from 'antd';
import { Plus, Search, Eye, FileText, Edit, Clock, Save } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import type { Project, Contract, ProjectType, Milestone, MilestoneStatus } from '@/types';
import { PROJECT_TYPE_OPTIONS, PROJECT_STATUS_OPTIONS } from '@/utils/constants';
import { formatMoney, formatDate, formatDateTime } from '@/utils/format';

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

const initialContracts: Contract[] = [
  {
    id: 'C001',
    projectId: 'P004',
    projectName: '城市道路绿化提升工程',
    contractNo: 'HT-2026-045',
    contractAmount: 11800000,
    partyA: '市城市管理局',
    partyB: '市园林绿化工程有限公司',
    signDate: '2026-04-20',
    startDate: '2026-04-25',
    endDate: '2026-10-25',
    content: '城市主干道绿化景观提升改造工程施工',
    attachments: [],
    performanceProgress: 65,
    milestones: [
      {
        id: 'M001',
        contractId: 'C001',
        name: '项目开工',
        planDate: '2026-04-25',
        actualDate: '2026-04-25',
        status: 'completed',
        description: '施工队伍进场，开始现场清理',
      },
      {
        id: 'M002',
        contractId: 'C001',
        name: '苗木采购',
        planDate: '2026-05-10',
        actualDate: '2026-05-08',
        status: 'completed',
        description: '完成主要苗木采购并进场',
      },
      {
        id: 'M003',
        contractId: 'C001',
        name: '绿化种植',
        planDate: '2026-06-30',
        status: 'in_progress',
        description: '完成80%绿化种植工作',
      },
      {
        id: 'M004',
        contractId: 'C001',
        name: '景观亮化',
        planDate: '2026-08-15',
        status: 'pending',
        description: '安装景观照明设施',
      },
      {
        id: 'M005',
        contractId: 'C001',
        name: '竣工验收',
        planDate: '2026-10-25',
        status: 'pending',
        description: '项目整体竣工验收',
      },
    ],
  },
];

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [contracts, setContracts] = useState<Contract[]>(initialContracts);
  const [activeTab, setActiveTab] = useState<ProjectType | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContractModal, setIsContractModal] = useState(false);
  const [isPerformanceModal, setIsPerformanceModal] = useState(false);
  const [isDetailModal, setIsDetailModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();
  const [contractForm] = Form.useForm();

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchType = activeTab === 'all' || p.type === activeTab;
      const matchSearch = searchText === ''
        || p.name.toLowerCase().includes(searchText.toLowerCase())
        || p.code.toLowerCase().includes(searchText.toLowerCase());
      return matchType && matchSearch;
    });
  }, [projects, activeTab, searchText]);

  const getStatusTag = (status: string) => {
    const option = PROJECT_STATUS_OPTIONS.find((o) => o.value === status);
    return option ? <Tag color={option.color}>{option.label}</Tag> : status;
  };

  const getTypeText = (type: string) => {
    const option = PROJECT_TYPE_OPTIONS.find((o) => o.value === type);
    return option ? option.label : type;
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const newProject: Project = {
        id: `P${String(projects.length + 1).padStart(3, '0')}`,
        name: values.name,
        code: `GC-${new Date().getFullYear()}-${String(projects.length + 1).padStart(3, '0')}`,
        type: values.type,
        budget: values.budget,
        purchaser: values.purchaser,
        agency: values.agency || '',
        status: 'registered',
        registerDate: values.registerDate ? values.registerDate.format('YYYY-MM-DD') : new Date().toISOString().slice(0, 10),
        description: values.description || '',
        attachments: [],
      };
      setProjects((prev) => [newProject, ...prev]);
      message.success('项目登记成功');
      setIsModalOpen(false);
      form.resetFields();
    });
  };

  const handleContractSubmit = () => {
    contractForm.validateFields().then((values) => {
      if (!selectedProject) return;

      const existingContract = contracts.find((c) => c.projectId === selectedProject.id);

      const newContract: Contract = {
        id: existingContract ? existingContract.id : `C${String(contracts.length + 1).padStart(3, '0')}`,
        projectId: selectedProject.id,
        projectName: selectedProject.name,
        contractNo: values.contractNo || `HT-${new Date().getFullYear()}-${String(contracts.length + 1).padStart(3, '0')}`,
        contractAmount: values.contractAmount || selectedProject.budget,
        partyA: values.partyA || selectedProject.purchaser,
        partyB: values.partyB,
        signDate: values.signDate ? values.signDate.format('YYYY-MM-DD') : new Date().toISOString().slice(0, 10),
        startDate: values.startDate ? values.startDate.format('YYYY-MM-DD') : new Date().toISOString().slice(0, 10),
        endDate: values.endDate ? values.endDate.format('YYYY-MM-DD') : new Date().toISOString().slice(0, 10),
        content: values.content || '',
        attachments: [],
        performanceProgress: existingContract ? existingContract.performanceProgress : 0,
        milestones: existingContract
          ? existingContract.milestones
          : [
              {
                id: 'M001',
                contractId: `C${String(contracts.length + 1).padStart(3, '0')}`,
                name: '项目开工',
                planDate: values.startDate ? values.startDate.format('YYYY-MM-DD') : new Date().toISOString().slice(0, 10),
                status: 'pending',
                description: '施工准备及进场',
              },
              {
                id: 'M002',
                contractId: `C${String(contracts.length + 1).padStart(3, '0')}`,
                name: '主体施工/供货',
                planDate: dayjs(values.startDate || new Date()).add(30, 'day').format('YYYY-MM-DD'),
                status: 'pending',
                description: '主要工程施工或货物供应',
              },
              {
                id: 'M003',
                contractId: `C${String(contracts.length + 1).padStart(3, '0')}`,
                name: '竣工验收',
                planDate: values.endDate ? values.endDate.format('YYYY-MM-DD') : new Date().toISOString().slice(0, 10),
                status: 'pending',
                description: '项目验收及交付',
              },
            ],
      };

      if (existingContract) {
        setContracts((prev) =>
          prev.map((c) => (c.id === existingContract.id ? { ...newContract, id: existingContract.id } : c))
        );
      } else {
        setContracts((prev) => [...prev, newContract]);
      }

      setProjects((prev) =>
        prev.map((p) => (p.id === selectedProject.id ? { ...p, status: 'contract' as const } : p))
      );

      message.success('合同备案成功');
      setIsContractModal(false);
      contractForm.resetFields();
    });
  };

  const updateMilestoneStatus = (milestoneId: string, newStatus: MilestoneStatus) => {
    if (!selectedContract) return;

    setContracts((prev) =>
      prev.map((c) => {
        if (c.id !== selectedContract.id) return c;

        const updatedMilestones = c.milestones.map((m) =>
          m.id === milestoneId
            ? {
                ...m,
                status: newStatus,
                actualDate: newStatus === 'completed' || newStatus === 'in_progress'
                  ? new Date().toISOString().slice(0, 10)
                  : m.actualDate,
              }
            : m
        );

        const completedCount = updatedMilestones.filter((m) => m.status === 'completed').length;
        const totalCount = updatedMilestones.length;
        const newProgress = Math.round((completedCount / totalCount) * 100);

        return {
          ...c,
          milestones: updatedMilestones,
          performanceProgress: newProgress,
        };
      })
    );

    setSelectedContract((prev) => {
      if (!prev) return null;
      const updatedMilestones = prev.milestones.map((m) =>
        m.id === milestoneId
          ? {
              ...m,
              status: newStatus,
              actualDate: newStatus === 'completed' || newStatus === 'in_progress'
                ? new Date().toISOString().slice(0, 10)
                : m.actualDate,
            }
          : m
      );
      const completedCount = updatedMilestones.filter((m) => m.status === 'completed').length;
      const totalCount = updatedMilestones.length;
      const newProgress = Math.round((completedCount / totalCount) * 100);
      return {
        ...prev,
        milestones: updatedMilestones,
        performanceProgress: newProgress,
      };
    });

    message.success('里程碑状态已更新');
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

  const openContractModal = (project: Project) => {
    setSelectedProject(project);
    const existingContract = contracts.find((c) => c.projectId === project.id);
    if (existingContract) {
      contractForm.setFieldsValue({
        contractNo: existingContract.contractNo,
        contractAmount: existingContract.contractAmount,
        partyA: existingContract.partyA,
        partyB: existingContract.partyB,
        signDate: dayjs(existingContract.signDate),
        startDate: dayjs(existingContract.startDate),
        endDate: dayjs(existingContract.endDate),
        content: existingContract.content,
      });
    }
    setIsContractModal(true);
  };

  const openPerformanceModal = (project: Project) => {
    const contract = contracts.find((c) => c.projectId === project.id);
    if (contract) {
      setSelectedContract(contract);
      setIsPerformanceModal(true);
    } else {
      message.info('该项目暂无合同备案，请先进行合同备案');
    }
  };

  const openDetailModal = (project: Project) => {
    setSelectedProject(project);
    setIsDetailModal(true);
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
      width: 220,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<Eye size={14} />}
            onClick={() => openDetailModal(record)}
          >
            详情
          </Button>
          <Button
            type="link"
            size="small"
            icon={<FileText size={14} />}
            onClick={() => openContractModal(record)}
          >
            合同
          </Button>
          <Button
            type="link"
            size="small"
            icon={<Clock size={14} />}
            onClick={() => openPerformanceModal(record)}
          >
            履约
          </Button>
        </Space>
      ),
    },
  ];

  const projectContract = selectedProject ? contracts.find((c) => c.projectId === selectedProject.id) : null;

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
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
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
                <InputNumber style={{ width: '100%' }} placeholder="请输入预算金额" min={0} />
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
        onOk={handleContractSubmit}
        width={700}
        okText="保存"
        cancelText="取消"
      >
        <Form form={contractForm} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="contractNo"
                label="合同编号"
                rules={[{ required: true, message: '请输入合同编号' }]}
              >
                <Input placeholder="请输入合同编号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="contractAmount"
                label="合同金额(元)"
                rules={[{ required: true, message: '请输入合同金额' }]}
              >
                <InputNumber style={{ width: '100%' }} placeholder="请输入合同金额" min={0} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="partyA"
                label="甲方(采购人)"
                rules={[{ required: true, message: '请输入甲方' }]}
              >
                <Input placeholder="请输入甲方" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="partyB"
                label="乙方(供应商/承建商)"
                rules={[{ required: true, message: '请输入乙方' }]}
              >
                <Input placeholder="请输入乙方" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="signDate"
                label="签订日期"
                rules={[{ required: true, message: '请选择签订日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="startDate"
                label="开始日期"
                rules={[{ required: true, message: '请选择开始日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="endDate"
                label="结束日期"
                rules={[{ required: true, message: '请选择结束日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="content" label="合同内容">
                <Input.TextArea rows={3} placeholder="请输入合同主要内容" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Modal
        title="项目详情"
        open={isDetailModal}
        onCancel={() => setIsDetailModal(false)}
        footer={null}
        width={800}
      >
        {selectedProject && (
          <div className="space-y-4">
            <Descriptions column={2} bordered size="small" title="项目基本信息">
              <Descriptions.Item label="项目编号">{selectedProject.code}</Descriptions.Item>
              <Descriptions.Item label="项目名称" span={1}>
                {selectedProject.name}
              </Descriptions.Item>
              <Descriptions.Item label="项目类型">{getTypeText(selectedProject.type)}</Descriptions.Item>
              <Descriptions.Item label="预算金额">{formatMoney(selectedProject.budget)}</Descriptions.Item>
              <Descriptions.Item label="采购人">{selectedProject.purchaser}</Descriptions.Item>
              <Descriptions.Item label="代理机构">{selectedProject.agency || '-'}</Descriptions.Item>
              <Descriptions.Item label="登记日期">{formatDate(selectedProject.registerDate)}</Descriptions.Item>
              <Descriptions.Item label="项目状态">{getStatusTag(selectedProject.status)}</Descriptions.Item>
              <Descriptions.Item label="项目描述" span={2}>
                {selectedProject.description || '-'}
              </Descriptions.Item>
            </Descriptions>

            {projectContract && (
              <>
                <Divider orientation="left">合同信息</Divider>
                <Descriptions column={2} bordered size="small">
                  <Descriptions.Item label="合同编号">{projectContract.contractNo}</Descriptions.Item>
                  <Descriptions.Item label="合同金额">{formatMoney(projectContract.contractAmount)}</Descriptions.Item>
                  <Descriptions.Item label="甲方">{projectContract.partyA}</Descriptions.Item>
                  <Descriptions.Item label="乙方">{projectContract.partyB}</Descriptions.Item>
                  <Descriptions.Item label="签订日期">{formatDate(projectContract.signDate)}</Descriptions.Item>
                  <Descriptions.Item label="履约进度">{projectContract.performanceProgress}%</Descriptions.Item>
                </Descriptions>
              </>
            )}
          </div>
        )}
      </Modal>

      <Modal
        title="履约进度跟踪"
        open={isPerformanceModal}
        onCancel={() => setIsPerformanceModal(false)}
        footer={[
          <Button key="close" onClick={() => setIsPerformanceModal(false)}>
            关闭
          </Button>,
        ]}
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
                        <Space>
                          <Tag color={getMilestoneColor(ms.status)}>
                            {getMilestoneText(ms.status)}
                          </Tag>
                          {ms.status !== 'completed' && (
                            <Select
                              size="small"
                              style={{ width: 100 }}
                              value={ms.status}
                              onChange={(value: MilestoneStatus) => updateMilestoneStatus(ms.id, value)}
                            >
                              <Option value="pending">未开始</Option>
                              <Option value="in_progress">进行中</Option>
                              <Option value="completed">已完成</Option>
                              <Option value="delayed">已延期</Option>
                            </Select>
                          )}
                        </Space>
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

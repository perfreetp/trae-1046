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
  message,
  Tabs,
  Descriptions,
  Timeline,
  Progress,
  List,
  Empty,
} from 'antd';
import {
  Search,
  Plus,
  Eye,
  FileText,
  Clock,
  AlertCircle,
  CheckCircle2,
  FileCheck,
  HandshakeIcon,
  TrendingUp,
  MessageSquare,
} from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import type {
  Project,
  Contract,
  Milestone,
  MilestoneProgress,
  ProjectStatus,
  MilestoneStatus,
} from '@/types';
import {
  PROJECT_TYPE_OPTIONS,
  PROJECT_STATUS_OPTIONS,
  MILESTONE_STATUS_OPTIONS,
} from '@/utils/constants';
import { formatMoney, formatDateTime, formatDate } from '@/utils/format';
import dayjs from 'dayjs';

const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

const initialProjects: Project[] = [
  {
    id: 'P001',
    name: '市民服务中心装修工程',
    code: 'GC-2026-001',
    type: 'engineering',
    budget: 25000000,
    purchaser: '市政务服务管理局',
    agency: '市政府采购中心',
    status: 'completed',
    registerDate: '2026-01-15',
    description: '市民服务中心一至三楼整体装修改造工程',
    attachments: ['招标文件.pdf', '设计图纸.zip'],
  },
  {
    id: 'P002',
    name: '市属医院医疗设备采购项目',
    code: 'CG-2026-005',
    type: 'procurement',
    budget: 15800000,
    purchaser: '市卫生健康委员会',
    agency: '市政府采购中心',
    status: 'performing',
    registerDate: '2026-02-20',
    description: 'CT、MRI等大型医疗设备集中采购',
    attachments: ['采购需求.docx', '技术参数.pdf'],
  },
  {
    id: 'P003',
    name: '工业园区标准厂房产权转让',
    code: 'CQ-2026-003',
    type: 'property',
    budget: 85000000,
    purchaser: '市工业园区管委会',
    agency: '市产权交易中心',
    status: 'contract',
    registerDate: '2026-03-10',
    description: '工业园区A区1-5号标准厂房整体转让',
    attachments: ['资产评估报告.pdf', '产权证明.zip'],
  },
  {
    id: 'P004',
    name: '城市道路绿化提升工程',
    code: 'GC-2026-012',
    type: 'engineering',
    budget: 12000000,
    purchaser: '市园林绿化局',
    agency: '市公共资源交易中心',
    status: 'announced',
    registerDate: '2026-04-05',
    description: '城市主干道绿化景观提升，全长15公里',
    attachments: [],
  },
  {
    id: 'P005',
    name: '智慧校园信息化建设项目',
    code: 'CG-2026-018',
    type: 'procurement',
    budget: 6800000,
    purchaser: '市教育局',
    agency: '市政府采购中心',
    status: 'bidding',
    registerDate: '2026-04-15',
    description: '市属中学智慧校园信息化系统建设',
    attachments: ['招标文件.docx'],
  },
  {
    id: 'P006',
    name: '污水处理厂二期扩建工程',
    code: 'GC-2026-020',
    type: 'engineering',
    budget: 38000000,
    purchaser: '市水务局',
    agency: '市公共资源交易中心',
    status: 'registered',
    registerDate: '2026-05-08',
    description: '日处理能力从5万吨扩建至10万吨',
    attachments: ['项目批文.pdf'],
  },
  {
    id: 'P007',
    name: '公立医院医疗设备集中采购',
    code: 'CG-2026-025',
    type: 'procurement',
    budget: 18500000,
    purchaser: '市公立医院管理中心',
    agency: '市政府采购中心',
    status: 'registered',
    registerDate: '2026-05-18',
    description: 'CT设备3台、MRI设备2台、DR设备5台',
    attachments: [],
  },
  {
    id: 'P008',
    name: '老旧写字楼房产转让',
    code: 'CQ-2026-008',
    type: 'property',
    budget: 45000000,
    purchaser: '市机关事务管理局',
    agency: '市产权交易中心',
    status: 'completed',
    registerDate: '2026-03-25',
    description: '中心区老政务办公楼整体转让',
    attachments: ['房产证复印件.pdf'],
  },
];

const generateDefaultMilestones = (contractId: string): Milestone[] => [
  {
    id: `M${Date.now()}-1`,
    contractId,
    name: '合同签订',
    planDate: dayjs().format('YYYY-MM-DD'),
    status: 'completed',
    description: '双方签订正式合同',
    progressRecords: [],
  },
  {
    id: `M${Date.now()}-2`,
    contractId,
    name: '进场准备',
    planDate: dayjs().add(7, 'day').format('YYYY-MM-DD'),
    status: 'pending',
    description: '施工队伍进场，完成施工准备',
    progressRecords: [],
  },
  {
    id: `M${Date.now()}-3`,
    contractId,
    name: '主体施工',
    planDate: dayjs().add(30, 'day').format('YYYY-MM-DD'),
    status: 'pending',
    description: '完成主体工程施工',
    progressRecords: [],
  },
  {
    id: `M${Date.now()}-4`,
    contractId,
    name: '竣工验收',
    planDate: dayjs().add(90, 'day').format('YYYY-MM-DD'),
    status: 'pending',
    description: '完成竣工验收并交付使用',
    progressRecords: [],
  },
];

const initialContracts: Contract[] = [
  {
    id: 'C001',
    projectId: 'P002',
    projectName: '市属医院医疗设备采购项目',
    contractNo: 'HT-2026-025',
    contractAmount: 15600000,
    partyA: '市卫生健康委员会',
    partyB: '市医疗器械有限公司',
    signDate: '2026-04-10',
    startDate: '2026-04-15',
    endDate: '2026-07-15',
    content: 'CT设备2台、MRI设备1台、DR设备3台的采购及安装',
    attachments: ['合同扫描件.pdf'],
    performanceProgress: 30,
    milestones: [
      {
        id: 'M001',
        contractId: 'C001',
        name: '合同签订',
        planDate: '2026-04-10',
        actualDate: '2026-04-10',
        status: 'completed',
        description: '双方签订正式合同',
        progressRecords: [
          {
            id: 'PR001',
            milestoneId: 'M001',
            updateTime: '2026-04-10 10:00:00',
            operator: '项目管理员',
            progressNote: '合同已由双方签字盖章，正式生效',
            actualDate: '2026-04-10',
            attachmentName: '合同扫描件.pdf',
          },
        ],
      },
      {
        id: 'M002',
        contractId: 'C001',
        name: '设备生产',
        planDate: '2026-04-20',
        actualDate: '2026-05-05',
        status: 'completed',
        description: '供应商按订单生产设备',
        progressRecords: [
          {
            id: 'PR002',
            milestoneId: 'M002',
            updateTime: '2026-05-05 14:30:00',
            operator: '项目管理员',
            progressNote: '设备生产完成，已通过出厂检验',
            actualDate: '2026-05-05',
            attachmentName: '出厂检验报告.pdf',
          },
        ],
      },
      {
        id: 'M003',
        contractId: 'C001',
        name: '设备安装调试',
        planDate: '2026-06-01',
        status: 'in_progress',
        description: '设备到场安装并完成调试',
        progressRecords: [
          {
            id: 'PR003',
            milestoneId: 'M003',
            updateTime: '2026-05-28 09:00:00',
            operator: '项目管理员',
            progressNote: '设备已运抵现场，开始安装',
          },
        ],
      },
      {
        id: 'M004',
        contractId: 'C001',
        name: '验收交付',
        planDate: '2026-07-10',
        status: 'pending',
        description: '完成验收并交付医院使用',
        progressRecords: [],
      },
    ],
  },
  {
    id: 'C002',
    projectId: 'P003',
    projectName: '工业园区标准厂房产权转让',
    contractNo: 'HT-2026-038',
    contractAmount: 84500000,
    partyA: '市工业园区管委会',
    partyB: '市产业投资集团有限公司',
    signDate: '2026-05-15',
    startDate: '2026-05-15',
    endDate: '2026-08-15',
    content: '工业园区A区1-5号标准厂房产权转让',
    attachments: ['产权转让合同.pdf'],
    performanceProgress: 25,
    milestones: [
      {
        id: 'M005',
        contractId: 'C002',
        name: '合同签订',
        planDate: '2026-05-15',
        actualDate: '2026-05-15',
        status: 'completed',
        description: '双方签订产权转让合同',
        progressRecords: [],
      },
      {
        id: 'M006',
        contractId: 'C002',
        name: '产权过户',
        planDate: '2026-06-15',
        status: 'in_progress',
        description: '办理不动产产权过户手续',
        progressRecords: [],
      },
      {
        id: 'M007',
        contractId: 'C002',
        name: '款项支付',
        planDate: '2026-07-15',
        status: 'pending',
        description: '受让方支付全部转让价款',
        progressRecords: [],
      },
      {
        id: 'M008',
        contractId: 'C002',
        name: '物业交割',
        planDate: '2026-08-15',
        status: 'pending',
        description: '完成厂房物业交割',
        progressRecords: [],
      },
    ],
  },
];

const lifecycleStages = [
  { key: 'registered', title: '项目登记', icon: <FileText size={16} />, color: 'blue' },
  { key: 'announced', title: '公告发布', icon: <FileCheck size={16} />, color: 'cyan' },
  { key: 'bidding', title: '开标', icon: <Clock size={16} />, color: 'purple' },
  { key: 'evaluating', title: '评标', icon: <AlertCircle size={16} />, color: 'geekblue' },
  { key: 'result', title: '结果公示', icon: <CheckCircle2 size={16} />, color: 'gold' },
  { key: 'contract', title: '合同签订', icon: <HandshakeIcon size={16} />, color: 'orange' },
  { key: 'performing', title: '履约进行', icon: <TrendingUp size={16} />, color: 'green' },
  { key: 'complaints', title: '投诉线索', icon: <MessageSquare size={16} />, color: 'red' },
  { key: 'completed', title: '项目完成', icon: <CheckCircle2 size={16} />, color: 'success' },
];

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [contracts, setContracts] = useState<Contract[]>(initialContracts);
  const [isAddModal, setIsAddModal] = useState(false);
  const [isDetailModal, setIsDetailModal] = useState(false);
  const [isContractModal, setIsContractModal] = useState(false);
  const [isProgressModal, setIsProgressModal] = useState(false);
  const [isMilestoneModal, setIsMilestoneModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchText, setSearchText] = useState<string>('');
  const [projectForm] = Form.useForm();
  const [contractForm] = Form.useForm();
  const [milestoneForm] = Form.useForm();

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchType = typeFilter === 'all' || p.type === typeFilter;
      const matchStatus = statusFilter === 'all' || p.status === statusFilter;
      const matchSearch = searchText === ''
        || p.name.toLowerCase().includes(searchText.toLowerCase())
        || p.code.toLowerCase().includes(searchText.toLowerCase());
      return matchType && matchStatus && matchSearch;
    });
  }, [projects, typeFilter, statusFilter, searchText]);

  const getProjectContracts = (projectId: string) => {
    return contracts.filter((c) => c.projectId === projectId);
  };

  const handleSubmit = () => {
    projectForm.validateFields().then((values) => {
      const newProject: Project = {
        ...values,
        id: `P${String(projects.length + 1).padStart(3, '0')}`,
        code: `${values.type === 'engineering' ? 'GC' : values.type === 'procurement' ? 'CG' : 'CQ'}-2026-${String(projects.length + 1).padStart(3, '0')}`,
        status: 'registered' as ProjectStatus,
        registerDate: dayjs().format('YYYY-MM-DD'),
        attachments: [],
      };
      setProjects([newProject, ...projects]);
      message.success('项目登记成功');
      setIsAddModal(false);
      projectForm.resetFields();
    });
  };

  const handleContractSubmit = () => {
    contractForm.validateFields().then((values) => {
      const contractId = `C${String(contracts.length + 1).padStart(3, '0')}`;
      const newContract: Contract = {
        ...values,
        id: contractId,
        projectId: selectedProject?.id || '',
        projectName: selectedProject?.name || '',
        signDate: values.signDate?.format('YYYY-MM-DD') || dayjs().format('YYYY-MM-DD'),
        startDate: values.startDate?.format('YYYY-MM-DD') || dayjs().format('YYYY-MM-DD'),
        endDate: values.endDate?.format('YYYY-MM-DD') || dayjs().add(90, 'day').format('YYYY-MM-DD'),
        attachments: [],
        performanceProgress: 0,
        milestones: generateDefaultMilestones(contractId),
      };
      setContracts([...contracts, newContract]);
      if (selectedProject) {
        setProjects((prev) =>
          prev.map((p) =>
            p.id === selectedProject.id ? { ...p, status: 'contract' as ProjectStatus } : p
          )
        );
      }
      message.success('合同备案成功');
      setIsContractModal(false);
      contractForm.resetFields();
    });
  };

  const updateMilestoneStatus = (milestoneId: string, newStatus: MilestoneStatus, progressData?: { note: string; actualDate?: string; attachmentName?: string }) => {
    const now = dayjs().format('YYYY-MM-DD HH:mm:ss');
    const actualDate = progressData?.actualDate || (newStatus === 'completed' ? dayjs().format('YYYY-MM-DD') : undefined);

    setContracts((prev) =>
      prev.map((contract) => {
        if (contract.milestones.some((m) => m.id === milestoneId)) {
          const updatedMilestones = contract.milestones.map((m) => {
            if (m.id === milestoneId) {
              const newProgressRecord: MilestoneProgress = {
                id: `PR${Date.now()}`,
                milestoneId,
                updateTime: now,
                operator: '当前监管员',
                progressNote: progressData?.note || `状态更新为：${MILESTONE_STATUS_OPTIONS.find((o) => o.value === newStatus)?.label}`,
                actualDate,
                attachmentName: progressData?.attachmentName,
              };
              return {
                ...m,
                status: newStatus,
                actualDate: actualDate || m.actualDate,
                progressRecords: [...(m.progressRecords || []), newProgressRecord],
              };
            }
            return m;
          });
          const completedCount = updatedMilestones.filter((m) => m.status === 'completed').length;
          const totalCount = updatedMilestones.length;
          const newProgress = Math.round((completedCount / totalCount) * 100);
          return {
            ...contract,
            milestones: updatedMilestones,
            performanceProgress: newProgress,
          };
        }
        return contract;
      })
    );
    message.success('里程碑状态已更新');
  };

  const showDetailModal = (record: Project) => {
    setSelectedProject(record);
    setIsDetailModal(true);
  };

  const showContractModal = (record: Project) => {
    setSelectedProject(record);
    setIsContractModal(true);
  };

  const showProgressModal = (record: Project) => {
    setSelectedProject(record);
    const projectContracts = getProjectContracts(record.id);
    if (projectContracts.length > 0) {
      setSelectedContract(projectContracts[0]);
    }
    setIsProgressModal(true);
  };

  const showMilestoneModal = (milestone: Milestone, contract: Contract) => {
    setSelectedMilestone(milestone);
    setSelectedContract(contract);
    milestoneForm.setFieldsValue({
      status: milestone.status,
      progressNote: '',
      actualDate: milestone.actualDate ? dayjs(milestone.actualDate) : undefined,
      attachmentName: '',
    });
    setIsMilestoneModal(true);
  };

  const handleMilestoneUpdate = () => {
    milestoneForm.validateFields().then((values) => {
      if (selectedMilestone) {
        updateMilestoneStatus(selectedMilestone.id, values.status, {
          note: values.progressNote,
          actualDate: values.actualDate?.format('YYYY-MM-DD'),
          attachmentName: values.attachmentName,
        });
        setIsMilestoneModal(false);
        milestoneForm.resetFields();
      }
    });
  };

  const getStatusTag = (status: string) => {
    const option = PROJECT_STATUS_OPTIONS.find((o) => o.value === status);
    return option ? <Tag color={option.color}>{option.label}</Tag> : status;
  };

  const getTypeText = (type: string) => {
    const option = PROJECT_TYPE_OPTIONS.find((o) => o.value === type);
    return option ? option.label : type;
  };

  const getCurrentStageIndex = (status: string) => {
    const statusOrder: Record<string, number> = {
      registered: 0,
      announced: 1,
      bidding: 2,
      evaluating: 3,
      result: 4,
      contract: 5,
      performing: 6,
      complaints: 7,
      completed: 8,
    };
    return statusOrder[status] ?? 0;
  };

  const getAllProgressRecords = (contract: Contract) => {
    const records: (MilestoneProgress & { milestoneName: string })[] = [];
    contract.milestones.forEach((m) => {
      if (m.progressRecords) {
        m.progressRecords.forEach((pr) => {
          records.push({ ...pr, milestoneName: m.name });
        });
      }
    });
    return records.sort((a, b) => a.updateTime.localeCompare(b.updateTime));
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
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type) => getTypeText(type),
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
      width: 160,
      ellipsis: true,
    },
    {
      title: '登记日期',
      dataIndex: 'registerDate',
      key: 'registerDate',
      width: 110,
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
            onClick={() => showDetailModal(record)}
          >
            详情
          </Button>
          <Button
            type="link"
            size="small"
            icon={<FileText size={14} />}
            onClick={() => showContractModal(record)}
          >
            合同
          </Button>
          <Button
            type="link"
            size="small"
            icon={<TrendingUp size={14} />}
            onClick={() => showProgressModal(record)}
          >
            履约
          </Button>
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
              <Button
                type="primary"
                icon={<Plus size={16} />}
                onClick={() => setIsAddModal(true)}
              >
                项目登记
              </Button>
              <Select
                defaultValue="all"
                style={{ width: 130 }}
                onChange={(value) => setTypeFilter(value)}
                value={typeFilter}
              >
                <Option value="all">全部类型</Option>
                {PROJECT_TYPE_OPTIONS.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
              <Select
                defaultValue="all"
                style={{ width: 130 }}
                onChange={(value) => setStatusFilter(value)}
                value={statusFilter}
              >
                <Option value="all">全部状态</Option>
                {PROJECT_STATUS_OPTIONS.map((option) => (
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
              placeholder="搜索项目名称或编号"
              prefix={<Search size={16} />}
              style={{ width: 280 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
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
        open={isAddModal}
        onCancel={() => {
          setIsAddModal(false);
          projectForm.resetFields();
        }}
        onOk={handleSubmit}
        width={600}
      >
        <Form form={projectForm} layout="vertical">
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                name="name"
                label="项目名称"
                rules={[{ required: true, message: '请输入项目名称' }]}
              >
                <Input placeholder="请输入项目名称" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="type"
                label="交易类型"
                rules={[{ required: true, message: '请选择交易类型' }]}
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
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="budget"
                label="预算金额（元）"
                rules={[{ required: true, message: '请输入预算金额' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="请输入预算金额"
                  min={0}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value!.replace(/\$\s?|(,*)/g, '') as unknown as number}
                />
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
          </Row>
          <Form.Item
            name="agency"
            label="代理机构"
          >
            <Input placeholder="请输入代理机构" />
          </Form.Item>
          <Form.Item
            name="description"
            label="项目描述"
          >
            <TextArea rows={3} placeholder="请输入项目描述" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="项目详情"
        open={isDetailModal}
        onCancel={() => setIsDetailModal(false)}
        footer={null}
        width={1000}
      >
        {selectedProject && (
          <Tabs defaultActiveKey="basic">
            <TabPane tab="基本信息" key="basic">
              <Descriptions column={2} bordered size="small">
                <Descriptions.Item label="项目名称" span={2}>
                  {selectedProject.name}
                </Descriptions.Item>
                <Descriptions.Item label="项目编号">
                  {selectedProject.code}
                </Descriptions.Item>
                <Descriptions.Item label="交易类型">
                  {getTypeText(selectedProject.type)}
                </Descriptions.Item>
                <Descriptions.Item label="预算金额">
                  {formatMoney(selectedProject.budget)}
                </Descriptions.Item>
                <Descriptions.Item label="状态">
                  {getStatusTag(selectedProject.status)}
                </Descriptions.Item>
                <Descriptions.Item label="采购人">
                  {selectedProject.purchaser}
                </Descriptions.Item>
                <Descriptions.Item label="代理机构">
                  {selectedProject.agency}
                </Descriptions.Item>
                <Descriptions.Item label="登记日期">
                  {formatDate(selectedProject.registerDate)}
                </Descriptions.Item>
                <Descriptions.Item label="项目描述" span={2}>
                  {selectedProject.description || '-'}
                </Descriptions.Item>
              </Descriptions>
            </TabPane>
            <TabPane tab="全生命周期" key="lifecycle">
              <div className="py-4">
                <Timeline
                  mode="left"
                  items={lifecycleStages.map((stage, index) => {
                    const currentIndex = getCurrentStageIndex(selectedProject.status);
                    const isPast = index < currentIndex;
                    const isCurrent = index === currentIndex;
                    const isComplaintStage = stage.key === 'complaints';
                    let dotColor = isPast ? 'green' : isCurrent ? 'blue' : 'gray';
                    if (isComplaintStage) dotColor = 'gray';
                    return {
                      color: dotColor,
                      dot: stage.icon,
                      children: (
                        <div className="pb-4">
                          <div className="font-medium text-gray-800 mb-1">
                            {stage.title}
                            {isCurrent && !isComplaintStage && <Tag color="blue" className="ml-2">进行中</Tag>}
                            {isPast && !isComplaintStage && <Tag color="green" className="ml-2">已完成</Tag>}
                            {isComplaintStage && <Tag color="default" className="ml-2">全阶段</Tag>}
                          </div>
                          {stage.key === 'registered' && (
                            <p className="text-sm text-gray-500">
                              登记时间：{formatDateTime(selectedProject.registerDate + ' 00:00:00')}
                            </p>
                          )}
                          {stage.key === 'complaints' ? (
                            <p className="text-sm text-gray-400">
                              该项目暂无可公开的投诉或异常线索记录
                            </p>
                          ) : (
                            <>
                              {isPast || isCurrent ? (
                                <p className="text-sm text-gray-500">
                                  {isPast ? '该阶段已完成' : '当前处于此阶段'}
                                </p>
                              ) : (
                                <p className="text-sm text-gray-400">
                                  暂未进入该阶段
                                </p>
                              )}
                            </>
                          )}
                        </div>
                      ),
                    };
                  })}
                />
              </div>
            </TabPane>
            <TabPane tab="合同信息" key="contracts">
              {(() => {
                const projectContracts = getProjectContracts(selectedProject.id);
                if (projectContracts.length === 0) {
                  return <Empty description="暂无合同备案" />;
                }
                return (
                  <List
                    itemLayout="vertical"
                    dataSource={projectContracts}
                    renderItem={(contract) => (
                      <List.Item key={contract.id}>
                        <Card size="small" className="w-full">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-medium text-gray-800">{contract.contractNo}</h4>
                              <p className="text-sm text-gray-500">
                                甲方：{contract.partyA} → 乙方：{contract.partyB}
                              </p>
                            </div>
                            <Tag color="blue">金额：{formatMoney(contract.contractAmount)}</Tag>
                          </div>
                          <Row gutter={16}>
                            <Col span={8}>
                              <p className="text-xs text-gray-500">签订日期</p>
                              <p className="text-sm">{formatDate(contract.signDate)}</p>
                            </Col>
                            <Col span={8}>
                              <p className="text-xs text-gray-500">履约进度</p>
                              <Progress percent={contract.performanceProgress} size="small" />
                            </Col>
                            <Col span={8}>
                              <p className="text-xs text-gray-500">里程碑</p>
                              <p className="text-sm">
                                {contract.milestones.filter((m) => m.status === 'completed').length} / {contract.milestones.length} 已完成
                              </p>
                            </Col>
                          </Row>
                        </Card>
                      </List.Item>
                    )}
                  />
                );
              })()}
            </TabPane>
            <TabPane tab="投诉线索" key="complaints">
              <Empty description="暂无相关投诉线索" />
            </TabPane>
          </Tabs>
        )}
      </Modal>

      <Modal
        title="合同备案"
        open={isContractModal}
        onCancel={() => {
          setIsContractModal(false);
          contractForm.resetFields();
        }}
        onOk={handleContractSubmit}
        width={600}
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
                label="合同金额（元）"
                rules={[{ required: true, message: '请输入合同金额' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="请输入合同金额"
                  min={0}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value!.replace(/\$\s?|(,*)/g, '') as unknown as number}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="partyA"
                label="甲方（采购人）"
                rules={[{ required: true, message: '请输入甲方名称' }]}
              >
                <Input placeholder="请输入甲方名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="partyB"
                label="乙方（供应商/承建方）"
                rules={[{ required: true, message: '请输入乙方名称' }]}
              >
                <Input placeholder="请输入乙方名称" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
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
          </Row>
          <Form.Item
            name="content"
            label="合同内容"
          >
            <TextArea rows={3} placeholder="请输入合同主要内容" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="履约进度跟踪"
        open={isProgressModal}
        onCancel={() => setIsProgressModal(false)}
        footer={null}
        width={900}
      >
        {selectedProject && (
          <>
            <div className="mb-4">
              <h4 className="font-medium text-gray-800 mb-1">{selectedProject.name}</h4>
              <p className="text-sm text-gray-500">项目编号：{selectedProject.code}</p>
            </div>
            {(() => {
              const projectContracts = getProjectContracts(selectedProject.id);
              if (projectContracts.length === 0) {
                return <Empty description="该项目暂无合同备案，请先备案合同" />;
              }
              return (
                <Tabs defaultActiveKey={projectContracts[0].id}>
                  {projectContracts.map((contract) => (
                    <TabPane
                      tab={`${contract.contractNo} (${contract.performanceProgress}%)`}
                      key={contract.id}
                    >
                      <div className="mb-4">
                        <Row gutter={16} align="middle">
                          <Col span={12}>
                            <p className="text-sm text-gray-500">合同金额</p>
                            <p className="font-medium text-lg">{formatMoney(contract.contractAmount)}</p>
                          </Col>
                          <Col span={12}>
                            <p className="text-sm text-gray-500 mb-1">总体履约进度</p>
                            <Progress percent={contract.performanceProgress} status="active" />
                          </Col>
                        </Row>
                      </div>
                      <div className="mb-4">
                        <h5 className="font-medium text-gray-700 mb-3">里程碑节点</h5>
                        <Timeline
                          items={contract.milestones.map((milestone) => {
                            const statusOption = MILESTONE_STATUS_OPTIONS.find(
                              (o) => o.value === milestone.status
                            );
                            return {
                              color: milestone.status === 'completed' ? 'green' : milestone.status === 'in_progress' ? 'blue' : 'gray',
                              children: (
                                <div className="pb-3">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <span className="font-medium text-gray-800">
                                        {milestone.name}
                                      </span>
                                      <Tag color={statusOption?.color} className="ml-2">
                                        {statusOption?.label}
                                      </Tag>
                                    </div>
                                    <Button
                                      type="link"
                                      size="small"
                                      onClick={() => showMilestoneModal(milestone, contract)}
                                    >
                                      更新状态
                                    </Button>
                                  </div>
                                  <p className="text-sm text-gray-500 mt-1">
                                    计划日期：{formatDate(milestone.planDate)}
                                    {milestone.actualDate && (
                                      <span className="ml-3">
                                        实际日期：{formatDate(milestone.actualDate)}
                                      </span>
                                    )}
                                  </p>
                                  <p className="text-xs text-gray-400">{milestone.description}</p>
                                </div>
                              ),
                            };
                          })}
                        />
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-700 mb-3">履约记录</h5>
                        {getAllProgressRecords(contract).length === 0 ? (
                          <Empty description="暂无履约记录" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        ) : (
                          <List
                            size="small"
                            dataSource={getAllProgressRecords(contract)}
                            renderItem={(record) => (
                              <List.Item>
                                <List.Item.Meta
                                  avatar={<Clock size={16} className="text-gray-400 mt-1" />}
                                  title={
                                    <div className="flex justify-between">
                                      <span className="text-sm font-medium">{record.milestoneName}</span>
                                      <span className="text-xs text-gray-400">
                                        {formatDateTime(record.updateTime)}
                                      </span>
                                    </div>
                                  }
                                  description={
                                    <div>
                                      <p className="text-sm text-gray-600">{record.progressNote}</p>
                                      <p className="text-xs text-gray-400 mt-1">
                                        操作人：{record.operator}
                                        {record.actualDate && (
                                          <span className="ml-3">实际完成：{formatDate(record.actualDate)}</span>
                                        )}
                                        {record.attachmentName && (
                                          <span className="ml-3">附件：{record.attachmentName}</span>
                                        )}
                                      </p>
                                    </div>
                                  }
                                />
                              </List.Item>
                            )}
                          />
                        )}
                      </div>
                    </TabPane>
                  ))}
                </Tabs>
              );
            })()}
          </>
        )}
      </Modal>

      <Modal
        title="更新里程碑状态"
        open={isMilestoneModal}
        onCancel={() => setIsMilestoneModal(false)}
        onOk={handleMilestoneUpdate}
        width={500}
      >
        {selectedMilestone && (
          <Form form={milestoneForm} layout="vertical">
            <div className="mb-4 p-3 bg-gray-50 rounded">
              <p className="font-medium text-gray-800">{selectedMilestone.name}</p>
              <p className="text-sm text-gray-500">{selectedMilestone.description}</p>
            </div>
            <Form.Item
              name="status"
              label="更新状态"
              rules={[{ required: true, message: '请选择状态' }]}
            >
              <Select placeholder="请选择状态">
                {MILESTONE_STATUS_OPTIONS.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="progressNote"
              label="本次进展说明"
              rules={[{ required: true, message: '请填写进展说明' }]}
            >
              <TextArea rows={3} placeholder="请描述本次进展情况..." />
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="actualDate" label="实际完成日期">
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="attachmentName" label="附件名称">
                  <Input placeholder="选填，如：验收报告.pdf" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default Projects;

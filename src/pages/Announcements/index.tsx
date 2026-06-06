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
  message,
  Tabs,
  Alert,
  Descriptions,
  Input as AntInput,
  Checkbox,
  Timeline,
} from 'antd';
import { Search, Eye, Check, XCircle, FileDiff, AlertTriangle } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import type { Announcement, ReviewRecord } from '@/types';
import {
  ANNOUNCEMENT_TYPE_OPTIONS,
  ANNOUNCEMENT_STATUS_OPTIONS,
} from '@/utils/constants';
import { formatDateTime } from '@/utils/format';

const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = AntInput;

const initialAnnouncements: Announcement[] = [
  {
    id: 'A001',
    projectId: 'P006',
    projectName: '污水处理厂二期扩建工程',
    title: '污水处理厂二期扩建工程招标公告',
    type: 'bidding',
    content: '一、招标条件\n本招标项目污水处理厂二期扩建工程已由相关部门批准建设，项目业主为市水务局，建设资金来自财政资金，项目出资比例为100%，招标人为市水务局。项目已具备招标条件，现对该项目的施工进行公开招标。\n\n二、项目概况与招标范围\n1.建设地点：市工业园区\n2.建设规模：日处理能力从5万吨扩建至10万吨\n3.计划工期：365日历天\n4.招标范围：施工图纸及工程量清单范围内的全部工程内容\n\n三、投标人资格要求\n1.投标人须具备市政公用工程施工总承包壹级及以上资质\n2.近五年具有类似项目业绩\n3.项目经理具有市政公用工程专业一级注册建造师资格',
    submitTime: '2026-05-10 09:30:00',
    status: 'pending',
    reviewer: '',
    reviewRecords: [
      {
        id: 'R001',
        announcementId: 'A001',
        action: 'submit',
        operator: '招标代理-小王',
        operateTime: '2026-05-10 09:30:00',
        result: '提交审核',
        opinion: '公告内容已按模板编制，请审核',
      },
    ],
  },
  {
    id: 'A002',
    projectId: 'P004',
    projectName: '城市道路绿化提升工程',
    title: '城市道路绿化提升工程中标公告',
    type: 'result',
    content: '一、项目编号：GC-2026-012\n二、项目名称：城市道路绿化提升工程\n三、中标信息\n供应商名称：市园林绿化工程有限公司\n供应商地址：市绿化路88号\n中标金额：人民币壹仟贰佰万元整（￥12,000,000.00）\n\n四、主要标的信息\n工程类：城市主干道绿化景观提升，全长15公里\n\n五、评审专家名单：张某某、李某某、王某某、赵某某、刘某某\n\n六、公告期限\n自本公告发布之日起1个工作日。',
    submitTime: '2026-05-05 14:20:00',
    status: 'approved',
    reviewer: '张三',
    reviewTime: '2026-05-06 10:00:00',
    reviewOpinion: '公告内容符合要求，同意发布',
    reviewRecords: [
      {
        id: 'R002',
        announcementId: 'A002',
        action: 'submit',
        operator: '采购中心-小李',
        operateTime: '2026-05-05 14:20:00',
        result: '提交审核',
      },
      {
        id: 'R003',
        announcementId: 'A002',
        action: 'approve',
        operator: '张三',
        operateTime: '2026-05-06 10:00:00',
        result: '审核通过',
        opinion: '公告内容符合要求，同意发布',
      },
    ],
  },
  {
    id: 'A003',
    projectId: 'P005',
    projectName: '智慧校园信息化建设项目',
    title: '智慧校园信息化建设项目澄清公告',
    type: 'clarification',
    content: '各潜在投标人：\n现就智慧校园信息化建设项目（项目编号：CG-2026-018）招标文件作如下澄清：\n\n一、招标文件第三章技术要求中"服务器配置"修改为：\n1.CPU：不低于2颗Intel Xeon Gold 6330\n2.内存：不低于256GB DDR4\n3.存储：不低于4TB SSD\n\n二、投标截止时间延期至2026年6月5日9:30\n\n三、其他内容不变。\n\n请各投标人知悉。',
    submitTime: '2026-05-15 16:45:00',
    status: 'approved',
    reviewer: '李四',
    reviewTime: '2026-05-16 09:15:00',
    reviewOpinion: '澄清内容合规，同意发布',
    reviewRecords: [
      {
        id: 'R004',
        announcementId: 'A003',
        action: 'submit',
        operator: '教育局-张工',
        operateTime: '2026-05-15 16:45:00',
        result: '提交审核',
      },
      {
        id: 'R005',
        announcementId: 'A003',
        action: 'approve',
        operator: '李四',
        operateTime: '2026-05-16 09:15:00',
        result: '审核通过',
        opinion: '澄清内容合规，同意发布',
      },
    ],
  },
  {
    id: 'A004',
    projectId: 'P007',
    projectName: '公立医院医疗设备集中采购',
    title: '公立医院医疗设备集中采购招标公告',
    type: 'bidding',
    content: '一、项目基本情况\n项目编号：CG-2026-025\n项目名称：公立医院医疗设备集中采购\n预算金额：1850万元\n采购需求：CT设备3台、MRI设备2台、DR设备5台\n\n二、申请人的资格要求\n1.满足《中华人民共和国政府采购法》第二十二条规定\n2.具有医疗器械经营许可证\n3.本项目不接受联合体投标\n4.投标企业注册资本不低于1亿元',
    submitTime: '2026-05-22 11:00:00',
    status: 'rejected',
    reviewer: '王五',
    reviewTime: '2026-05-23 15:30:00',
    reviewOpinion: '资格条件中存在限制性条款，建议修改；技术参数表述不明确，请补充',
    reviewRecords: [
      {
        id: 'R006',
        announcementId: 'A004',
        action: 'submit',
        operator: '卫健委-刘工',
        operateTime: '2026-05-22 11:00:00',
        result: '提交审核',
      },
      {
        id: 'R007',
        announcementId: 'A004',
        action: 'reject',
        operator: '王五',
        operateTime: '2026-05-23 15:30:00',
        result: '审核驳回',
        opinion: '资格条件中存在限制性条款，建议修改；技术参数表述不明确，请补充',
      },
    ],
  },
  {
    id: 'A005',
    projectId: 'P008',
    projectName: '老旧写字楼房产转让',
    title: '老旧写字楼房产转让公告',
    type: 'bidding',
    content: '经市国资委批准，现对中心区老政务办公楼整体转让进行公开挂牌。\n\n一、标的基本情况\n标的名称：中心区老政务办公楼\n坐落位置：市中心区政务路1号\n建筑面积：12000平方米\n土地性质：国有出让\n\n二、挂牌起始价：4500万元\n\n三、受让方资格条件\n1.具有独立法人资格的企业\n2.注册资本不低于5000万元\n3.具有良好的财务状况和商业信誉\n4.具有房地产开发经营资质',
    submitTime: '2026-04-10 10:00:00',
    status: 'approved',
    reviewer: '赵六',
    reviewTime: '2026-04-11 14:00:00',
    reviewOpinion: '材料齐全，程序合规，同意发布',
    reviewRecords: [
      {
        id: 'R008',
        announcementId: 'A005',
        action: 'submit',
        operator: '国资委-陈工',
        operateTime: '2026-04-10 10:00:00',
        result: '提交审核',
      },
      {
        id: 'R009',
        announcementId: 'A005',
        action: 'approve',
        operator: '赵六',
        operateTime: '2026-04-11 14:00:00',
        result: '审核通过',
        opinion: '材料齐全，程序合规，同意发布',
      },
    ],
  },
];

const Announcements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [isDetailModal, setIsDetailModal] = useState(false);
  const [isCompareModal, setIsCompareModal] = useState(false);
  const [isRejectModal, setIsRejectModal] = useState(false);
  const [isBatchRejectModal, setIsBatchRejectModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchText, setSearchText] = useState<string>('');
  const [rejectForm] = Form.useForm();
  const [batchRejectForm] = Form.useForm();

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((a) => {
      const matchStatus = statusFilter === 'all' || a.status === statusFilter;
      const matchType = typeFilter === 'all' || a.type === typeFilter;
      const matchSearch = searchText === ''
        || a.title.toLowerCase().includes(searchText.toLowerCase())
        || a.projectName.toLowerCase().includes(searchText.toLowerCase());
      return matchStatus && matchType && matchSearch;
    });
  }, [announcements, statusFilter, typeFilter, searchText]);

  const pendingCount = useMemo(() =>
    filteredAnnouncements.filter((a) => a.status === 'pending').length
  , [filteredAnnouncements]);

  const getStatusTag = (status: string) => {
    const option = ANNOUNCEMENT_STATUS_OPTIONS.find((o) => o.value === status);
    return option ? <Tag color={option.color}>{option.label}</Tag> : status;
  };

  const getTypeText = (type: string) => {
    const option = ANNOUNCEMENT_TYPE_OPTIONS.find((o) => o.value === type);
    return option ? option.label : type;
  };

  const addReviewRecord = (announcementId: string, record: Omit<ReviewRecord, 'id' | 'announcementId'>) => {
    const newRecord: ReviewRecord = {
      ...record,
      id: `R${Date.now()}`,
      announcementId,
    };
    setAnnouncements((prev) =>
      prev.map((a) =>
        a.id === announcementId
          ? {
              ...a,
              reviewRecords: [...(a.reviewRecords || []), newRecord],
            }
          : a
      )
    );
    if (selectedAnnouncement?.id === announcementId) {
      setSelectedAnnouncement((prev) =>
        prev
          ? {
              ...prev,
              reviewRecords: [...(prev.reviewRecords || []), newRecord],
            }
          : null
      );
    }
  };

  const handleApprove = (record: Announcement) => {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    setAnnouncements((prev) =>
      prev.map((a) =>
        a.id === record.id
          ? {
              ...a,
              status: 'approved' as const,
              reviewer: '当前监管员',
              reviewTime: now,
              reviewOpinion: '公告内容合规，审核通过',
            }
          : a
      )
    );
    addReviewRecord(record.id, {
      action: 'approve',
      operator: '当前监管员',
      operateTime: now,
      result: '审核通过',
      opinion: '公告内容合规，审核通过',
    });
    if (selectedAnnouncement?.id === record.id) {
      setSelectedAnnouncement((prev) =>
        prev
          ? {
              ...prev,
              status: 'approved' as const,
              reviewer: '当前监管员',
              reviewTime: now,
              reviewOpinion: '公告内容合规，审核通过',
            }
          : null
      );
    }
    message.success('审核通过成功');
  };

  const showRejectModal = (record: Announcement) => {
    setSelectedAnnouncement(record);
    setIsRejectModal(true);
  };

  const handleReject = () => {
    rejectForm.validateFields().then((values) => {
      const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
      const opinion = values.opinion || '不符合发布要求';
      setAnnouncements((prev) =>
        prev.map((a) =>
          a.id === selectedAnnouncement?.id
            ? {
                ...a,
                status: 'rejected' as const,
                reviewer: '当前监管员',
                reviewTime: now,
                reviewOpinion: opinion,
              }
            : a
        )
      );
      if (selectedAnnouncement) {
        addReviewRecord(selectedAnnouncement.id, {
          action: 'reject',
          operator: '当前监管员',
          operateTime: now,
          result: '审核驳回',
          opinion,
        });
        setSelectedAnnouncement((prev) =>
          prev
            ? {
                ...prev,
                status: 'rejected' as const,
                reviewer: '当前监管员',
                reviewTime: now,
                reviewOpinion: opinion,
              }
            : null
        );
      }
      message.success('已驳回');
      setIsRejectModal(false);
      rejectForm.resetFields();
    });
  };

  const handleBatchApprove = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要审核的公告');
      return;
    }
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    setAnnouncements((prev) =>
      prev.map((a) =>
        selectedRowKeys.includes(a.id)
          ? {
              ...a,
              status: 'approved' as const,
              reviewer: '当前监管员',
              reviewTime: now,
              reviewOpinion: '批量审核通过',
            }
          : a
      )
    );
    selectedRowKeys.forEach((id) => {
      addReviewRecord(id as string, {
        action: 'approve',
        operator: '当前监管员',
        operateTime: now,
        result: '批量审核通过',
        opinion: '批量审核通过',
      });
    });
    message.success(`已批量通过 ${selectedRowKeys.length} 条公告`);
    setSelectedRowKeys([]);
  };

  const handleBatchReject = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要审核的公告');
      return;
    }
    setIsBatchRejectModal(true);
  };

  const confirmBatchReject = () => {
    batchRejectForm.validateFields().then((values) => {
      const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
      const opinion = values.opinion || '批量驳回';
      setAnnouncements((prev) =>
        prev.map((a) =>
          selectedRowKeys.includes(a.id)
            ? {
                ...a,
                status: 'rejected' as const,
                reviewer: '当前监管员',
                reviewTime: now,
                reviewOpinion: opinion,
              }
            : a
        )
      );
      selectedRowKeys.forEach((id) => {
        addReviewRecord(id as string, {
          action: 'reject',
          operator: '当前监管员',
          operateTime: now,
          result: '批量审核驳回',
          opinion,
        });
      });
      message.success(`已批量驳回 ${selectedRowKeys.length} 条公告`);
      setSelectedRowKeys([]);
      setIsBatchRejectModal(false);
      batchRejectForm.resetFields();
    });
  };

  const getComplianceCheckResult = (announcement: Announcement | null) => {
    if (!announcement) return { passed: true, risks: [], warnings: [], needsReview: false };

    const risks: string[] = [];
    const warnings: string[] = [];

    if (announcement.status === 'rejected' && announcement.reviewOpinion) {
      const opinion = announcement.reviewOpinion;
      if (opinion.includes('资格条件') || opinion.includes('限制性')) {
        risks.push('资格条件中可能存在限制性条款，需要进一步审查');
      }
      if (opinion.includes('技术参数') || opinion.includes('表述')) {
        risks.push('技术参数表述不明确，可能存在倾向性');
      }
      if (opinion.includes('修改') || opinion.includes('补充')) {
        warnings.push('审核意见指出需要修改或补充内容');
      }
    }

    const content = announcement.content;
    if (content.includes('不接受联合体') || content.includes('不接受')) {
      warnings.push('公告明确不接受联合体投标，请确认是否合理');
    }
    if (content.includes('注册资本')) {
      const match = content.match(/注册资本不低于(\d+)/);
      if (match) {
        const amount = parseInt(match[1]);
        if (amount >= 5000) {
          risks.push(`设置了${amount}万元注册资本门槛，可能构成不合理限制，建议复核是否与项目规模相匹配`);
        } else {
          warnings.push('设置了注册资本门槛，建议确认是否与项目规模相匹配');
        }
      }
    }
    if (content.includes('房地产开发') && announcement.type === 'bidding' && announcement.content.includes('房产转让')) {
      warnings.push('设置了房地产开发资质要求，请确认是否为项目必要条件');
    }

    const needsReview = risks.length > 0 || warnings.length > 0;
    return { passed: !needsReview, risks, warnings, needsReview };
  };

  const complianceResult = getComplianceCheckResult(selectedAnnouncement);

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
    getCheckboxProps: (record: Announcement) => ({
      disabled: record.status !== 'pending',
    }),
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
              const current = announcements.find((a) => a.id === record.id);
              setSelectedAnnouncement(current || record);
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
              const current = announcements.find((a) => a.id === record.id);
              setSelectedAnnouncement(current || record);
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
                onClick={() => handleApprove(record)}
              >
                通过
              </Button>
              <Button
                type="link"
                size="small"
                danger
                icon={<XCircle size={14} />}
                onClick={() => showRejectModal(record)}
              >
                驳回
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  const getActionText = (action: string) => {
    const texts: Record<string, string> = {
      submit: '提交审核',
      approve: '审核通过',
      reject: '审核驳回',
      resubmit: '重新提交',
    };
    return texts[action] || action;
  };

  const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
      submit: 'blue',
      approve: 'green',
      reject: 'red',
      resubmit: 'orange',
    };
    return colors[action] || 'blue';
  };

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
                value={statusFilter}
              >
                <Option value="all">全部状态</Option>
                {ANNOUNCEMENT_STATUS_OPTIONS.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
              <Select
                defaultValue="all"
                style={{ width: 140 }}
                onChange={(value) => setTypeFilter(value)}
                value={typeFilter}
              >
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
            <Space>
              <Input
                placeholder="搜索公告标题或项目名称"
                prefix={<Search size={16} />}
                style={{ width: 280 }}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
            </Space>
          </Col>
        </Row>
        {pendingCount > 0 && (
          <Row className="mt-4 pt-4 border-t border-gray-100">
            <Col span={24}>
              <Space>
                <span className="text-gray-600">
                  已选择 <span className="text-primary-500 font-semibold">{selectedRowKeys.length}</span> / {pendingCount} 条待审核
                </span>
                <Button
                  type="primary"
                  size="small"
                  icon={<Check size={14} />}
                  onClick={handleBatchApprove}
                  disabled={selectedRowKeys.length === 0}
                >
                  批量通过
                </Button>
                <Button
                  size="small"
                  danger
                  icon={<XCircle size={14} />}
                  onClick={handleBatchReject}
                  disabled={selectedRowKeys.length === 0}
                >
                  批量驳回
                </Button>
              </Space>
            </Col>
          </Row>
        )}
      </Card>

      <Card className="shadow-sm">
        <Table
          columns={columns}
          dataSource={filteredAnnouncements}
          rowKey="id"
          rowSelection={rowSelection}
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
        width={900}
      >
        {selectedAnnouncement && (
          <div className="space-y-4">
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
            <div className="p-4 bg-gray-50 rounded">
              <h4 className="text-gray-700 font-medium mb-2">公告内容</h4>
              <pre className="whitespace-pre-wrap text-sm text-gray-600 font-sans">
                {selectedAnnouncement.content}
              </pre>
            </div>
            <div>
              <h4 className="text-gray-700 font-medium mb-3">审核轨迹</h4>
              <Timeline
                items={selectedAnnouncement.reviewRecords?.map((record) => ({
                  color: getActionColor(record.action),
                  children: (
                    <div className="pb-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-800">
                          {getActionText(record.action)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDateTime(record.operateTime)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        操作人：{record.operator}
                      </p>
                      <p className="text-sm text-gray-600">处理结果：{record.result}</p>
                      {record.opinion && (
                        <p className="text-sm text-gray-500 mt-1">意见：{record.opinion}</p>
                      )}
                    </div>
                  ),
                }))}
              />
            </div>
          </div>
        )}
      </Modal>

      <Modal
        title="公告比对与合规检查"
        open={isCompareModal}
        onCancel={() => setIsCompareModal(false)}
        width={900}
        footer={[
          <Button key="close" onClick={() => setIsCompareModal(false)}>
            关闭
          </Button>,
          selectedAnnouncement?.status === 'pending' && (
            <Button
              key="approve"
              type="primary"
              onClick={() => {
                if (selectedAnnouncement) {
                  handleApprove(selectedAnnouncement);
                  setIsCompareModal(false);
                }
              }}
            >
              确认通过
            </Button>
          ),
        ]}
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
              {complianceResult.needsReview ? (
                <Alert
                  message="需复核 / 存在风险"
                  description={
                    <div>
                      {complianceResult.risks.length > 0 && (
                        <div className="mb-2">
                          <p className="font-medium text-red-700 mb-1">风险项：</p>
                          <ul className="list-disc pl-5 space-y-1">
                            {complianceResult.risks.map((risk, index) => (
                              <li key={index} className="text-red-700">
                                {risk}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {complianceResult.warnings.length > 0 && (
                        <div>
                          <p className="font-medium text-orange-700 mb-1">需人工确认项：</p>
                          <ul className="list-disc pl-5 space-y-1">
                            {complianceResult.warnings.map((warning, index) => (
                              <li key={index} className="text-orange-700">
                                {warning}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  }
                  type="error"
                  showIcon
                  icon={<AlertTriangle size={16} />}
                />
              ) : (
                <Alert
                  message="资格条件检查通过"
                  description="未发现明显的限制性条款和不合理资格要求"
                  type="success"
                  showIcon
                />
              )}
              {!complianceResult.needsReview && (
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
              )}
            </div>
          </TabPane>
        </Tabs>
      </Modal>

      <Modal
        title="驳回公告"
        open={isRejectModal}
        onCancel={() => {
          setIsRejectModal(false);
          rejectForm.resetFields();
        }}
        onOk={handleReject}
        okText="确认驳回"
        okButtonProps={{ danger: true }}
      >
        <Form form={rejectForm} layout="vertical">
          <Form.Item
            name="opinion"
            label="驳回意见"
            rules={[{ required: true, message: '请输入驳回意见' }]}
          >
            <TextArea rows={4} placeholder="请输入驳回原因和修改建议..." />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="批量驳回公告"
        open={isBatchRejectModal}
        onCancel={() => {
          setIsBatchRejectModal(false);
          batchRejectForm.resetFields();
        }}
        onOk={confirmBatchReject}
        okText="确认批量驳回"
        okButtonProps={{ danger: true }}
      >
        <p className="mb-4 text-gray-600">
          已选择 <span className="text-red-500 font-semibold">{selectedRowKeys.length}</span> 条公告进行批量驳回，请填写统一驳回意见：
        </p>
        <Form form={batchRejectForm} layout="vertical">
          <Form.Item
            name="opinion"
            label="统一驳回意见"
            rules={[{ required: true, message: '请输入驳回意见' }]}
          >
            <TextArea rows={4} placeholder="请输入统一的驳回原因和修改建议..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Announcements;

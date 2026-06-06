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
  message,
  Tabs,
  Descriptions,
  Progress,
  List,
  Statistic,
  Avatar,
} from 'antd';
import { Search, Plus, Eye, UserX, FileText, Award, AlertTriangle } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import { mockCreditEnterprises } from '@/mock/credit';
import type { CreditEnterprise } from '@/types';
import { CREDIT_LEVEL_OPTIONS } from '@/utils/constants';
import { formatDateTime } from '@/utils/format';

const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

const Credit: React.FC = () => {
  const [isDetailModal, setIsDetailModal] = useState(false);
  const [isPunishmentModal, setIsPunishmentModal] = useState(false);
  const [selectedEnterprise, setSelectedEnterprise] = useState<CreditEnterprise | null>(null);
  const [activeTab, setActiveTab] = useState('enterprises');
  const [form] = Form.useForm();

  const getLevelTag = (level: string) => {
    const option = CREDIT_LEVEL_OPTIONS.find((o) => o.value === level);
    return option ? <Tag color={option.color}>{option.label}</Tag> : level;
  };

  const columns: ColumnsType<CreditEnterprise> = [
    {
      title: '企业名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: '统一社会信用代码',
      dataIndex: 'creditCode',
      key: 'creditCode',
      width: 180,
    },
    {
      title: '法定代表人',
      dataIndex: 'legalPerson',
      key: 'legalPerson',
      width: 100,
    },
    {
      title: '信用评分',
      dataIndex: 'creditScore',
      key: 'creditScore',
      width: 120,
      render: (score) => (
        <div className="flex items-center gap-2">
          <Progress
            type="circle"
            size={40}
            percent={score}
            format={(percent) => `${percent}`}
            strokeColor={
              score >= 90 ? '#00B42A' : score >= 80 ? '#165DFF' : score >= 70 ? '#FF7D00' : '#F53F3F'
            }
          />
        </div>
      ),
    },
    {
      title: '信用等级',
      dataIndex: 'creditLevel',
      key: 'creditLevel',
      width: 100,
      render: (level) => getLevelTag(level),
    },
    {
      title: '黑名单',
      dataIndex: 'isBlacklisted',
      key: 'isBlacklisted',
      width: 100,
      render: (isBlack) =>
        isBlack ? (
          <Tag color="red">已列入</Tag>
        ) : (
          <Tag color="green">正常</Tag>
        ),
    },
    {
      title: '参与项目',
      dataIndex: 'projectCount',
      key: 'projectCount',
      width: 100,
      render: (count) => `${count}个`,
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
            icon={<Eye size={14} />}
            onClick={() => {
              setSelectedEnterprise(record);
              setIsDetailModal(true);
            }}
          >
            详情
          </Button>
          <Button
            type="link"
            size="small"
            icon={<FileText size={14} />}
            onClick={() => {
              setSelectedEnterprise(record);
              setIsPunishmentModal(true);
            }}
          >
            处罚登记
          </Button>
          {!record.isBlacklisted && (
            <Button
              type="link"
              size="small"
              danger
              icon={<UserX size={14} />}
              onClick={() => message.warning('已列入黑名单')}
            >
              拉黑
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const handleSubmitPunishment = () => {
    form.validateFields().then(() => {
      message.success('处罚登记成功');
      setIsPunishmentModal(false);
      form.resetFields();
    });
  };

  const blacklistedEnterprises = mockCreditEnterprises.filter((e) => e.isBlacklisted);

  return (
    <div className="space-y-6">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <Card className="shadow-sm">
            <Statistic
              title="入库企业总数"
              value={mockCreditEnterprises.length}
              suffix="家"
              valueStyle={{ color: '#165DFF' }}
              prefix={<Award size={20} />}
            />
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card className="shadow-sm">
            <Statistic
              title="AAA级企业"
              value={mockCreditEnterprises.filter((e) => e.creditLevel === 'AAA').length}
              suffix="家"
              valueStyle={{ color: '#00B42A' }}
              prefix={<Award size={20} />}
            />
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card className="shadow-sm">
            <Statistic
              title="黑名单企业"
              value={blacklistedEnterprises.length}
              suffix="家"
              valueStyle={{ color: '#F53F3F' }}
              prefix={<AlertTriangle size={20} />}
            />
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card className="shadow-sm">
            <Statistic
              title="本月处罚"
              value={3}
              suffix="次"
              valueStyle={{ color: '#FF7D00' }}
              prefix={<FileText size={20} />}
            />
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab={<span><Award size={16} className="mr-2" />企业信用档案</span>} key="enterprises">
            <div className="mb-4 flex items-center justify-between">
              <Space>
                <Select defaultValue="all" style={{ width: 140 }}>
                  <Option value="all">全部等级</Option>
                  {CREDIT_LEVEL_OPTIONS.map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
                <Select defaultValue="all" style={{ width: 140 }}>
                  <Option value="all">全部状态</Option>
                  <Option value="normal">正常</Option>
                  <Option value="blacklist">黑名单</Option>
                </Select>
              </Space>
              <Space>
                <Input
                  placeholder="搜索企业名称"
                  prefix={<Search size={16} />}
                  style={{ width: 240 }}
                />
              </Space>
            </div>
            <Table
              columns={columns}
              dataSource={mockCreditEnterprises}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `共 ${total} 条记录`,
              }}
            />
          </TabPane>
          <TabPane tab={<span><UserX size={16} className="mr-2" />黑名单管理</span>} key="blacklist">
            <List
              dataSource={blacklistedEnterprises}
              renderItem={(item) => (
                <List.Item className="px-4 py-4 hover:bg-gray-50 rounded">
                  <div className="w-full">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar size={48} className="bg-red-100 text-red-500">
                          <UserX size={24} />
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-800">{item.name}</span>
                            <Tag color="red">黑名单</Tag>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            列入原因：{item.blacklistReason}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            列入时间：{item.blacklistTime ? formatDateTime(item.blacklistTime) : '-'}
                          </p>
                        </div>
                      </div>
                      <Button type="link" size="small">
                        移出黑名单
                      </Button>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </TabPane>
        </Tabs>
      </Card>

      <Modal
        title="企业信用详情"
        open={isDetailModal}
        onCancel={() => setIsDetailModal(false)}
        footer={null}
        width={800}
      >
        {selectedEnterprise && (
          <div>
            <div className="flex items-center gap-6 mb-6 p-4 bg-gray-50 rounded">
              <Progress
                type="circle"
                size={100}
                percent={selectedEnterprise.creditScore}
                format={(percent) => `${percent}分`}
                strokeColor={
                  selectedEnterprise.creditScore >= 90
                    ? '#00B42A'
                    : selectedEnterprise.creditScore >= 80
                    ? '#165DFF'
                    : selectedEnterprise.creditScore >= 70
                    ? '#FF7D00'
                    : '#F53F3F'
                }
              />
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {selectedEnterprise.name}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  {getLevelTag(selectedEnterprise.creditLevel)}
                  {selectedEnterprise.isBlacklisted && <Tag color="red">黑名单</Tag>}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  统一社会信用代码：{selectedEnterprise.creditCode}
                </p>
              </div>
            </div>
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="法定代表人">
                {selectedEnterprise.legalPerson}
              </Descriptions.Item>
              <Descriptions.Item label="联系方式">
                {selectedEnterprise.contact}
              </Descriptions.Item>
              <Descriptions.Item label="地址" span={2}>
                {selectedEnterprise.address}
              </Descriptions.Item>
              <Descriptions.Item label="参与项目数">
                {selectedEnterprise.projectCount}个
              </Descriptions.Item>
              <Descriptions.Item label="中标数">
                {selectedEnterprise.winCount}个
              </Descriptions.Item>
            </Descriptions>
            {selectedEnterprise.punishments.length > 0 && (
              <div className="mt-6">
                <h4 className="text-gray-700 font-medium mb-3">处罚记录</h4>
                <List
                  dataSource={selectedEnterprise.punishments}
                  renderItem={(item) => (
                    <List.Item>
                      <div className="w-full">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-800">{item.title}</span>
                          <Tag color="orange">{item.punishmentType}</Tag>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{item.content}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          决定书号：{item.decisionNo} | 决定日期：{item.decisionDate} | 扣分：
                          {item.scoreDeduction}分
                        </p>
                      </div>
                    </List.Item>
                  )}
                />
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal
        title="处罚决定登记"
        open={isPunishmentModal}
        onCancel={() => setIsPunishmentModal(false)}
        onOk={handleSubmitPunishment}
        width={600}
        okText="提交"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="处罚标题"
            rules={[{ required: true, message: '请输入处罚标题' }]}
          >
            <Input placeholder="请输入处罚标题" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="punishmentType"
                label="处罚类型"
                rules={[{ required: true, message: '请选择处罚类型' }]}
              >
                <Select placeholder="请选择">
                  <Option value="行政处罚">行政处罚</Option>
                  <Option value="通报批评">通报批评</Option>
                  <Option value="警告">警告</Option>
                  <Option value="列入黑名单">列入黑名单</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="scoreDeduction"
                label="信用扣分"
                rules={[{ required: true, message: '请输入信用扣分' }]}
              >
                <InputNumber style={{ width: '100%' }} placeholder="请输入扣分数值" min={1} max={100} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="decisionNo"
                label="决定书号"
                rules={[{ required: true, message: '请输入决定书号' }]}
              >
                <Input placeholder="请输入决定书号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="decisionDate"
                label="决定日期"
                rules={[{ required: true, message: '请选择决定日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="content"
            label="处罚内容"
            rules={[{ required: true, message: '请输入处罚内容' }]}
          >
            <TextArea rows={4} placeholder="请输入处罚详细内容" />
          </Form.Item>
          <Form.Item label="上传处罚文件">
            <Button icon={<FileText size={14} />}>选择文件</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Credit;

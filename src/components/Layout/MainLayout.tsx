import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Badge } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  FolderOpen,
  FileText,
  Users,
  AlertTriangle,
  Award,
  BarChart3,
  Bell,
  User,
  LogOut,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const { Header, Sider, Content } = Layout;

const iconMap: Record<string, React.ReactNode> = {
  Home: <Home size={18} />,
  FolderOpen: <FolderOpen size={18} />,
  FileText: <FileText size={18} />,
  Users: <Users size={18} />,
  AlertTriangle: <AlertTriangle size={18} />,
  Award: <Award size={18} />,
  BarChart3: <BarChart3 size={18} />,
};

const menuItems = [
  { key: '/', label: '监管首页', icon: 'Home' },
  { key: '/projects', label: '项目库', icon: 'FolderOpen' },
  { key: '/announcements', label: '公告审核', icon: 'FileText' },
  { key: '/bidding', label: '开评标监督', icon: 'Users' },
  { key: '/clues', label: '异常线索', icon: 'AlertTriangle' },
  { key: '/credit', label: '信用档案', icon: 'Award' },
  { key: '/statistics', label: '统计报表', icon: 'BarChart3' },
];

const userMenuItems = [
  { key: 'profile', icon: <User size={16} />, label: '个人中心' },
  { key: 'settings', icon: <Settings size={16} />, label: '系统设置' },
  { type: 'divider' as const },
  { key: 'logout', icon: <LogOut size={16} />, label: '退出登录' },
];

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  return (
    <Layout className="min-h-screen">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={220}
        className="bg-white border-r border-gray-200"
      >
        <div className="h-16 flex items-center justify-center border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-500 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">公</span>
            </div>
            {!collapsed && (
              <span className="text-lg font-semibold text-gray-800">交易监管平台</span>
            )}
          </div>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={handleMenuClick}
          className="border-r-0 pt-2"
          items={menuItems.map((item) => ({
            key: item.key,
            icon: iconMap[item.icon],
            label: item.label,
          }))}
        />
      </Sider>
      <Layout>
        <Header className="bg-white px-6 flex items-center justify-between border-b border-gray-200 h-16">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-gray-600 hover:text-primary-500 transition-colors text-xl"
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </button>
            <h2 className="text-lg font-medium text-gray-800">
              {menuItems.find((m) => m.key === location.pathname)?.label || '监管首页'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <Badge count={5} size="small">
              <button className="text-gray-600 hover:text-primary-500 transition-colors p-2">
                <Bell size={20} />
              </button>
            </Badge>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors">
                <Avatar size={32} className="bg-primary-500">
                  <User size={18} />
                </Avatar>
                <span className="text-sm text-gray-700">监管员</span>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content className="p-6 bg-gray-50 overflow-auto">{children}</Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;


import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Menu, Dropdown, Avatar, Button, Space, Badge } from 'antd';
import { BellOutlined, UserOutlined, DownOutlined } from '@ant-design/icons';
import logo from '../../assets/cooking.png';
import './Header.css';


const { Header: AntHeader } = Layout;

const Header = ({ user, onLogout, onAccount, onNavigate }) => {
  const navigate = useNavigate();

  const menuItems = [
    { key: 'home', label: 'Trang chủ' },
    { key: 'category', label: 'Category' },
    { key: 'ingredient', label: 'Ingredient' },
    { key: 'recipe', label: 'Recipe' },
    { key: 'myrecipe', label: 'My Recipe' },
  ];

  return (
    <AntHeader className="main-header" style={{ background: '#fff', boxShadow: '0 2px 12px rgba(165,0,52,0.07)', padding: 0 }}>
      <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <img
          src={logo}
          alt="logo"
          // className="header-logo"
          onClick={() => onNavigate('home')}
          style={{ cursor: 'pointer', marginLeft: 40, height: 60, width: 'auto', borderRadius: 5, backgroundColor: 'none' }}
        />
        <Menu
          mode="horizontal"
          selectedKeys={[]}
          style={{ borderBottom: 'none', fontWeight: 600, fontSize: 16, background: 'transparent' }}
          items={menuItems.map(item => ({
            key: item.key,
            label: (
              <span onClick={() => onNavigate(item.key)} style={{ color: '#a50034' }}>{item.label}</span>
            )
          }))}
        />
      </div>
      <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {user ? (
          <Space size={16}>
            <Badge count={0} size="small">
              <Button type="text" icon={<BellOutlined style={{ fontSize: 20, color: '#a50034' }} />} />
            </Badge>
            <Dropdown menu={{ items: [
              { key: 'account', label: <span onClick={onAccount}>Quản lý tài khoản</span> },
              { key: 'logout', label: <span onClick={onLogout}>Đăng xuất</span> }
            ] }} placement="bottomRight" trigger={["click"]}>
              <Button type="text" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Avatar icon={<UserOutlined />} style={{ background: '#a50034' }} />
                <DownOutlined style={{ color: '#a50034', fontSize: 12 }} />
              </Button>
            </Dropdown>
          </Space>
        ) : (
          <Space size={12}>
            <Button type="primary" style={{ background: '#a50034', borderColor: '#a50034' }} onClick={() => navigate('/login')}>Đăng nhập</Button>
            <Button style={{ color: '#a50034', borderColor: '#a50034' }} onClick={() => navigate('/signup')}>Đăng ký</Button>
          </Space>
        )}
      </div>
    </AntHeader>
  );
};

export default Header;

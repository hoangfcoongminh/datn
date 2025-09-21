import React from "react";
import { Menu, Layout } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AppstoreOutlined,
  UserOutlined,
  TagsOutlined,
  FileTextOutlined,
  DashboardOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import "./AdminSidebar.css";

const { Sider } = Layout;

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: "/admin/dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "/admin/categories",
      icon: <TagsOutlined />,
      label: "Danh mục",
    },
    {
      key: "/admin/recipes",
      icon: <FileTextOutlined />,
      label: "Công thức",
    },
    {
      key: "/admin/ingredients",
      icon: <AppstoreOutlined />,
      label: "Nguyên liệu",
    },
    {
      key: "/admin/units",
      icon: <SettingOutlined />,
      label: "Đơn vị",
    },
    {
      key: "/admin/users",
      icon: <UserOutlined />,
      label: "Người dùng",
    },
  ];

  return (
    <Sider
      width={"15vw"}
      className="admin-sidebar"
      theme="light"
    >
      <div className="sidebar-header" onClick={() => navigate("/admin/dashboard")}>
        <h2 style={{ 
          margin: 0, 
          padding: "20px 16px", 
          color: "#1890ff",
          fontSize: "18px",
          fontWeight: "bold",
          borderBottom: "1px solid #f0f0f0"
        }}>
          🍳 Admin Panel
        </h2>
      </div>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        onClick={({ key }) => navigate(key)}
        items={menuItems}
        style={{ 
          borderRight: 0,
          height: "calc(100vh - 80px)"
        }}
      />
    </Sider>
  );
};

export default AdminSidebar;

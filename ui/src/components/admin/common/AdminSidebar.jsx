import React from "react";
import { Menu } from "antd";
import { useNavigate } from "react-router-dom";
import {
  AppstoreOutlined,
  UserOutlined,
  TagsOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import "./AdminSidebar.css";

const AdminSidebar = () => {
  const navigate = useNavigate();

  const menuItems = [
    { key: "/admin/categories", icon: <TagsOutlined />, label: "Danh mục" },
    { key: "/admin/recipes", icon: <FileTextOutlined />, label: "Công thức" },
    { key: "/admin/ingredients", icon: <AppstoreOutlined />, label: "Nguyên liệu" },
    { key: "/admin/users", icon: <UserOutlined />, label: "Người dùng" },
  ];

  return (
    <div className="admin-sidebar">
      <Menu
        mode="inline"
        defaultSelectedKeys={[window.location.pathname]}
        onClick={({ key }) => navigate(key)}
        items={menuItems}
      />
    </div>
  );
};

export default AdminSidebar;

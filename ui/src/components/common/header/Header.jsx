import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Menu, Dropdown, Avatar, Button, Space, Badge } from "antd";
import { BellOutlined, DownOutlined } from "@ant-design/icons";
import logo from "../../../assets/cooking.png";
import "./Header.css";

const { Header: AntHeader } = Layout;

const Header = ({ user, onLogout, onAccount, onNavigate }) => {
  const navigate = useNavigate();

  const menuItems = [
    { key: "home", label: "Trang chủ" },
    { key: "newsfeed", label: "NewsFeed" },
    { key: "category", label: "Danh mục" },
    { key: "recipe", label: "Công thức" },
    { key: "ingredient", label: "Nguyên liệu" },
    // { key: "unit", label: "Unit" },
  ];

  const [menuOpen, setMenuOpen] = useState(false);
  const handleHamburger = () => setMenuOpen((v) => !v);
  const handleMenuClick = (key) => {
    setMenuOpen(false);
    onNavigate(key);
  };

  return (
    <AntHeader className="main-header">
      <div className="header-left" style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <img
          src={logo}
          alt="logo"
          className="header-logo"
          onClick={() => onNavigate("home")}
          style={{ cursor: "pointer", marginLeft: 40, height: 60, width: "auto", borderRadius: 5, border: "none", backgroundColor: "white" }}
        />
        <Menu
          mode="horizontal"
          selectedKeys={[]}
          className="header-menu"
          style={{ borderBottom: "none", fontWeight: 600, fontSize: 16, background: "transparent" }}
          items={menuItems.map((item) => ({
            key: item.key,
            label: (
              <span onClick={() => onNavigate(item.key)} style={{ color: "#a50034" }}>
                {item.label}
              </span>
            ),
          }))}
        />
        <button className="header-hamburger" onClick={handleHamburger} aria-label="menu">
          <span style={{ fontSize: 28, lineHeight: 1 }}>&#9776;</span>
        </button>
      </div>
      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.25)",
            zIndex: 9999,
          }}
          onClick={() => setMenuOpen(false)}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 220,
              height: "100vh",
              background: "#fff",
              boxShadow: "2px 0 12px rgba(165,0,52,0.13)",
              padding: 24,
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
            onClick={e => e.stopPropagation()}
          >
            {menuItems.map((item) => (
              <span
                key={item.key}
                style={{ color: "#a50034", fontWeight: 600, fontSize: 18, padding: "8px 0", cursor: "pointer" }}
                onClick={() => handleMenuClick(item.key)}
              >
                {item.label}
              </span>
            ))}
          </div>
        </div>
      )}
      <div className="header-right" style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {user ? (
          <Space size={16}>
            {user.user.role === "ADMIN" && (
              <Button
                type="primary"
                style={{ background: "#a50034", borderColor: "#a50034", borderRadius: 8 }}
                onClick={() => navigate("/admin/dashboard")}
              >
                ADMIN HOME
              </Button>
            )}
            <Badge count={0} size="small">
              <Button
                type="text"
                icon={
                  <BellOutlined style={{ fontSize: 20, color: "#a50034" }} />
                }
              />
            </Badge>
            <Dropdown
              menu={{
                items: [
                  {
                    key: "account",
                    label: <span onClick={onAccount}>Quản lý tài khoản</span>,
                  },
                  {
                    key: "myrecipe",
                    label: (
                      <span onClick={() => onNavigate("myrecipe")}>
                        Công thức của tôi
                      </span>
                    ),
                  },
                  {
                    key: "logout",
                    label: <span onClick={onLogout}>Đăng xuất</span>,
                  },
                ],
              }}
              placement="bottomRight"
              trigger={["click"]}
            >
              <Button
                type="text"
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                {/* <Avatar icon={<UserOutlined />} style={{ background: '#a50034' }} /> */}
                <Avatar
                  src={user.user.imgUrl}
                  style={{ backgroundColor: "#a50034" }}
                >
                  {!user.user.imgUrl && user.user.fullName.charAt(0)?.toUpperCase()}
                </Avatar>
                <DownOutlined style={{ color: "#a50034", fontSize: 12 }} />
              </Button>
            </Dropdown>
          </Space>
        ) : (
          <Space size={12}>
            <Button
              type="primary"
              style={{
                background: "#a50034",
                borderColor: "#a50034",
                borderRadius: 8,
              }}
              onClick={() => navigate("/login")}
            >
              Đăng nhập
            </Button>
            <Button
              style={{
                color: "#a50034",
                borderColor: "#a50034",
                borderRadius: 8,
              }}
              onClick={() => navigate("/signup")}
            >
              Đăng ký
            </Button>
          </Space>
        )}
      </div>
    </AntHeader>
  );
};

export default Header;

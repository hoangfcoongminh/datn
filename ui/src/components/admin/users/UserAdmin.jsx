import React, { useState, useEffect } from "react";
import { Table, Button, Space, Tag, Input, Select, Avatar } from "antd";
import { fetchUsers } from "../../../api/admin";
import { toast } from "react-toastify";
import { StopOutlined, UserOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import AdminSidebar from "../common/AdminSidebar";
import ChatLauncher from "../../common/chatbot/ChatLauncher";

const { Search } = Input;
const { Option } = Select;

const UserAdmin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userRequest, setUserRequest] = useState({ search: "", status: null, role: null });
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState("id,asc");

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        const response = await fetchUsers({
          userRequest,
          page: page - 1,
          size,
          sort,
        });
        setUsers(response.data);
        setTotal(response.total);
      } catch (error) {
        toast.error("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [userRequest, page, size, sort]);

  const handleSearch = (value) => {
    setUserRequest({ ...userRequest, search: value });
  };

  const handleSortChange = (value) => {
    setSort(value);
  };

  const handleStatusFilterChange = (value) => {
    setUserRequest((prev) => ({ ...prev, status: value }));
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => (page - 1) * size + index + 1,
      width: 80,
    },
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar) => (
        <Avatar 
          size={40} 
          src={avatar} 
          icon={<UserOutlined />}
          style={{ backgroundColor: '#1890ff' }}
        />
      ),
      width: 80,
    },
    {
      title: "Tên người dùng",
      dataIndex: "username",
      key: "username",
      render: (username) => (
        <div style={{ fontWeight: 600, color: '#1890ff' }}>
          {username}
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <MailOutlined style={{ color: '#52c41a' }} />
          {email || "Chưa cập nhật"}
        </div>
      ),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      render: (phone) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <PhoneOutlined style={{ color: '#fa8c16' }} />
          {phone || "Chưa cập nhật"}
        </div>
      ),
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={role === "ADMIN" ? "red" : "blue"}>
          {role === "ADMIN" ? "Quản trị viên" : "Người dùng"}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === 1 ? "green" : "red"}>
          {status === 1 ? "Hoạt động" : "Ngưng hoạt động"}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            size="small"
            onClick={() => console.log("View", record.id)}
          >
            Xem
          </Button>
          <Button 
            type="danger" 
            size="small"
            icon={<StopOutlined />} 
            onClick={() => console.log("Deactivate", record.id)}
          >
            Khóa
          </Button>
        </Space>
      ),
      width: 150,
    },
  ];

  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />
      <div style={{ flex: 1, padding: 32 }}>
        <h2
          style={{
            color: "#a50034",
            fontWeight: 700,
            fontSize: 32,
            marginBottom: 24,
          }}
        >
          Quản lý Người dùng
        </h2>

        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          marginBottom: 16,
          gap: 16,
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <Search
            placeholder="Tìm kiếm người dùng theo tên hoặc email"
            onSearch={handleSearch}
            style={{ width: 300 }}
            enterButton
          />

          <Select defaultValue={sort} onChange={handleSortChange} style={{ width: 200 }}>
            <Option value="id,asc">ID Tăng dần</Option>
            <Option value="id,desc">ID Giảm dần</Option>
            <Option value="username,asc">Tên A-Z</Option>
            <Option value="username,desc">Tên Z-A</Option>
            <Option value="email,asc">Email A-Z</Option>
            <Option value="email,desc">Email Z-A</Option>
          </Select>

          <Select
            placeholder="Lọc theo trạng thái"
            onChange={(value) => handleStatusFilterChange(value)}
            style={{ width: 200 }}
            allowClear
          >
            <Option value="1">Hoạt động</Option>
            <Option value="0">Ngưng hoạt động</Option>
          </Select>
        </div>

        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          pagination={{
            current: page,
            pageSize: size,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} người dùng`,
            onChange: (page, pageSize) => {
              setPage(page);
              setSize(pageSize);
            },
          }}
          scroll={{ x: 1200 }}
        />
      </div>
      <ChatLauncher />
    </div>
  );
};

export default UserAdmin;

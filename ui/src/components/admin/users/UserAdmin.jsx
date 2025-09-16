import React, { useState, useEffect } from "react";
import { Table, Button, Space, Tag, Input, Select, Avatar } from "antd";
import { fetchUsers } from "../../../api/admin";
import { toast } from "react-toastify";
import {
  EyeOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import AdminSidebar from "../common/AdminSidebar";
import ChatLauncher from "../../common/chatbot/ChatLauncher";
import PopupDetail from "../common/PopupDetail";
import { updateUserProfile } from "../../../api/user";
import Role from "../../../enums/role";

const { Option } = Select;

const UserAdmin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userRequest, setUserRequest] = useState({
    search: "",
    status: null,
    role: null,
  });
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState("id,desc");
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [img, setImg] = useState(null);

  const handleOpenPopup = (user) => {
    setSelectedUser(user);
    setOpenPopup(true);
  };

  const handleUpdateUser = (updatedData, img) => {
    console.log("updatedData, img: ", updatedData, img);

    updateUserProfile({ user: updatedData, imageFile: img })
      .then((response) => {
        toast.success("Cập nhật người dùng thành công");
        setUsers((prev) =>
          prev.map((user) =>
            user.id === updatedData.id ? { ...user, ...response.data } : user
          )
        );
      })
      .catch(() => {
        toast.error("Cập nhật người dùng thất bại");
      })
      .finally(() => {
        // setOpenPopup(false);
      });
  };

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

  const handleSortChange = (value) => {
    setSort(value);
  };

  const handleRoleFilterChange = (value) => {
    setUserRequest((prev) => ({ ...prev, role: value }));
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
      dataIndex: "imgUrl",
      key: "imgUrl",
      render: (imgUrl) => (
        <Avatar
          size={40}
          src={imgUrl}
          icon={<UserOutlined />}
          style={{ backgroundColor: "#1890ff" }}
        />
      ),
      width: 80,
    },
    {
      title: "Tên người dùng",
      dataIndex: "username",
      key: "username",
      render: (username) => (
        <div style={{ fontWeight: 600, color: "#1890ff" }}>{username}</div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <MailOutlined style={{ color: "#52c41a" }} />
          {email || "Chưa cập nhật"}
        </div>
      ),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      render: (phone) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <PhoneOutlined style={{ color: "#fa8c16" }} />
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
            icon={<EyeOutlined />}
            onClick={() => handleOpenPopup(record)}
          >
            Chi tiết
          </Button>
        </Space>
      ),
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

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 16,
            gap: 16,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <Input
            allowClear
            placeholder="Tìm kiếm tên hoặc mô tả..."
            value={userRequest.search}
            onChange={(e) => {
              setPage(1); // Reset to page 1
              setUserRequest((prev) => ({
                ...prev,
                search: e.target.value,
              }));
            }}
            style={{ width: 240, borderRadius: 8 }}
          />

          <Select
            placeholder="Lọc theo vai trò"
            onChange={(value) => handleRoleFilterChange(value)}
            style={{ width: 200 }}
            allowClear
          >
            <Option value={Role.ADMIN}>Quản trị viên</Option>
            <Option value={Role.USER}>Khách hàng</Option>
          </Select>
      

          <Select
            defaultValue={sort}
            onChange={handleSortChange}
            style={{ width: 200 }}
          >
            <Option value="id,desc">Mới nhất</Option>
            <Option value="id,asc">Cũ nhất</Option>
            <Option value="name,asc">Tên A-Z</Option>
            <Option value="name,desc">Tên Z-A</Option>
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
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} người dùng`,
            onChange: (page, pageSize) => {
              setPage(page);
              setSize(pageSize);
            },
          }}
          scroll={{ x: 1200 }}
        />
      </div>
      <PopupDetail
        open={openPopup}
        onClose={() => setOpenPopup(false)}
        data={selectedUser}
        file={img}
        fields={[
          { name: "name", label: "Tên người dùng", type: "text" },
          { name: "email", label: "Email", type: "text" },
          { name: "phone", label: "Số điện thoại", type: "text" },
          { name: "role", label: "Vai trò", type: "text" },
          { name: "status", label: "Trạng thái", type: "text" },
        ]}
        onUpdate={(updatedData, img) => handleUpdateUser(updatedData, img)}
      />
      <ChatLauncher />
    </div>
  );
};

export default UserAdmin;

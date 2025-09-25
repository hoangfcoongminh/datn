import React, { useState, useEffect } from "react";
import { Table, Button, Space, Tag, Input, Select, Image } from "antd";
import { fetchUsers } from "../../../api/admin";
import { toast } from "react-toastify";
import { EyeOutlined, UserOutlined, MailOutlined } from "@ant-design/icons";
import AdminSidebar from "../common/AdminSidebar";
import ChatLauncher from "../../common/chatbot/ChatLauncher";
import PopupDetail from "../common/PopupDetail";
import { updateUserProfile, addUser } from "../../../api/user"; 
import Role from "../../../enums/role";

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

  const DEFAULT_IMAGE = "http://localhost:9000/images/default-avt.jpg";

  const roleOptions = [
    { label: "Quản trị viên", value: Role.ADMIN },
    { label: "Khách hàng", value: Role.USER },
  ];

  const handleOpenPopup = (user) => {
    setSelectedUser(user);
    setOpenPopup(true);
  };

  const handleOpenCreatePopup = () => {
    setSelectedUser(null);
    setOpenPopup(true);
  };

  const handleUpdateUser = async (updatedData, img) => {
    try {
      const response = await updateUserProfile({ user: updatedData, imageFile: img });
      toast.success("Cập nhật người dùng thành công");
      setUsers((prev) => prev.map((u) => u.id === updatedData.id ? { ...u, ...response.data } : u
      )
      );
    } catch {
      toast.error("Cập nhật người dùng thất bại");
    }
  };

  const handleAddUser = async (newData, img) => {
    try {      
      const response = await addUser({ userData: newData, imageFile: img });
      toast.success("Thêm người dùng thành công");
      setUsers((prev) => [response.data, ...prev]);
    } catch {
      toast.error("Thêm người dùng thất bại");
    }
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

  const columns = [
    {
      title: "STT",
      render: (_, __, index) => (page - 1) * size + index + 1,
      width: 80,
    },
    {
      title: "Avatar",
      dataIndex: "imgUrl",
      render: (imgUrl) => (
        <Image
          width={70}
          height={70}
          src={imgUrl}
          icon={<UserOutlined />}
          style={{ borderRadius: "50%" }}
        />
      ),
    },
    {
      title: "Tên người dùng",
      dataIndex: "username",
      render: (username) => (
        <div style={{ fontWeight: 600, color: "#1890ff" }}>{username}</div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (email) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <MailOutlined style={{ color: "#52c41a" }} />
          {email || "Chưa cập nhật"}
        </div>
      ),
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      render: (role) => (
        <Tag color={role === "ADMIN" ? "red" : "blue"}>
          {role === "ADMIN" ? "Quản trị viên" : "Khách hàng"}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => (
        <Tag color={status === 1 ? "green" : "red"}>
          {status === 1 ? "Hoạt động" : "Ngưng hoạt động"}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <Space>
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
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      <AdminSidebar />
      <div style={{ flex: 1, padding: 32 }}>
        <h2 style={{ color: "#a50034", fontWeight: 700, fontSize: "2rem", textAlign: "center" }}>
          Quản lý Người dùng
        </h2>

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, gap: 16 }}>
          <Input
            allowClear
            placeholder="Tìm kiếm..."
            value={userRequest.search}
            onChange={(e) =>
              setUserRequest((prev) => ({ ...prev, search: e.target.value }))
            }
            style={{ maxWidth: 240 }}
          />

          <Button type="primary" onClick={handleOpenCreatePopup} style={{ background: "#52c41a" }}>
            Thêm mới
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={users}
          rowKey="username"
          loading={loading}
          pagination={{
            current: page,
            pageSize: size,
            total,
            onChange: (p, s) => {
              setPage(p);
              setSize(s);
            },
          }}
        />
      </div>

      <PopupDetail
        open={openPopup}
        onClose={() => setOpenPopup(false)}
        data={selectedUser}
        fields={[
          { name: "username", label: "Tên người dùng", type: "text", readOnly: true },
          { name: "password", label: "Mật khẩu", type: "password" },
          { name: "fullName", label: "Họ và tên", type: "text" },
          { name: "imgUrl", label: "Avatar", type: "image", defaultImage: DEFAULT_IMAGE },
          { name: "email", label: "Email", type: "text" },
          { name: "role", label: "Vai trò", type: "select", options: roleOptions },
        ]}
        onUpdate={(data, img) =>
          selectedUser ? handleUpdateUser(data, img) : handleAddUser(data, img)
        }
      />
      <ChatLauncher />
    </div>
  );
};

export default UserAdmin;

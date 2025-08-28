import React, { useState, useEffect } from "react";
import { Table, Button, Space, Tag } from "antd";
import { fetchUsers } from "../../../api/admin";

const UserAdmin = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const loadUsers = async () => {
//       setLoading(true);
//       try {
//         const data = await fetchUsers();
//         setUsers(data);
//       } catch (error) {
//         console.error("Failed to fetch users", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadUsers();
//   }, []);

//   // const handleDeactivate = async (id) => {
//   //   try {
//   //     await deactivateUser(id);
//   //     setUsers((prev) => prev.filter((user) => user.id !== id));
//   //   } catch (error) {
//   //     console.error("Failed to deactivate user", error);
//   //   }
//   // };

//   const columns = [
//     {
//       title: "Tên người dùng",
//       dataIndex: "username",
//       key: "username",
//     },
//     {
//       title: "Email",
//       dataIndex: "email",
//       key: "email",
//     },
//     {
//       title: "Trạng thái",
//       dataIndex: "status",
//       key: "status",
//       render: (status) => (
//         <Tag color={status === "ACTIVE" ? "green" : "red"}>{status}</Tag>
//       ),
//     },
//     {
//       title: "Hành động",
//       key: "action",
//       render: (_, record) => (
//         <Space size="middle">
//           <Button type="link" onClick={() => console.log("View", record.id)}>
//             Xem
//           </Button>
//           {/* <Button type="link" danger onClick={() => handleDeactivate(record.id)}> */}
//           <Button type="link">Ngưng hoạt động</Button>
//         </Space>
//       ),
//     },
//   ];

//   return (
//     <div className="admin-page">
//       <h2>Quản lý Người dùng</h2>
//       <Table
//         columns={columns}
//         dataSource={users}
//         rowKey="id"
//         loading={loading}
//         pagination={{ pageSize: 10 }}
//       />
//     </div>
//   );
};

export default UserAdmin;

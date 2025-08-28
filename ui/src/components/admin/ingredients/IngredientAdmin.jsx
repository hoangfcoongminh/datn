import React, { useState, useEffect } from "react";
import { Table, Button, Space, Tag } from "antd";
import { fetchIngredients } from "../../../api/admin";

const IngredientAdmin = () => {
//   const [ingredients, setIngredients] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const loadIngredients = async () => {
//       setLoading(true);
//       try {
//         const data = await fetchIngredients();
//         setIngredients(data);
//       } catch (error) {
//         console.error("Failed to fetch ingredients", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadIngredients();
//   }, []);

//   // const handleDeactivate = async (id) => {
//   //   try {
//   //     await deactivateIngredient(id);
//   //     setIngredients((prev) => prev.filter((ing) => ing.id !== id));
//   //   } catch (error) {
//   //     console.error("Failed to deactivate ingredient", error);
//   //   }
//   // };

//   const columns = [
//     {
//       title: "Tên nguyên liệu",
//       dataIndex: "name",
//       key: "name",
//     },
//     {
//       title: "Trạng thái",
//       dataIndex: "status",
//       key: "status",
//       render: (status) => (
//         <Tag color={status === "ACTIVE" ? "green" : "red"}>
//           {status}
//         </Tag>
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
//           <Button type="link">
//             Ngưng hoạt động
//           </Button>
//         </Space>
//       ),
//     },
//   ];

//   return (
//     <div className="admin-page">
//       <h2>Quản lý Nguyên liệu</h2>
//       <Table
//         columns={columns}
//         dataSource={ingredients}
//         rowKey="id"
//         loading={loading}
//         pagination={{ pageSize: 10 }}
//       />
//     </div>
//   );
};

export default IngredientAdmin;

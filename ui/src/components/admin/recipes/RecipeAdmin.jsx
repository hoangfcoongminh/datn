import React, { useState, useEffect } from "react";
import { Table, Button, Space, Tag } from "antd";
import { filterRecipes } from "../../../api/recipe";

const RecipeAdmin = () => {
//   const [recipes, setRecipes] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const loadRecipes = async () => {
//       setLoading(true);
//       try {
//         const data = await filterRecipes();
//         setRecipes(data);
//       } catch (error) {
//         console.error("Failed to fetch recipes", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadRecipes();
//   }, []);

//   // const handleDeactivate = async (id) => {
//   //   try {
//   //     await deactivateRecipe(id);
//   //     setRecipes((prev) => prev.filter((rec) => rec.id !== id));
//   //   } catch (error) {
//   //     console.error("Failed to deactivate recipe", error);
//   //   }
//   // };

//   const columns = [
//     {
//       title: "Tên công thức",
//       dataIndex: "title",
//       key: "title",
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
//       <h2>Quản lý Công thức</h2>
//       <Table
//         columns={columns}
//         dataSource={recipes}
//         rowKey="id"
//         loading={loading}
//         pagination={{ pageSize: 10 }}
//       />
//     </div>
//   );
};

export default RecipeAdmin;

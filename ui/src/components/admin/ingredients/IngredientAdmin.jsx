import React, { useState, useEffect } from "react";
import { Table, Button, Space, Tag, Input, Select, Image } from "antd";
import { fetchIngredients } from "../../../api/admin";
import { toast } from "react-toastify";
import { StopOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import AdminSidebar from "../common/AdminSidebar";
import ChatLauncher from "../../common/chatbot/ChatLauncher";
import { fetchUnits } from "../../../api/unit";

const { Search } = Input;
const { Option } = Select;

const IngredientAdmin = () => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [units, setUnits] = useState([]);
  const [ingredientsRequest, setIngredientsRequest] = useState({ search: "", status: "" });
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState("id,asc");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const ingredients = await fetchIngredients({
          ingredientsRequest,
          page: page - 1,
          size,
          sort,
        });
        setIngredients(ingredients.data);
        setTotal(ingredients.total);

        const units = await fetchUnits();
        setUnits(units.data);
      } catch (error) {
        toast.error("Failed to fetch ingredients");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [ingredientsRequest, page, size, sort]);

  const handleSearch = (value) => {
    setIngredientsRequest({ ...ingredientsRequest, search: value });
  };

  const handleSortChange = (value) => {
    setSort(value);
  };

  const handleStatusFilterChange = (value) => {
    setIngredientsRequest((prev) => ({ ...prev, status: value }));
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
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <Image
          width={50}
          height={50}
          src={image}
          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
          style={{ objectFit: 'cover', borderRadius: '6px' }}
        />
      ),
      width: 80,
    },
    {
      title: "Tên nguyên liệu",
      dataIndex: "name",
      key: "name",
      render: (name) => (
        <div style={{ fontWeight: 600, color: '#1890ff' }}>
          {name}
        </div>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (description) => (
        <div style={{ 
          maxWidth: 200, 
          overflow: 'hidden', 
          textOverflow: 'ellipsis', 
          whiteSpace: 'nowrap',
          color: '#666'
        }}>
          {description || "Không có mô tả"}
        </div>
      ),
    },
    {
      title: "Đơn vị chuẩn",
      dataIndex: "unitId",
      key: "unitId",
      render: (unitId) => {
        const unit = units.find(unit => unit.id === unitId);
        return (
          <Tag color="orange">
            {unit?.name || "Không xác định"}
          </Tag>
        );
      }
    },
    // {
    //   title: "Calories",
    //   dataIndex: "calories",
    //   key: "calories",
    //   render: (calories) => (
    //     <div style={{ color: '#52c41a', fontWeight: 500 }}>
    //       {calories ? `${calories} kcal` : "Chưa cập nhật"}
    //     </div>
    //   ),
    // },
    // {
    //   title: "Protein",
    //   dataIndex: "protein",
    //   key: "protein",
    //   render: (protein) => (
    //     <div style={{ color: '#722ed1', fontWeight: 500 }}>
    //       {protein ? `${protein}g` : "Chưa cập nhật"}
    //     </div>
    //   ),
    // },
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
        <Space size="small">
          <Button 
            type="primary" 
            size="small"
            icon={<EyeOutlined />}
            onClick={() => console.log("View", record.id)}
          >
            Xem
          </Button>
          <Button 
            type="default" 
            size="small"
            icon={<EditOutlined />}
            onClick={() => console.log("Edit", record.id)}
          >
            Sửa
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
      width: 180,
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
          Quản lý Nguyên liệu
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
            placeholder="Tìm kiếm nguyên liệu theo tên"
            onSearch={handleSearch}
            style={{ width: 300 }}
            enterButton
          />

          <Select defaultValue={sort} onChange={handleSortChange} style={{ width: 200 }}>
            <Option value="id,asc">ID Tăng dần</Option>
            <Option value="id,desc">ID Giảm dần</Option>
            <Option value="name,asc">Tên A-Z</Option>
            <Option value="name,desc">Tên Z-A</Option>
            <Option value="calories,desc">Calories cao nhất</Option>
            <Option value="calories,asc">Calories thấp nhất</Option>
            <Option value="protein,desc">Protein cao nhất</Option>
            <Option value="protein,asc">Protein thấp nhất</Option>
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
          dataSource={ingredients}
          rowKey="id"
          loading={loading}
          pagination={{
            current: page,
            pageSize: size,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} nguyên liệu`,
            onChange: (page, pageSize) => {
              setPage(page);
              setSize(pageSize);
            },
          }}
          scroll={{ x: 1300 }}
        />
      </div>
      <ChatLauncher />
    </div>
  );
};

export default IngredientAdmin;

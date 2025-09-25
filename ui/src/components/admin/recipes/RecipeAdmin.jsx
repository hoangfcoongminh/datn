import React, { useState, useEffect } from "react";
import { Table, Button, Space, Tag, Input, Select, Image, Rate } from "antd";
import { fetchRecipes } from "../../../api/admin";
import { toast } from "react-toastify";
import { StopOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import AdminSidebar from "../common/AdminSidebar";
import ChatLauncher from "../../common/chatbot/ChatLauncher";
import { fetchAllCategories } from "../../../api/category";
import { useNavigate } from "react-router-dom";

const { Search } = Input;
const { Option } = Select;

const RecipeAdmin = () => {
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recipeRequest, setRecipeRequest] = useState({ search: "", status: "" });
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState("id,asc");
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await fetchRecipes({
          recipeRequest,
          page: page - 1,
          size,
          sort,
        });
        setRecipes(response.data);
        setTotal(response.total);
        const categoriesResponse = await fetchAllCategories();
        setCategories(categoriesResponse.data);
      } catch (error) {
        toast.error("Failed to fetch recipes");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [recipeRequest, page, size, sort]);

  const handleSearch = (value) => {
    setRecipeRequest({ ...recipeRequest, search: value });
  };

  const handleSortChange = (value) => {
    setSort(value);
  };

  const handleStatusFilterChange = (value) => {
    setRecipeRequest((prev) => ({ ...prev, status: value }));
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
      dataIndex: "imgUrl",
      key: "imgUrl",
      render: (imgUrl) => (
        <Image
          width={80}
          height={80}
          src={imgUrl}
          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
          style={{ objectFit: 'cover', borderRadius: '8px' }}
        />
      ),
      width: 100,
    },
    {
      title: "Tên công thức",
      dataIndex: "title",
      key: "title",
      render: (title) => (
        <div style={{ fontWeight: 600, color: '#1890ff', maxWidth: 200 }}>
          {title}
        </div>
      ),
    },
    {
      title: "Tác giả",
      dataIndex: "authorUsername",
      key: "authorUsername",
      render: (authorUsername) => (
        <div style={{ color: '#666' }}>
          {authorUsername || "Không xác định"}
        </div>
      ),
    },
    {
      title: "Danh mục",
      dataIndex: "categoryId",
      key: "categoryId",
      render: (categoryId) => {
        const category = categories.find(c => c.id === categoryId);
        return (
          <Tag color="blue">
            {category?.name || "Không phân loại"}
          </Tag>
        );
      }
    },
    {
      title: "Đánh giá",
      key: "rating",
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* hiển thị sao trung bình */}
          <Rate
            disabled
            value={record.averageRating.toFixed(1) || 0}
            style={{ fontSize: 12 }}
            allowHalf
          />
          {/* hiển thị số điểm & tổng lượt */}
          <span style={{ fontSize: 12, color: '#666' }}>
            ({record.totalRating} lượt)
          </span>
        </div>
      ),
      width: 200,
    },
    // {
    //   title: "Thời gian nấu",
    //   dataIndex: "cookTime",
    //   key: "cookTime",
    //   render: (time) => (
    //     <div style={{ color: '#52c41a', fontWeight: 500 }}>
    //       {time ? `${time} giờ` : "Chưa cập nhật"}
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
        <Space size="middle">
          <Button type="primary" icon={<EyeOutlined />} onClick={() => navigate(`/recipes/${record.id}`)}>
            Chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      <AdminSidebar />
      <div style={{ flex: 1, padding: 32, minWidth: "300px" }}>
        <h2
          style={{
            color: "#a50034",
            fontWeight: 700,
            fontSize: "2rem",
            marginBottom: 24,
            textAlign: "center",
          }}
        >
          Quản lý Công thức
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
            placeholder="Tìm kiếm công thức theo tên"
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: "100%", maxWidth: 300 }}
            enterButton
          />

          <Select defaultValue={sort} onChange={handleSortChange} style={{ width: "100%", maxWidth: 200 }}>
            <Option value="id,asc">ID Tăng dần</Option>
            <Option value="id,desc">ID Giảm dần</Option>
            <Option value="title,asc">Tên A-Z</Option>
            <Option value="title,desc">Tên Z-A</Option>
            <Option value="cookingTime,asc">Thời gian nấu ngắn nhất</Option>
            <Option value="cookingTime,desc">Thời gian nấu dài nhất</Option>
          </Select>

          <Select
            placeholder="Lọc theo trạng thái"
            onChange={(value) => handleStatusFilterChange(value)}
            style={{ width: "100%", maxWidth: 200 }}
            allowClear
          >
            <Option value="1">Hoạt động</Option>
            <Option value="0">Ngưng hoạt động</Option>
          </Select>

          <Button
            type="primary"
            onClick={() => navigate('/recipes/add')}
            style={{
              backgroundColor: "#52c41a",
              borderColor: "#52c41a",
              // width: "100%",
              maxWidth: 200,
            }}
          >
            Thêm mới
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={recipes}
          rowKey="id"
          loading={loading}
          pagination={{
            current: page,
            pageSize: size,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} công thức`,
            onChange: (page, pageSize) => {
              setPage(page);
              setSize(pageSize);
            },
          }}
          scroll={{ x: "75vw" }}
          tableLayout="fixed"
        />
      </div>
      <ChatLauncher />
    </div>
  );
};

export default RecipeAdmin;

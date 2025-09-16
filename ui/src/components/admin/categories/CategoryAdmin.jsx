import React, { useState, useEffect } from "react";
import { Table, Button, Space, Tag, Input, Select } from "antd";
import { fetchCategories } from "../../../api/admin";
import { updateCategory } from "../../../api/category";
import { toast } from "react-toastify";
import AdminSidebar from "../common/AdminSidebar";
import ChatLauncher from "../../common/chatbot/ChatLauncher";
import PopupDetail from "../common/PopupDetail";

const { Search } = Input;
const { Option } = Select;

const CategoryAdmin = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoriesRequest, setCategoriesRequest] = useState({ search: "", status: "" });
  const [page, setPage] = useState(1); // Start from page 1
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState("id,asc");
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [img, setImg] = useState(null);

  const handleOpenPopup = (category) => {
    setSelectedCategory(category);
    setOpenPopup(true);
  };

  const handleUpdateCategory = (updatedData, img) => {
    console.log('updatedData, img: ', updatedData, img);
    
    updateCategory({ updatingCategory: updatedData, imageFile: img })
      .then(() => {
        toast.success("Cập nhật danh mục thành công");
        setCategories((prev) =>
          prev.map((cat) => (cat.id === updatedData.id ? { ...cat, ...updatedData } : cat))
        );
      })
      .catch(() => {
        toast.error("Cập nhật danh mục thất bại");
      })
      .finally(() => {
        // setOpenPopup(false);
      });
  };

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      try {
        const response = await fetchCategories({
          categoriesRequest, // Send categoriesRequest directly
          page: page - 1, // Adjust for zero-based index
          size,
          sort,
        });
        setCategories(response.data);
        setTotal(response.total);
      } catch (error) {
        toast.error("Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, [categoriesRequest, page, size, sort]);

  const handleSearch = (value) => {
    setCategoriesRequest({ ...categoriesRequest, name: value });
  };

  const handleSortChange = (value) => {
    setSort(value);
  };

  const handleStatusFilterChange = (value) => {
    setCategoriesRequest((prev) => ({ ...prev, status: value }));
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => (page - 1)  * size + index + 1, // Calculate serial number based on pagination
    },
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === 1 ? "green" : "red"}>{status === 1 ? "Hoạt động" : "Ngưng hoạt động"}</Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleOpenPopup(record)}>
            Xem
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
          Quản lý Danh mục
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
            placeholder="Tìm kiếm danh mục"
            onSearch={handleSearch}
            style={{ width: 300 }}
            enterButton
          />

          <Select defaultValue={sort} onChange={handleSortChange} style={{ width: 200 }}>
            <Option value="id,asc">ID Tăng dần</Option>
            <Option value="id,desc">ID Giảm dần</Option>
            <Option value="name,asc">Tên A-Z</Option>
            <Option value="name,desc">Tên Z-A</Option>
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
          dataSource={categories}
          rowKey="id"
          loading={loading}
          pagination={{
            current: page,
            pageSize: size,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} danh mục`,
            onChange: (page, pageSize) => {
              setPage(page);
              setSize(pageSize);
            },
          }}
        />
      </div>
      <PopupDetail
        open={openPopup}
        onClose={() => setOpenPopup(false)}
        data={selectedCategory}
        file={img}
        fields={[
          { name: "name", label: "Tên danh mục", type: "text" },
          { name: "imgUrl", label: "Ảnh minh họa", type: "image" },
          { name: "description", label: "Mô tả", type: "textarea" },
        ]}
        onUpdate={(updatedData, img) => handleUpdateCategory(updatedData, img)}
      />
      <ChatLauncher />
    </div>
  );
};

export default CategoryAdmin;

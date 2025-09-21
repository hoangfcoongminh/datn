import React, { useState, useEffect } from "react";
import { Table, Button, Space, Tag, Input, Select, Image } from "antd";
import { fetchCategories } from "../../../api/admin";
import { updateCategory, addCategory } from "../../../api/category"; // thêm createCategory
import { toast } from "react-toastify";
import AdminSidebar from "../common/AdminSidebar";
import ChatLauncher from "../../common/chatbot/ChatLauncher";
import PopupDetail from "../common/PopupDetail";
import { EyeOutlined } from "@ant-design/icons";

const { Option } = Select;

const CategoryAdmin = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoriesRequest, setCategoriesRequest] = useState({
    search: "",
    status: "",
  });
  const [page, setPage] = useState(1); // Start from page 1
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState("id,desc");
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [img, setImg] = useState(null);

  const handleOpenPopup = (category) => {
    setSelectedCategory(category);
    setOpenPopup(true);
  };

  const handleOpenCreatePopup = () => {
    setSelectedCategory(null);
    setImg(null);
    setOpenPopup(true);
  };

  const handleUpdateCategory = (updatedData, img) => {
    return updateCategory({ updatingCategory: updatedData, imageFile: img })
      .then((response) => {
        toast.success("Cập nhật danh mục thành công");
        setCategories((prev) =>
          prev.map((cat) =>
            cat.id === updatedData.id ? { ...cat, ...response.data } : cat
          )
        );
      })
      .catch((err) => {
        toast.error("Cập nhật danh mục thất bại! ", err.message);
      });
  };

  const handleSaveNewCategory = (newData, img) => {
    return addCategory({ addingCategory: newData, imageFile: img }) // gọi API thêm mới
      .then((response) => {
        toast.success("Thêm danh mục thành công");
        setCategories((prev) => [response.data, ...prev]);
      })
      .catch((err) => {
        toast.error("Thêm danh mục thất bại! ", err.message);
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
      render: (_, __, index) => (page - 1) * size + index + 1,
      width: 50, // Adjusted for better visibility
    },
    {
      title: "Hình ảnh",
      dataIndex: "imgUrl",
      key: "imgUrl",
      render: (image) => (
        <Image
          width={80}
          height={80}
          src={image}
          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
          style={{ objectFit: "cover", borderRadius: "6px" }}
        />
      ),
      width: 120, // Adjusted for better alignment
    },
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
      width: 250, // Increased for better readability
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      width: 250, // Increased for better readability
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
      width: 150, // Adjusted for better alignment
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
      width: 180, // Adjusted for better alignment
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
          Quản lý Danh mục
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
            value={categoriesRequest.search}
            onChange={(e) => {
              setPage(1); // Reset to page 1
              setCategoriesRequest((prev) => ({
                ...prev,
                search: e.target.value,
              }));
            }}
            style={{ maxWidth: 240, borderRadius: 8 }}
          />

          <Select
            defaultValue={sort}
            onChange={handleSortChange}
            style={{ width: "100%", maxWidth: 200 }}
          >
            <Option value="id,desc">Mới nhất</Option>
            <Option value="id,asc">Cũ nhất</Option>
            <Option value="name,asc">Tên A-Z</Option>
            <Option value="name,desc">Tên Z-A</Option>
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
            onClick={handleOpenCreatePopup}
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
          dataSource={categories}
          rowKey="id"
          loading={loading}
          pagination={{
            current: page,
            pageSize: size,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} danh mục`,
            onChange: (page, pageSize) => {
              setPage(page);
              setSize(pageSize);
            },
          }}
          scroll={{ x: "75vw" }}
          tableLayout="fixed"
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
        onUpdate={(updatedData, img) => {
          if (selectedCategory) {
            handleUpdateCategory(updatedData, img); // sửa
          } else {
            handleSaveNewCategory(updatedData, img); // thêm mới
          }
        }}
      />
      <ChatLauncher />
    </div>
  );
};

export default CategoryAdmin;

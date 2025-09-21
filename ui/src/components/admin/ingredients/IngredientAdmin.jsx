import React, { useState, useEffect } from "react";
import { Table, Button, Space, Tag, Input, Select, Image } from "antd";
import { fetchIngredients } from "../../../api/admin";
import { toast } from "react-toastify";
import { EyeOutlined } from "@ant-design/icons";
import AdminSidebar from "../common/AdminSidebar";
import ChatLauncher from "../../common/chatbot/ChatLauncher";
import { fetchUnits } from "../../../api/unit";
import PopupDetail from "../common/PopupDetail";
import { updateIngredient } from "../../../api/ingredient";

const { Option } = Select;

const IngredientAdmin = () => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [units, setUnits] = useState([]);
  const [ingredientsRequest, setIngredientsRequest] = useState({
    search: "",
    status: "",
  });
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState("id,desc");
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [img, setImg] = useState(null);

  const handleOpenPopup = (ingredient) => {
    setSelectedIngredient(ingredient);
    setOpenPopup(true);
  };

  const handleUpdateIngredient = (updatedData, img) => {
    updateIngredient({ ingredient: updatedData, imageFile: img })
      .then((response) => {
        toast.success("Cập nhật nguyên liệu thành công");
        setIngredients((prev) =>
          prev.map((ing) =>
            ing.id === updatedData.id ? { ...ing, ...response.data } : ing
          )
        );
      })
      .catch(() => {
        toast.error("Cập nhật nguyên liệu thất bại");
      })
      .finally(() => {
        // setOpenPopup(false);
      });
  };

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
      width: 120,
    },
    {
      title: "Tên nguyên liệu",
      dataIndex: "name",
      key: "name",
      render: (name) => (
        <div style={{ fontWeight: 600, color: "#1890ff" }}>{name}</div>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (description) => (
        <div
          style={{
            maxWidth: 200,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            color: "#666",
          }}
        >
          {description || "Không có mô tả"}
        </div>
      ),
    },
    {
      title: "Đơn vị chuẩn",
      dataIndex: "unitId",
      key: "unitId",
      render: (unitId) => {
        const unit = units.find((unit) => unit.id === unitId);
        return <Tag color="orange">{unit?.name || "Không xác định"}</Tag>;
      },
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
          Quản lý Nguyên liệu
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
            value={ingredientsRequest.search}
            onChange={(e) => {
              setPage(1); // Reset to page 1
              setIngredientsRequest((prev) => ({
                ...prev,
                search: e.target.value,
              }));
            }}
            style={{ width: "100%", maxWidth: 240, borderRadius: 8 }}
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
            // onClick={handleOpenCreatePopup}
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
          dataSource={ingredients}
          rowKey="id"
          loading={loading}
          pagination={{
            current: page,
            pageSize: size,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} nguyên liệu`,
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
        data={selectedIngredient}
        file={img}
        fields={[
          { name: "name", label: "Tên nguyên liệu", type: "text" },
          { name: "imgUrl", label: "Ảnh minh họa", type: "image" },
          { name: "description", label: "Mô tả", type: "textarea" },
          { name: "unitId", label: "Đơn vị", type: "select" },
        ]}
        onUpdate={(updatedData, img) =>
          handleUpdateIngredient(updatedData, img)
        }
      />
      <ChatLauncher />
    </div>
  );
};

export default IngredientAdmin;

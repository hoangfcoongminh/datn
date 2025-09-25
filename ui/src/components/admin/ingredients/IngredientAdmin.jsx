import React, { useState, useEffect } from "react";
import { Table, Button, Space, Tag, Input, Select, Image } from "antd";
import { fetchIngredients } from "../../../api/admin";
import { toast } from "react-toastify";
import { EyeOutlined } from "@ant-design/icons";
import AdminSidebar from "../common/AdminSidebar";
import ChatLauncher from "../../common/chatbot/ChatLauncher";
import { fetchUnits } from "../../../api/unit";
import PopupDetail from "../common/PopupDetail";
import { updateIngredient, addIngredient } from "../../../api/ingredient"; // thêm mới

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

  const DEFAULT_IMAGE = "http://localhost:9000/images/default-ingredient.jpg";

  const handleOpenPopup = (ingredient) => {
    setSelectedIngredient(ingredient);
    setOpenPopup(true);
  };

  const handleOpenCreatePopup = () => {
    setSelectedIngredient(null);
    setOpenPopup(true);
  };

  const handleUpdateIngredient = async (updatedData, img) => {
    try {
      const response = await updateIngredient({ ingredient: updatedData, imageFile: img });
      toast.success("Cập nhật nguyên liệu thành công");
      setIngredients((prev) => prev.map((ing) => ing.id === updatedData.id ? { ...ing, ...response.data } : ing
      )
      );
    } catch {
      toast.error("Cập nhật nguyên liệu thất bại");
    }
  };

  const handleAddIngredient = async (newData, img) => {    
    try {
      const response = await addIngredient({ addingIngredient: newData, imageFile: img });
      toast.success("Thêm nguyên liệu thành công");
      setIngredients((prev) => [response.data, ...prev]);
    } catch {
      toast.error("Thêm nguyên liệu thất bại");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const ingredientsRes = await fetchIngredients({
          ingredientsRequest,
          page: page - 1,
          size,
          sort,
        });
        setIngredients(ingredientsRes.data);
        setTotal(ingredientsRes.total);

        const unitsRes = await fetchUnits();
        setUnits(Array.isArray(unitsRes.data) ? unitsRes.data : []); // Đảm bảo units luôn là mảng
        
      } catch (error) {
        toast.error("Failed to fetch ingredients");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [ingredientsRequest, page, size, sort]);

  const columns = [
    {
      title: "STT",
      render: (_, __, index) => (page - 1) * size + index + 1,
      width: 80,
    },
    {
      title: "Hình ảnh",
      dataIndex: "imgUrl",
      render: (image) => (
        <Image
          width={80}
          height={80}
          src={image}
          style={{ objectFit: "cover", borderRadius: "6px" }}
        />
      ),
      width: 120,
    },
    {
      title: "Tên nguyên liệu",
      dataIndex: "name",
      render: (name) => <div style={{ fontWeight: 600, color: "#1890ff" }}>{name}</div>,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      render: (desc) => (
        <div style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis" }}>
          {desc || "Không có mô tả"}
        </div>
      ),
    },
    {
      title: "Đơn vị chuẩn",
      dataIndex: "unitId",
      render: (unitId) => {
        const unit = units.find((u) => u.id === unitId);
        return <Tag color="orange">{unit?.name || "Không xác định"}</Tag>;
      },
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
        <Button type="primary" icon={<EyeOutlined />} onClick={() => handleOpenPopup(record)}>
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      <AdminSidebar />
      <div style={{ flex: 1, padding: 32 }}>
        <h2 style={{ color: "#a50034", fontWeight: 700, fontSize: "2rem", textAlign: "center" }}>
          Quản lý Nguyên liệu
        </h2>

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, gap: 16 }}>
          <Input
            allowClear
            placeholder="Tìm kiếm..."
            value={ingredientsRequest.search}
            onChange={(e) =>
              setIngredientsRequest((prev) => ({ ...prev, search: e.target.value }))
            }
            style={{ maxWidth: 240 }}
          />

          <Button type="primary" onClick={handleOpenCreatePopup} style={{ background: "#52c41a" }}>
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
        data={selectedIngredient}
        fields={[
          { name: "name", label: "Tên nguyên liệu", type: "text" },
          { name: "imgUrl", label: "Ảnh minh họa", type: "image", defaultImage: DEFAULT_IMAGE },
          { name: "description", label: "Mô tả", type: "textarea" },
          { name: "unitId", label: "Đơn vị chuẩn", type: "select", options: units },
        ]}
        onUpdate={(data, img) =>
          selectedIngredient ? handleUpdateIngredient(data, img) : handleAddIngredient(data, img)
        }
      />
      <ChatLauncher />
    </div>
  );
};

export default IngredientAdmin;

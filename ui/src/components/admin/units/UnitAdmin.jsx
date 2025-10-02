import React, { useState, useEffect } from "react";
import { Table, Button, Space, Tag, Input, Select } from "antd";
import { fetchUnits } from "../../../api/admin";
import { toast } from "react-toastify";
import { EyeOutlined } from "@ant-design/icons";
import AdminSidebar from "../common/AdminSidebar";
import ChatLauncher from "../../common/chatbot/ChatLauncher";
import PopupDetail from "../common/PopupDetail";
import { updateUnit, addUnit } from "../../../api/unit"; // thêm API addUnit

const { Option } = Select;

const UnitAdmin = () => {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unitsRequest, setUnitsRequest] = useState({ search: "", status: "" });
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState("id,desc");
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);

  const handleOpenPopup = (unit) => {
    setSelectedUnit(unit);
    setOpenPopup(true);
  };

  const handleOpenCreatePopup = () => {
    setSelectedUnit(null);
    setOpenPopup(true);
  };
  
  const handleSortChange = (value) => {
    setSort(value);
  };

  const handleStatusFilterChange = (value) => {
    setUnitsRequest((prev) => ({ ...prev, status: value }));
  };

  const handleUpdateUnit = async (updatedData) => {
    try {
      const response = await updateUnit({ unit: updatedData });
      toast.success("Cập nhật đơn vị thành công");
      setUnits((prev) => prev.map((u) => u.id === updatedData.id ? { ...u, ...response.data } : u
      )
      );
    } catch {
      toast.error("Cập nhật đơn vị thất bại");
    }
  };

  const handleAddUnit = async (newData) => {
    try {
      const response = await addUnit({ addingUnit: newData });
      toast.success("Thêm đơn vị thành công");
      setUnits((prev) => [response.data, ...prev]);
    } catch {
      toast.error("Thêm đơn vị thất bại");
    }
  };

  useEffect(() => {
    const loadUnits = async () => {
      setLoading(true);
      try {
        const response = await fetchUnits({
          unitsRequest,
          page: page - 1,
          size,
          sort,
        });
        setUnits(response.data);
        setTotal(response.total);
      } catch (error) {
        toast.error("Failed to fetch units");
      } finally {
        setLoading(false);
      }
    };

    loadUnits();
  }, [unitsRequest, page, size, sort]);

  const columns = [
    {
      title: "STT",
      render: (_, __, index) => (page - 1) * size + index + 1,
      width: 80,
    },
    {
      title: "Tên đơn vị",
      dataIndex: "name",
      render: (name) => <div style={{ fontWeight: 600, color: "#1890ff" }}>{name}</div>,
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
          Quản lý Đơn vị
        </h2>

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, gap: 16 }}>
          <Input
            allowClear
            placeholder="Tìm kiếm..."
            value={unitsRequest.search}
            onChange={(e) =>
              setUnitsRequest((prev) => ({ ...prev, search: e.target.value }))
            }
            style={{ maxWidth: 240 }}
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

          <Button type="primary" onClick={handleOpenCreatePopup} style={{ background: "#52c41a" }}>
            Thêm mới
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={units}
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
        data={selectedUnit}
        fields={[
          { name: "name", label: "Tên đơn vị", type: "text" },
        ]}
        onUpdate={(data) =>
          selectedUnit ? handleUpdateUnit(data) : handleAddUnit(data)
        }
      />
      <ChatLauncher />
    </div>
  );
};

export default UnitAdmin;

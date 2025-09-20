import React, { useState, useEffect } from "react";
import { Table, Button, Space, Tag, Input, Select } from "antd";
import { fetchUnits } from "../../../api/admin";
import { toast } from "react-toastify";
import { EyeOutlined } from "@ant-design/icons";
import AdminSidebar from "../common/AdminSidebar";
import ChatLauncher from "../../common/chatbot/ChatLauncher";
import PopupDetail from "../common/PopupDetail";
import { updateUnit } from "../../../api/unit";

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
  const [img, setImg] = useState(null);

  const handleOpenPopup = (unit) => {
    setSelectedUnit(unit);
    setOpenPopup(true);
  };

  const handleUpdateUnit = (updatedData, img) => {

    updateUnit({ unit: updatedData, imageFile: img })
      .then((response) => {
        toast.success("Cập nhật đơn vị thành công");
        setUnits((prev) =>
          prev.map((unit) =>
            unit.id === updatedData.id ? { ...unit, ...response.data } : unit
          )
        );
      })
      .catch(() => {
        toast.error("Cập nhật đơn vị thất bại");
      })
      .finally(() => {
        // setOpenPopup(false);
      });
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

  const handleSortChange = (value) => {
    setSort(value);
  };

  const handleStatusFilterChange = (value) => {
    setUnitsRequest((prev) => ({ ...prev, status: value }));
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
      title: "Tên đơn vị",
      dataIndex: "name",
      key: "name",
      render: (name) => (
        <div style={{ fontWeight: 600, color: "#1890ff" }}>{name}</div>
      ),
    },
    // {
    //   title: "Ký hiệu",
    //   dataIndex: "symbol",
    //   key: "symbol",
    //   render: (symbol) => (
    //     <Tag color="blue" style={{ fontSize: 12, fontWeight: 600 }}>
    //       {symbol}
    //     </Tag>
    //   ),
    // },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (description) => (
        <div
          style={{
            maxWidth: 250,
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
    // {
    //   title: "Loại đơn vị",
    //   dataIndex: "type",
    //   key: "type",
    //   render: (type) => {
    //     const colorMap = {
    //       'WEIGHT': 'green',
    //       'VOLUME': 'blue',
    //       'LENGTH': 'orange',
    //       'COUNT': 'purple',
    //       'TIME': 'red'
    //     };
    //     const labelMap = {
    //       'WEIGHT': 'Khối lượng',
    //       'VOLUME': 'Thể tích',
    //       'LENGTH': 'Chiều dài',
    //       'COUNT': 'Số lượng',
    //       'TIME': 'Thời gian'
    //     };
    //     return (
    //       <Tag color={colorMap[type] || 'default'}>
    //         {labelMap[type] || type}
    //       </Tag>
    //     );
    //   },
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
          Quản lý Đơn vị
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
            value={unitsRequest.search}
            onChange={(e) => {
              setPage(1); // Reset to page 1
              setUnitsRequest((prev) => ({
                ...prev,
                search: e.target.value,
              }));
            }}
            style={{ width: 240, borderRadius: 8 }}
          />

          <Select
            defaultValue={sort}
            onChange={handleSortChange}
            style={{ width: 200 }}
          >
            <Option value="id,desc">Mới nhất</Option>
            <Option value="id,asc">Cũ nhất</Option>
            <Option value="name,asc">Tên A-Z</Option>
            <Option value="name,desc">Tên Z-A</Option>
            {/* <Option value="symbol,asc">Ký hiệu A-Z</Option>
            <Option value="symbol,desc">Ký hiệu Z-A</Option> */}
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
          dataSource={units}
          rowKey="id"
          loading={loading}
          pagination={{
            current: page,
            pageSize: size,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} đơn vị`,
            onChange: (page, pageSize) => {
              setPage(page);
              setSize(pageSize);
            },
          }}
          scroll={{ x: 1000 }}
        />
      </div>
      <PopupDetail
        open={openPopup}
        onClose={() => setOpenPopup(false)}
        data={selectedUnit}
        file={img}
        fields={[
          { name: "name", label: "Tên đơn vị", type: "text" },
          { name: "description", label: "Mô tả", type: "textarea" },
        ]}
        onUpdate={(updatedData, img) => handleUpdateUnit(updatedData, img)}
      />
      <ChatLauncher />
    </div>
  );
};

export default UnitAdmin;

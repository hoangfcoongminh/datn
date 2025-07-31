import React, { useEffect, useState } from "react";
import { Table, Button, Input, Select, Space, message } from "antd";
import { useNavigate } from "react-router-dom";
import { fetchUnits } from "../../api/unit";
import { filterIngredients, detailIngredient } from "../../api/ingredient";
import DetailModal from "../common/DetailModal";

const { Option } = Select;

const IngredientList = () => {
  const [ingredients, setIngredients] = useState([]);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [unitIds, setUnitIds] = useState([]);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [ingredientDetail, setIngredientDetail] = useState(null);
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUnits().then(data => setUnits(Array.isArray(data) ? data : []));
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await filterIngredients({
        page,
        size: pageSize,
        sort: "name,asc",
        search: keyword,
        unitIds: unitIds || undefined
      });
      setIngredients(data.content || []);
      setTotal(data.total || 0);
    } catch (err) {
      message.error(err.message || "Lỗi khi tải nguyên liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [page, pageSize, unitIds, keyword]);

//   const handleDelete = async (ingredient) => {
//     try {
//       await deleteIngredient(ingredient.id);
//       message.success("Đã xoá nguyên liệu!");
//       fetchData();
//     } catch (err) {
//       message.error(err.message || "Lỗi khi xoá nguyên liệu");
//     }
//   };

  const handleShowDetail = async (id) => {
    setDetailOpen(true);
    setDetailLoading(true);
    try {
      const data = await detailIngredient(id);
      setIngredientDetail(data);
    } catch (err) {
      setIngredientDetail(null);
      message.error(err.message || "Lỗi khi tải chi tiết nguyên liệu");
    } finally {
      setDetailLoading(false);
    }
  };

  const columns = [
    { title: "Tên nguyên liệu", dataIndex: "name", key: "name" },
    {
      title: "Đơn vị chuẩn",
      key: "unit",
      render: (_, record) => {
        if (record.unit && record.unit.name) return record.unit.name;
        if (record.unit && units.length > 0) {
          const found = units.find(u => u.id === record.unit.id || u.id === record.unit);
          return found ? found.name : '';
        }
        return '';
      }
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => handleShowDetail(record.id)}>Xem</Button>
          <Button size="small" type="primary" onClick={() => navigate(`/ingredients/edit/${record.id}`)}>Sửa</Button>
          <Button size="small" danger onClick={() => handleDelete(record)}>Xoá</Button>
        </Space>
      )
    }
  ];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h1 style={{ color: '#a50034', fontWeight: 700, fontSize: 28, marginBottom: 24 }}>Danh sách nguyên liệu</h1>
      <Space style={{ marginBottom: 16 }}>
        <Input
          allowClear
          placeholder="Tìm kiếm tên nguyên liệu..."
          value={keyword}
          onChange={e => { setKeyword(e.target.value); setPage(0); }}
          style={{ width: 240 }}
        />
        <Select
          allowClear
          placeholder="Chọn đơn vị"
          value={unitIds}
          onChange={val => { setUnitIds(val); setPage(0); }}
          style={{ width: 180 }}
        >
          {units.map(u => (
            <Option key={u.id} value={u.id}>{u.name}</Option>
          ))}
        </Select>
      </Space>
      <Table
        columns={columns}
        dataSource={ingredients}
        rowKey="id"
        loading={loading}
        pagination={{
          current: page + 1,
          pageSize,
          total,
          showSizeChanger: true,
          onChange: (p, ps) => { setPage(p - 1); setPageSize(ps); }
        }}
      />
      <DetailModal
        open={detailOpen}
        onCancel={() => setDetailOpen(false)}
        title={ingredientDetail ? `Chi tiết nguyên liệu: ${ingredientDetail.name}` : 'Chi tiết nguyên liệu'}
        loading={detailLoading}
      >
        {ingredientDetail && (
          <div style={{ fontSize: 16 }}>
            <div><b>Tên:</b> {ingredientDetail.name}</div>
            <div><b>Đơn vị:</b> {ingredientDetail.unit && ingredientDetail.unit.name}</div>
            <div><b>Mô tả:</b> {ingredientDetail.description || 'Không có'}</div>
            {/* Thêm các trường khác nếu cần */}
          </div>
        )}
      </DetailModal>
    </div>
  );
};

export default IngredientList;

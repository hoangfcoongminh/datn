import React, { useEffect, useState } from "react";
import { Table, Button, Input, Select, Space, message, Tooltip } from "antd";
import { EyeOutlined, EditOutlined, SaveOutlined, CloseOutlined, StopOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import { fetchUnits } from "../../api/unit";
import { filterIngredients, detailIngredient } from "../../api/ingredient";
import DetailModal from "../common/DetailModal";
import "./IngredientList.css";
import { toast } from "react-toastify";

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
  const [isEditing, setIsEditing] = useState(false);

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
      setIngredients(data.data || []);
      setTotal(data.total || 0);
    } catch (err) {
      toast.error(err.message || "Lỗi khi tải danh sách nguyên liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [page, pageSize, unitIds, keyword]);


  const handleShowDetail = async (id) => {
    setDetailOpen(true);
    setDetailLoading(true);
    try {
      const data = await detailIngredient(id);
      setIngredientDetail(data.data);
      setIsEditing(false);
    } catch (err) {
      setIngredientDetail(null);
      toast.error(err.message || "Lỗi khi tải chi tiết nguyên liệu");
    } finally {
      setDetailLoading(false);
    }
  };
    const handleEdit = async (id) => {
    setDetailOpen(true);
    setDetailLoading(true);
    try {
      const data = await detailIngredient(id);
      setIngredientDetail(data.data);
      setIsEditing(true);
    } catch (err) {
      setIngredientDetail(null);
      toast.error(err.message || "Lỗi khi tải chi tiết nguyên liệu");
    } finally {
      setDetailLoading(false);
    }
  };

  const columns = [
    { title: "Tên nguyên liệu", dataIndex: "name", width: 200, key: "name" },
    {
      title: "Đơn vị chuẩn",
      width: 120, 
      key: "unit",
      render: (_, record) => {
        if (units.length > 0) {
          const found = units.find(u => u.id === record.unitId);
          return found ? found.name : '';
        }
        return '';
      }
    },
    {
      title: "Mô tả",
      width: 220,
      key: "description",
      render: (_, record) => {
        return record.description || '';
      }
    },
    {
      title: "Trạng thái",
      width: 120,
      key: "status",
      align: "center",
      render: (_, record) => (
        <span className={record.status === 1 ? "badge-active" : "badge-inactive"}>
          {record.status === 1 ? "Hoạt động" : "Ngưng hoạt động"}
        </span>
      )
    },
    {
      title: "Hành động",
      width: 80,
      align: "center",
      key: "action",
      render: (_, record) => (
        <Tooltip title="Xem chi tiết">
          <Button
            icon={<EyeOutlined style={{ fontSize: 20, color: '#a50034' }} />}
            type="text"
            onClick={() => handleShowDetail(record.id)}
            style={{ padding: 0, textAlign: 'center' }}
          />
        </Tooltip>
      )
    }
  ];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h1 style={{ color: '#a50034', fontWeight: 700, fontSize: 28, marginBottom: 24, textAlign: 'center' }}>Danh sách nguyên liệu</h1>
      <Space style={{ marginBottom: 16, display: 'flex', justifyContent: 'end' }}>
        <Select
          allowClear
          mode="multiple"
          placeholder="Chọn đơn vị"
          value={unitIds}
          onChange={val => { setUnitIds(val); setPage(0); }}
          style={{ width: 180 }}
        >
          {units.map(u => (
            <Option key={u.id} value={u.id}>{u.name}</Option>
          ))}
        </Select>
        <Input
          allowClear
          placeholder="Tìm kiếm tên nguyên liệu..."
          value={keyword}
          onChange={e => { setKeyword(e.target.value); setPage(0); }}
          style={{ width: 240 }}
        />
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
        onCancel={() => { setDetailOpen(false); setIsEditing(false); }}
        title={ingredientDetail ? `Chi tiết nguyên liệu: ${ingredientDetail.name}` : 'Chi tiết nguyên liệu'}
        loading={detailLoading}
        isEditing={isEditing}
      >
        {ingredientDetail && (
          <div style={{ fontSize: 16, position: 'relative' }}>
            {/* Nút ngưng hoạt động góc trên phải */}
            <Button
              icon={<StopOutlined />}
              type="default"
              danger
              size="small"
              style={{ position: 'absolute', top: 0, right: 0, zIndex: 2, background: '#fff', borderColor: '#d32f2f', color: '#d32f2f', transition: 'all 0.2s' }}
              // onClick={() => message.info('Ngưng hoạt động')}
              onMouseEnter={e => { e.currentTarget.style.background = '#d32f2f'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#d32f2f'; }}
            />
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>Tên:</label>
              <Input
                value={ingredientDetail.name || ''}
                disabled={!isEditing}
                size="large"
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>Đơn vị chuẩn:</label>
              <Select
                value={ingredientDetail.unitId || undefined}
                disabled={!isEditing}
                style={{ width: '100%' }}
                onChange={val => {
                  setIngredientDetail({ ...ingredientDetail, unitId: val });
                }}
                size="large"
                placeholder="Chọn đơn vị"
              >
                {units.map(u => (
                  <Option key={u.id} value={u.id}>{u.name}</Option>
                ))}
              </Select>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>Mô tả:</label>
              <Input.TextArea
                value={ingredientDetail.description || 'Không có'}
                disabled={!isEditing}
                autoSize={{ minRows: 2, maxRows: 4 }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 24 }}>
              {isEditing ? (
                <Button
                  type="primary"
                  className="btn-save"
                  icon={<SaveOutlined />}
                  onClick={() => { setIsEditing(false); handleEdit(ingredientDetail.id); }}
                  style={{ minWidth: 100, backgroundColor: '#349f4aff', color: '#fff', transition: 'all 0.2s', hover: { background: '#246badff' } }}
                >
                  Lưu
                </Button>
              ) : (
                <Button
                  icon={<EditOutlined />}
                  className="btn-edit"
                  onClick={() => setIsEditing(true)}
                  style={{ minWidth: 100, backgroundColor: '#246badff', color: '#fff', transition: 'all 0.2s', ':hover': { background: '#ccccccff' } }}
                >
                  Sửa
                </Button>
              )}
              <Button
                type="default"
                className="btn-close"
                icon={<CloseOutlined />}
                onClick={() => { setDetailOpen(false); setIsEditing(false); }}
                style={{ minWidth: 100, transition: 'all 0.2s', ':hover': { background: '#e4e4e4ff', color: '#fff' } }}
              >
                Đóng
              </Button>
            </div>
          </div>
        )}
      </DetailModal>
    </div>
  );
};

export default IngredientList;

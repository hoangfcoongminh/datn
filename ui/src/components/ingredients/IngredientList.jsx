import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Input,
  Image,
  Select,
  Space,
  Tooltip,
  Row,
  Col,
  Pagination,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { fetchUnits } from "../../api/unit";
import {
  filterIngredients,
  detailIngredient,
  updateIngredient,
} from "../../api/ingredient";
import PopUp from "../common/PopUp";
import "./IngredientList.css";
import 'antd/dist/reset.css';
import { toast } from "react-toastify";
import ModelStatus from "../../enums/modelStatus";
import ConfirmModal from "../common/ConfirmModal";

const { Option } = Select;

const IngredientList = () => {
  const navigate = useNavigate();
  const [ingredients, setIngredients] = useState([]);
  const [ingredient, setIngredient] = useState(null);
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
  const [previewImg, setPreviewImg] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    fetchUnits().then((data) => setUnits(Array.isArray(data) ? data : []));
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await filterIngredients({
        page,
        size: pageSize,
        sort: "name,asc",
        search: keyword,
        unitIds: unitIds || undefined,
      });
      setIngredients(data.content || []);
      setTotal(data.total || 0);
    } catch (err) {
      toast.error(err.message || "Lỗi khi tải nguyên liệu");
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
      setIngredientDetail(data);
      setFormData(data);
      setIsEditing(false);
    } catch (err) {
      setIngredientDetail(null);
      toast.error(err.message || "Lỗi khi tải chi tiết nguyên liệu");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleShowToEdit = async (id) => {
    if (localStorage.getItem("token")) {
      setDetailOpen(true);
      setDetailLoading(true);
      try {
        const data = await detailIngredient(id);
        setIngredientDetail(data);
        setFormData(data);
        setIsEditing(true);
      } catch (err) {
        setIngredientDetail(null);
        setFormData(null);
        toast.error(err.message || "Lỗi khi tải chi tiết nguyên liệu");
      } finally {
        setDetailLoading(false);
      }
    } else {
      toast.warning("Bạn phải Đăng nhập để chỉnh sửa nguyên liệu!");
      setTimeout(() => navigate("/login"), 1000);
    }
  };

  const handleUpdateIngredient = async (ingredient, file) => {
    const jsonRequest = {
      id: ingredient.id,
      name: ingredient.name,
      unitId: ingredient.unitId,
      description: ingredient.description,
      status: ingredient.status,
    };
    const img = file ? file : null;
    setDetailLoading(true);
    try {

      await updateIngredient({ ingredient: jsonRequest, imageFile: img });

      toast.success("Cập nhật thành công!");
      // setTimeout(() => {
      //   handleShowDetail(formData.id);
      fetchData();
      // }, 500);
    } catch (err) {
      toast.error(err.message || "Cập nhật thất bại!");
    } finally {
      setDetailLoading(false);
      setConfirmOpen(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1
        style={{
          color: "#a50034",
          fontWeight: 700,
          fontSize: 40,
          marginBottom: 24,
          textAlign: "center",
        }}
      >
        Danh sách nguyên liệu
      </h1>
      <Space
        style={{ marginBottom: 16, display: "flex", justifyContent: "end" }}
      >
        <Select
          allowClear
          mode="multiple"
          placeholder="Chọn đơn vị"
          value={unitIds}
          onChange={(val) => {
            setUnitIds(val);
            setPage(0);
          }}
          style={{ width: 180 }}
        >
          {units.map((u) => (
            <Option key={u.id} value={u.id}>
              {u.name}
            </Option>
          ))}
        </Select>
        <Input
          allowClear
          placeholder="Tìm kiếm tên nguyên liệu..."
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            setPage(0);
          }}
          style={{ width: 240, borderRadius: 8 }}
        />
      </Space>
      <div style={{ minHeight: 300 }}>
        <Row gutter={[24, 24]}>
          {ingredients.map((item) => {
            const unit = units.find((u) => u.id === item.unitId);
            return (
              <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
                <Card
                  hoverable
                  className="ingredient-card"
                  style={{
                    borderRadius: 16,
                    boxShadow: "0 2px 12px rgba(165,0,52,0.07)",
                    minHeight: 280,
                  }}
                  title={
                    <span style={{ color: "#a50034", fontWeight: 600 }}>
                      {item.name}
                    </span>
                  }
                  extra={
                    <Tooltip title="Xem chi tiết">
                      <Button
                        icon={
                          <EyeOutlined
                            style={{ fontSize: 18, color: "#a50034" }}
                          />
                        }
                        type="text"
                        onClick={() => handleShowDetail(item.id)}
                        style={{ padding: 0 }}
                      />
                    </Tooltip>
                  }
                  styles={{ body: { padding: 32 } }}
                >
                  {item.imgUrl && (
                    <img
                      src={item.imgUrl}
                      alt={item.name}
                      style={{
                        width: "100%",
                        height: 120,
                        objectFit: "cover",
                        borderRadius: 12,
                        marginBottom: 12,
                        background: "#f5f5f5",
                      }}
                    />
                  )}
                  <div style={{ marginBottom: 10 }}>
                    <span style={{ fontWeight: 500 }}>Đơn vị:</span>{" "}
                    {unit ? unit.name : ""}
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <span style={{ fontWeight: 500 }}>Mô tả:</span>{" "}
                    {item.description || "Không có"}
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>

      {/* Pagination dưới cùng trang */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
        <Pagination
          current={page + 1}
          pageSize={pageSize}
          total={total}
          showSizeChanger
          pageSizeOptions={[4, 8, 12, 16, 20, 24, 32, 40]}
          onChange={(p, ps) => {
            setPage(p - 1);
            setPageSize(ps);
          }}
          showTotal={(t) => `Tổng ${t} nguyên liệu`}
        />
      </div>
      <PopUp
        open={detailOpen}
        onCancel={() => {
          setDetailOpen(false);
          setIsEditing(false);
        }}
        title={
          ingredientDetail
            ? `Chi tiết nguyên liệu: ${ingredientDetail.name}`
            : "Chi tiết nguyên liệu"
        }
        loading={detailLoading}
        // isEditing={isEditing}
      >
        {ingredientDetail && (
          <div style={{ fontSize: 16, position: "relative", marginTop: 24, marginBottom: 24 }}>
            {/* Nút ngưng hoạt động góc trên phải */}
            <Button
              icon={<StopOutlined />}
              type="default"
              danger
              size="small"
              style={{
                position: "absolute",
                top: -10,
                right: 0,
                zIndex: 2,
                background: "#fff",
                borderColor: "#d32f2f",
                color: "#d32f2f",
                transition: "all 0.2s",
              }}
              onClick={(e) => {
                e.stopPropagation();
                setConfirmOpen(true);
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#d32f2f";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#fff";
                e.currentTarget.style.color = "#d32f2f";
              }}
            >
              Ngưng hoạt động
            </Button>
            <ConfirmModal
              open={confirmOpen}
              onOk={async () => {
                const newFormData = { ...formData, status: ModelStatus.INACTIVE };
                setFormData(newFormData);
                await handleUpdateIngredient(newFormData, selectedFile);
                // setConfirmOpen(false);
                setDetailOpen(false);
                toast.success("Đã ngưng hoạt động!");
              }}
              onCancel={() => {
                setConfirmOpen(false);
              }}
              title="Xác nhận Ngưng hoạt động nguyên liệu"
              content={
                formData
                  ? `Bạn có chắc chắn muốn Ngưng hoạt động nguyên liệu "${formData.name}"?`
                  : ""
              }
              okText="Ngưng hoạt động"
              cancelText="Huỷ"
            />
            <div style={{ marginBottom: 16 }}>
              <label
                style={{ fontWeight: 500, marginBottom: 4, display: "block" }}
              >
                Tên:
              </label>
              <Input
                value={typeof formData.name === 'string' ? formData.name : ''}
                disabled={!isEditing}
                size="large"
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  });
                }}
              />
            </div>
            <div style={{ marginBottom: 16, textAlign: "center" }}>
              {isEditing ? (
                <>
                  <label
                    style={{
                      fontWeight: 500,
                      marginBottom: 4,
                      display: "block",
                      textAlign: "left",
                    }}
                  >
                    Chọn ảnh mới:
                  </label>
                  <Input
                    type="file"
                    style={{ marginBottom: 8 }}
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files && e.target.files[0];
                      setSelectedFile(file || null);
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => setPreviewImg(ev.target.result);
                        reader.readAsDataURL(file);
                      } else {
                        setPreviewImg(null);
                      }
                    }}
                  />
                  {(previewImg || ingredientDetail.imgUrl) && (
                    <Image
                      src={previewImg || ingredientDetail.imgUrl}
                      style={{ width: "80%", borderRadius: 8 }}
                    />
                  )}
                </>
              ) : (
                <>
                  <label
                    style={{
                      fontWeight: 500,
                      marginBottom: 4,
                      display: "block",
                      textAlign: "left",
                    }}
                  >
                    Ảnh hiện tại:
                  </label>
                  {ingredientDetail && ingredientDetail.imgUrl && (
                    <Image
                      src={ingredientDetail.imgUrl}
                      style={{ width: "80%", borderRadius: 8 }}
                    />
                  )}
                </>
              )}
            </div>
            <div style={{ marginBottom: 16 }}>
              <label
                style={{ fontWeight: 500, marginBottom: 4, display: "block" }}
              >
                Đơn vị chuẩn:
              </label>
              <Select
                value={ingredientDetail.unitId || undefined}
                disabled={!isEditing}
                style={{ width: "100%", borderRadius: 8 }}
                onChange={(val) => {
                  setIngredientDetail({ ...ingredientDetail, unitId: val });
                }}
                size="large"
                placeholder="Chọn đơn vị"
              >
                {units.map((u) => (
                  <Option key={u.id} value={u.id}>
                    {u.name}
                  </Option>
                ))}
              </Select>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label
                style={{ fontWeight: 500, marginBottom: 4, display: "block" }}
              >
                Mô tả:
              </label>
              <Input.TextArea
                value={typeof formData.description === 'string' ? formData.description : ''}
                disabled={!isEditing}
                autoSize={{ minRows: 2, maxRows: 4 }}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  });
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 16,
                marginTop: 24,
              }}
            >
              {isEditing ? (
                <Button
                  type="primary"
                  className="btn-save"
                  icon={<SaveOutlined />}
                  onClick={async () => await handleUpdateIngredient(formData, selectedFile)}
                  style={{
                    minWidth: 100,
                    backgroundColor: "#349f4aff",
                    color: "#fff",
                    transition: "all 0.2s",
                    borderRadius: 8,
                  }}
                >
                  Lưu
                </Button>
              ) : (
                <Button
                  icon={<EditOutlined />}
                  className="btn-edit"
                  onClick={() => handleShowToEdit(ingredientDetail.id)}
                  style={{
                    minWidth: 100,
                    backgroundColor: "#246badff",
                    color: "#fff",
                    transition: "all 0.2s",
                    borderRadius: 8,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#184a79ff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#246badff"; }}
                  loading={detailLoading}
                >
                  Sửa
                </Button>
              )}
              <Button
                type="default"
                className="btn-close"
                icon={<CloseOutlined />}
                onClick={() => {
                  setDetailOpen(false);
                  setIsEditing(false);
                }}
                style={{
                  minWidth: 100,
                  transition: "all 0.2s",
                  borderRadius: 8,
                }}
              >
                Đóng
              </Button>
            </div>
          </div>
        )}
      </PopUp>
    </div>
  );
};

export default IngredientList;

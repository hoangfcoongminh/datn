import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  filterIngredients,
  addIngredient,
  updateIngredient,
  detailIngredient,
} from "../../api/ingredient";
import { fetchUnits } from "../../api/unit";
import {
  Input,
  Pagination,
  Select,
  Card,
  Empty,
  Spin,
  Button,
  message,
  Tooltip,
  Image,
} from "antd";
import {
  SaveOutlined,
  StopOutlined,
  EyeOutlined,
  CloseOutlined,
  EditOutlined,
} from "@ant-design/icons";
import ConfirmModal from "../common/ConfirmModal";
import PopUp from "../common/popup/PopUp";
import "./IngredientPage.css";
import "antd/dist/reset.css";
import { toast } from "react-toastify";
import ModelStatus from "../../enums/modelStatus";
import ChatLauncher from "../common/chatbot/ChatLauncher";
import ScrollToTopButton from "../common/ScrollToTopButton";

const { Option } = Select;

const IngredientPage = () => {
  const navigate = useNavigate();
  const [ingredients, setIngredients] = useState([]);
  const [units, setUnits] = useState([]);

  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("id,asc");
  const [unitIds, setUnitIds] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [pageLoading, setPageLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const [popUp, setPopUp] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [addingIngredient, setAddingIngredient] = useState({
    name: "",
    description: "",
    unitId: null,
  });
  const [editingIngredient, setEditingIngredient] = useState(null);
  const [detail, setDetail] = useState(null);

  const [previewImg, setPreviewImg] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });

  useEffect(() => {
    fetchUnits().then((data) =>
      setUnits(Array.isArray(data.data) ? data.data : [])
    );
  }, []);

  const fetchData = async () => {
    setPageLoading(true);
    try {
      const data = await filterIngredients({
        page,
        size,
        sort: sortField,
        search,
        unitIds,
      });
      setIngredients(data.data || []);
      setTotal(data.total || 0);
    } catch (err) {
      toast.error(err.message || "Lỗi khi tải nguyên liệu");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, size, search, sortField, unitIds]);

  const handleShowDetail = async (ing) => {
    try {
      const res = await detailIngredient(ing.id);
      setDetail(res.data);
      setEditingIngredient(res.data);
      setDetailOpen(true);
      setIsEditing(false);
    } catch (err) {
      setDetail(null);
      toast.error(err.message || "Lỗi khi tải chi tiết nguyên liệu");
    }
  };

  const handleAddIngredient = async (ingredient, file) => {
    try {
      setBtnLoading(true);
      if (!ingredient.name || !ingredient.unitId) {
        toast.error("Tên và đơn vị nguyên liệu không được để trống");
        return;
      }

      const cleaned = {
        name: ingredient.name.trim(),
        description: ingredient.description?.trim() || "",
        unitId: ingredient.unitId,
      };

      await addIngredient({ addingIngredient: cleaned, imageFile: file });
      toast.success("Đã thêm nguyên liệu!");
      setPopUp(false);
      setAddingIngredient({ name: "", description: "", unitId: null });
      setPreviewImg(null);
      setSelectedFile(null);
      fetchData();
    } catch (err) {
      console.error("Lỗi khi thêm nguyên liệu:", err);
      toast.error(err.message || "Lỗi khi thêm nguyên liệu");
    } finally {
      setBtnLoading(false);
    }
  };

  const handleUpdateIngredient = async (ing, file) => {
    setBtnLoading(true);
    try {
      if (!ing.name || !ing.unitId) {
        toast.error("Tên và đơn vị nguyên liệu không được để trống");
        return;
      }

      const req = {
        id: ing.id,
        name: ing.name.trim(),
        description: ing.description?.trim() || "",
        status: ing.status,
        unitId: ing.unitId,
      };

      await updateIngredient({ ingredient: req, imageFile: file });
      toast.success("Cập nhật nguyên liệu thành công!");
      if (ing.status === ModelStatus.INACTIVE) setDetailOpen(false);
      setIsEditing(false);
      fetchData();
    } catch (err) {
      console.error("Lỗi khi cập nhật nguyên liệu:", err);
      toast.error(err.message || "Cập nhật thất bại");
    } finally {
      setBtnLoading(false);
      setConfirmOpen(false);
    }
  };

  return (
    <div className="ingredient-page-container">
      <h1 className="ingredient-title">Danh sách Nguyên liệu</h1>

      {/* Search + Filter */}
      <div className="ingredient-search-form">
        <Button
          type="primary"
          style={{
            background: "#a50034",
            borderColor: "#a50034",
            fontWeight: 500,
            borderRadius: 6,
          }}
          onClick={() => {
            if (
              user &&
              (user.user.role === "USER" || user.user.role === "ADMIN")
            ) {
              setAddingIngredient({ name: "", description: "", unitId: null });
              setPopUp(true);
            } else {
              setPopUp(false);
              toast.warning("Bạn phải Đăng nhập để thêm Nguyên liệu!");
              setTimeout(() => navigate("/login"), 1000);
            }
          }}
        >
          + Thêm Nguyên liệu
        </Button>

        <div className="filter-group">
          <label>Sắp xếp theo</label>
          <Select
            value={sortField}
            style={{ width: 160, borderRadius: 8 }}
            onChange={(value) => {
              setSortField(value);
              setPage(0);
            }}
            options={[
              { value: "name,asc", label: "Tên tăng dần" },
              { value: "name,desc", label: "Tên giảm dần" },
              { value: "id,asc", label: "Cũ nhất" },
              { value: "id,desc", label: "Mới nhất" },
            ]}
          />
        </div>

        <div className="filter-group">
          <label>Đơn vị</label>
          <Select
            mode="multiple"
            allowClear
            placeholder="Chọn đơn vị"
            value={unitIds}
            onChange={(val) => {
              setUnitIds(val);
              setPage(0);
            }}
            style={{ width: 200 }}
          >
            {units.map((u) => (
              <Option key={u.id} value={u.id}>
                {u.name}
              </Option>
            ))}
          </Select>
        </div>

        <div className="filter-group search-group">
          <label>Tìm kiếm</label>
          <Input
            allowClear
            placeholder="Tìm kiếm nguyên liệu..."
            value={search}
            onChange={(e) => {
              setPage(0);
              setSearch(e.target.value);
            }}
            style={{ width: 240, borderRadius: 8 }}
          />
        </div>
      </div>

      {/* Grid list */}
      <div style={{ marginTop: 32 }}>
        {pageLoading ? (
          <div style={{ textAlign: "center", margin: "40px 0" }}>
            <Spin size="large" />
          </div>
        ) : ingredients.length === 0 ? (
          <Empty
            description="Chưa có nguyên liệu"
            style={{ margin: "40px 0" }}
          />
        ) : (
          <div className="ingredient-grid">
            {ingredients.map((ing) => (
              <Card
                key={ing.id}
                hoverable
                className="ingredient-card"
                cover={
                  ing.imgUrl && (
                    <div className="ingredient-image-wrapper">
                      <img
                        src={ing.imgUrl}
                        alt={ing.name}
                        className="ingredient-image"
                      />
                    </div>
                  )
                }
                style={{
                  borderRadius: 18,
                  overflow: "hidden",
                  position: "relative",
                  minHeight: 120, padding: "16px"
                }}
              >
                <h2>{ing.name}</h2>
                <p>{ing.description || 'Chưa có mô tả'}</p>
                <Tooltip title="Xem chi tiết" className="detail-ingredient">
                  <Button
                    icon={
                      <EyeOutlined style={{ fontSize: 18, color: "#a50034" }} />
                    }
                    type="text"
                    onClick={() => handleShowDetail(ing)}
                    style={{ padding: 0 }}
                  />
                </Tooltip>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="pagination-section">
          <div className="pagination-info">
            <span>Hiển thị {size} nguyên liệu mỗi trang</span>
          </div>
          <div className="pagination-controls">
            <Pagination
              current={page + 1}
              pageSize={size}
              total={total}
              showSizeChanger
              onChange={(p, ps) => {
                setPage(p - 1);
                setSize(ps);
              }}
            />
          </div>
        </div>
      </div>

      {/* Popup thêm mới */}
      <PopUp
        open={popUp}
        onCancel={() => setPopUp(false)}
        title="Thêm Nguyên liệu"
        btnLoading={btnLoading}
      >
        <div style={{ fontSize: 16 }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 500 }}>Tên nguyên liệu:</label>
            <Input
              size="large"
              value={addingIngredient.name}
              onChange={(e) =>
                setAddingIngredient({
                  ...addingIngredient,
                  name: e.target.value,
                })
              }
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 500 }}>Đơn vị chuẩn:</label>
            <Select
              value={addingIngredient.unitId}
              style={{ width: "100%" }}
              onChange={(val) =>
                setAddingIngredient({ ...addingIngredient, unitId: val })
              }
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
            <label style={{ fontWeight: 500 }}>Hình minh họa (tùy chọn):</label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                setSelectedFile(file || null);
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (ev) => setPreviewImg(ev.target.result);
                  reader.readAsDataURL(file);
                } else setPreviewImg(null);
              }}
            />
            {previewImg && (
              <div style={{ textAlign: "center", marginTop: 12 }}>
                <Image
                  src={previewImg}
                  style={{ width: "80%", borderRadius: 8 }}
                />
              </div>
            )}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 500 }}>Mô tả:</label>
            <Input.TextArea
              rows={3}
              value={addingIngredient.description}
              onChange={(e) =>
                setAddingIngredient({
                  ...addingIngredient,
                  description: e.target.value,
                })
              }
            />
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={async () =>
                await handleAddIngredient(addingIngredient, selectedFile)
              }
              loading={btnLoading}
            >
              Thêm
            </Button>
            <Button icon={<CloseOutlined />} onClick={() => setPopUp(false)}>
              Đóng
            </Button>
          </div>
        </div>
      </PopUp>

      {/* Popup chi tiết */}
      {detail && (
        <PopUp
          open={detailOpen}
          onCancel={() => setDetailOpen(false)}
          title={`Chi tiết nguyên liệu: ${detail.name}`}
          btnLoading={btnLoading}
        >
          <div style={{ fontSize: 16 }}>
            <div style={{ marginBottom: 16 }}>
              {detail.createdBy === user?.user.username && (
                <Button
                  icon={<StopOutlined />}
                  style={{
                    position: "absolute",
                    top: 50,
                    right: 24,
                    background: "#fff",
                    borderColor: "#d32f2f",
                    color: "#d32f2f",
                  }}
                  onClick={() => setConfirmOpen(true)}
                >
                  Ngưng hoạt động
                </Button>
              )}
              <label>Tên nguyên liệu:</label>
              <Input
                size="large"
                value={editingIngredient?.name}
                disabled={!isEditing}
                onChange={(e) =>
                  setEditingIngredient({
                    ...editingIngredient,
                    name: e.target.value,
                  })
                }
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label>Ảnh minh họa:</label>
              {isEditing && (
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    setSelectedFile(file || null);
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => setPreviewImg(ev.target.result);
                      reader.readAsDataURL(file);
                    } else setPreviewImg(null);
                  }}
                />
              )}
              {(previewImg || editingIngredient?.imgUrl) && (
                <div style={{ textAlign: "center", marginTop: 12 }}>
                  <Image
                    src={previewImg || editingIngredient.imgUrl}
                    style={{ width: "50%", borderRadius: 8 }}
                  />
                </div>
              )}
            </div>

            <div style={{ marginBottom: 16 }}>
              <label>Đơn vị chuẩn:</label>
              <Select
                value={editingIngredient?.unitId}
                disabled={!isEditing}
                style={{ width: "100%" }}
                onChange={(val) =>
                  setEditingIngredient({ ...editingIngredient, unitId: val })
                }
              >
                {units.map((u) => (
                  <Option key={u.id} value={u.id}>
                    {u.name}
                  </Option>
                ))}
              </Select>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label>Mô tả:</label>
              <Input.TextArea
                rows={3}
                value={editingIngredient?.description}
                disabled={!isEditing}
                onChange={(e) =>
                  setEditingIngredient({
                    ...editingIngredient,
                    description: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
            {user &&
              user.user.username === detail.createdBy &&
              (isEditing ? (
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={async () =>
                    await handleUpdateIngredient(
                      editingIngredient,
                      selectedFile
                    )
                  }
                  loading={btnLoading}
                >
                  Lưu
                </Button>
              ) : (
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => setIsEditing(true)}
                >
                  Sửa
                </Button>
              ))}
            <Button
              icon={<CloseOutlined />}
              onClick={() => setDetailOpen(false)}
            >
              Đóng
            </Button>
          </div>
        </PopUp>
      )}

      {/* Confirm ngưng hoạt động */}
      <ConfirmModal
        open={confirmOpen}
        onOk={() => {
          const updated = {
            ...editingIngredient,
            status: ModelStatus.INACTIVE,
          };
          setEditingIngredient(updated);
          handleUpdateIngredient(updated);
        }}
        onCancel={() => setConfirmOpen(false)}
        title="Xác nhận Ngưng hoạt động nguyên liệu"
        content={
          editingIngredient
            ? `Bạn có chắc chắn muốn ngưng hoạt động nguyên liệu "${editingIngredient.name}"?`
            : ""
        }
        okText="Ngưng hoạt động"
        cancelText="Huỷ"
      />
      <ScrollToTopButton />
      <ChatLauncher />
    </div>
  );
};

export default IngredientPage;

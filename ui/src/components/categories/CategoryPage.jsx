import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchCategories,
  addCategory,
  updateCategory,
} from "../../api/category";
import {
  Input,
  Pagination,
  Select,
  Card,
  Empty,
  Spin,
  Typography,
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
import PopUp from "../common/PopUp";
import "./CategoryPage.css";
import "antd/dist/reset.css";
import { toast } from "react-toastify";
import ModelStatus from "../../enums/modelStatus";

const PAGE_SIZE_OPTIONS = [5, 10, 20];
const { Option } = Select;

const CategoryPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [updatingCategory, setUpdatingCategory] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [total, setTotal] = useState(0);
  const [pageLoading, setPageLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [popUp, setPopUp] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [addingCategory, setAddingCategory] = useState({
    name: "",
    description: "",
  });
  const [editingCategory, setEditingCategory] = useState(null);
  const [detail, setDetail] = useState(null);
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });
  const [previewImg, setPreviewImg] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const handleStorage = () => {
      try {
        setUser(JSON.parse(localStorage.getItem("user")));
      } catch {
        setUser(null);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const fetchData = async () => {
    setPageLoading(true);
    try {
      const data = await fetchCategories({
        page,
        size: size,
        sort: "name,asc",
        search: search,
      });
      setCategories(data.content || []);
      setTotal(data.total || 0);
    } catch (err) {
      toast.error(err.message || "Lỗi khi tải danh mục");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, size, search]);

  const handleShowDetail = async (cat) => {
    try {
      setDetail(cat);
      setEditingCategory(cat);
      setDetailOpen(true);
      setIsEditing(false);
    } catch (err) {
      setIngredientDetail(null);
      toast.error(err.message || "Lỗi khi tải chi tiết nguyên liệu");
    } finally {
      setBtnLoading(false);
    }
  };

  const handleAddCategory = async (addingCategory, file) => {
    try {
      setBtnLoading(true);
      await addCategory({ addingCategory: addingCategory, imageFile: file });
      toast.success("Đã thêm danh mục!");
      setPopUp(false);
      setAddingCategory({
        name: "",
        description: "",
      });
      setPageLoading(true);
      fetchData();
    } catch (err) {
      toast.error(err.message || "Lỗi khi thêm danh mục");
    } finally {
      setBtnLoading(false);
      setFile(null);
    }
  };

  // Hàm Cập nhật category
  const handleUpdateCategory = async (cat) => {
    setBtnLoading(true);
    try {
      const category = {
        id: cat.id,
        name: cat.name,
        description: cat.description,
        status: cat.status,
      };
      await updateCategory({ updatingCategory: category });
      toast.success("Đã Cập nhật danh mục!");
      // Refetch
      if (cat.status === ModelStatus.INACTIVE) {
        setDetailOpen(false);
      }
      fetchData();
    } catch (err) {
      toast.error(err.message || "Lỗi khi Cập nhật danh mục");
    } finally {
      setBtnLoading(false);
      setConfirmOpen(false);
      setUpdatingCategory(null);
    }
  };

  return (
    <>
      <div className="category-page-container">
        <h1 className="category-title" style={{ fontSize: 40 }}>
          Danh mục món ăn
        </h1>
        <div
          className="category-search-form"
          style={{
            gap: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
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
                setAddingCategory({ name: "", description: "" });
                setPopUp(true);
              } else {
                setPopUp(false);
                toast.warning("Bạn phải Đăng nhập để thêm Danh mục!");
                setTimeout(() => navigate("/login"), 1000);
              }
            }}
          >
            + Thêm Danh mục
          </Button>
          <div className="filter-group search-group">
            <label>Tìm kiếm</label>
            <Input
              allowClear
              placeholder="Tìm kiếm tên hoặc mô tả..."
              value={search}
              onChange={(e) => {
                setPage(0);
                setSearch(e.target.value);
              }}
              style={{ width: 240, borderRadius: 8 }}
            />
          </div>
        </div>
        <div style={{ marginTop: 32 }}>
          {pageLoading ? (
            <div style={{ textAlign: "center", margin: "40px 0" }}>
              <Spin size="large" />
            </div>
          ) : categories.length === 0 ? (
            <Empty
              description="Không có danh mục phù hợp"
              style={{ margin: "40px 0" }}
            />
          ) : (
            <div className="category-grid">
              {categories.map((cat) => (
                <div key={cat.id} style={{ position: "relative" }}>
                  <Card
                    hoverable
                    className="category-card"
                    cover={
                      <div
                        style={{
                          width: "100%",
                          height: 180,
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={cat.imgUrl}
                          alt={cat.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                      </div>
                    }
                    style={{
                      borderRadius: 18,
                      overflow: "hidden",
                      position: "relative",
                    }}
                    onClick={(e) => {
                      // Nếu click vào nút Xóa thì không navigate
                      if (e.target.closest(".detail-category")) return;
                      navigate(`/recipes?categoryId=${cat.id}`);
                    }}
                    styles={{
                      body: {
                        position: "relative",
                        minHeight: 120,
                        paddingBottom: 48,
                      },
                    }}
                  >
                    <div className="category-info">
                      <h2>{cat.name}</h2>
                      <p>{cat.description}</p>
                    </div>

                    <Tooltip title="Xem chi tiết" className="detail-category">
                      <Button
                        icon={
                          <EyeOutlined
                            style={{ fontSize: 18, color: "#a50034" }}
                          />
                        }
                        type="text"
                        onClick={() => handleShowDetail(cat)}
                        style={{ padding: 0 }}
                      />
                    </Tooltip>
                  </Card>
                </div>
              ))}
            </div>
          )}

          <div
            className="pagination-section"
            style={{ justifyContent: "space-evenly" }}
          >
            <div className="pagination-info">
              <span>Hiển thị {size} công thức mỗi trang</span>
            </div>
            <div className="pagination-controls">
              <Pagination
                current={page + 1}
                pageSize={size}
                total={total}
                showSizeChanger={true}
                pageSizeOptions={PAGE_SIZE_OPTIONS.map(String)}
                onChange={(p, ps) => {
                  setPage(p - 1);
                  setSize(ps);
                }}
              />
            </div>
          </div>
        </div>
        <PopUp
          open={popUp}
          onCancel={() => {
            setPopUp(false);
          }}
          title={"Thêm Danh mục Món ăn"}
          btnLoading={btnLoading}
          // isEditing={isEditing}
        >
          <div style={{ fontSize: 16, position: "relative" }}>
            <div style={{ marginBottom: 16 }}>
              <label
                style={{ fontWeight: 500, marginBottom: 4, display: "block" }}
              >
                Tên Danh mục:
              </label>
              <Input
                size="large"
                value={addingCategory.name}
                onChange={(e) => {
                  setAddingCategory({
                    ...addingCategory,
                    name: e.target.value,
                  });
                }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label
                style={{ fontWeight: 500, marginBottom: 4, display: "block" }}
              >
                Hình minh họa (tùy chọn):
              </label>
              <Input
                type="file"
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
              {previewImg && (
                <>
                  <div style={{ textAlign: 'center'}}>
                    <Image
                    src={previewImg || ingredientDetail.imgUrl}
                    style={{ width: "80%", borderRadius: 8 }}
                  />
                  </div>
                </>
              )}
            </div>
            <div style={{ marginBottom: 16 }}>
              <label
                style={{ fontWeight: 500, marginBottom: 4, display: "block" }}
              >
                Mô tả:
              </label>
              <Input.TextArea
                autoSize={{ minRows: 2, maxRows: 4 }}
                value={addingCategory.description}
                onChange={(e) => {
                  setAddingCategory({
                    ...addingCategory,
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
              <Button
                type="primary"
                className="btn-save"
                icon={<SaveOutlined />}
                onClick={async () =>
                  await handleAddCategory(addingCategory, selectedFile)
                }
                style={{
                  minWidth: 100,
                  backgroundColor: "#349f4aff",
                  color: "#fff",
                  transition: "all 0.2s",
                  borderRadius: 8,
                }}
                loading={btnLoading}
              >
                Thêm
              </Button>
              <Button
                type="default"
                className="btn-close"
                icon={<CloseOutlined />}
                onClick={() => {
                  setPopUp(false);
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
        </PopUp>
        {detail && (
          <PopUp
            open={detailOpen}
            onCancel={() => {
              setDetailOpen(false);
            }}
            title={`Chi tiết danh mục: ${detail.name}`}
            btnLoading={btnLoading}
            // isEditing={isEditing}
          >
            <div style={{ fontSize: 16 }}>
              <div style={{ marginTop: 24, marginBottom: 24 }}>
                {detail.createdBy === user.user.username && (
                  <Button
                    icon={<StopOutlined />}
                    type="default"
                    // danger
                    size="small"
                    className="inactive-btn"
                    style={{
                      position: "absolute",
                      top: 50,
                      right: 24,
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
                  >
                    Ngưng hoạt động
                  </Button>
                )}
                <label
                  style={{
                    fontWeight: 500,
                    marginBottom: 4,
                    display: "block",
                  }}
                >
                  Tên Danh mục:
                </label>
                <Input
                  size="large"
                  value={editingCategory.name}
                  disabled={!isEditing}
                  onChange={(e) => {
                    setEditingCategory({
                      ...editingCategory,
                      name: e.target.value,
                    });
                  }}
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    fontWeight: 500,
                    marginBottom: 4,
                    display: "block",
                  }}
                >
                  Mô tả:
                </label>
                <Input.TextArea
                  autoSize={{ minRows: 2, maxRows: 4 }}
                  value={editingCategory.description}
                  disabled={!isEditing}
                  onChange={(e) => {
                    setEditingCategory({
                      ...editingCategory,
                      description: e.target.value,
                    });
                  }}
                />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 16,
                marginTop: 24,
              }}
            >
              {user &&
                user.user.username === detail.createdBy &&
                (isEditing ? (
                  <Button
                    type="primary"
                    className="btn-save"
                    icon={<SaveOutlined />}
                    onClick={async () =>
                      await handleUpdateCategory(editingCategory)
                    }
                    style={{
                      minWidth: 100,
                      backgroundColor: "#349f4aff",
                      color: "#fff",
                      transition: "all 0.2s",
                      borderRadius: 8,
                      cursor: "pointer",
                    }}
                    loading={btnLoading}
                  >
                    Lưu
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    className="btn-edit"
                    icon={<EditOutlined />}
                    onClick={() => {
                      setIsEditing(true);
                    }}
                    style={{
                      minWidth: 100,
                      backgroundColor: "#246badff",
                      color: "#fff",
                      transition: "all 0.2s",
                      borderRadius: 8,
                      cursor: "pointer",
                    }}
                  >
                    Sửa
                  </Button>
                ))}
              <Button
                type="default"
                className="btn-close"
                icon={<CloseOutlined />}
                onClick={() => {
                  setDetailOpen(false);
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
          </PopUp>
        )}
        <ConfirmModal
          open={confirmOpen}
          onOk={() => {
            const updatedCategory = {
              ...editingCategory,
              status: ModelStatus.INACTIVE,
            };

            setEditingCategory(updatedCategory);
            handleUpdateCategory(updatedCategory);
          }}
          onCancel={() => {
            setConfirmOpen(false);
          }}
          title="Xác nhận Ngưng hoạt động danh mục"
          content={
            updatingCategory
              ? `Bạn có chắc chắn muốn Ngưng hoạt động danh mục "${updatingCategory.name}"?`
              : ""
          }
          okText="Ngưng hoạt động"
          cancelText="Huỷ"
        />
      </div>
    </>
  );
};
export default CategoryPage;

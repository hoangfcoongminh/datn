import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCategories, updateCategory } from "../../api/category";
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
} from "antd";
import { StopOutlined } from "@ant-design/icons";
import ConfirmModal from "../common/ConfirmModal";

// Kiểm tra quyền user
const user = JSON.parse(localStorage.getItem("user"));
import "./CategoryPage.css";
import "antd/dist/reset.css";
import { toast } from "react-toastify";

const PAGE_SIZE_OPTIONS = [5, 10, 20];
const { Option } = Select;

const CategoryPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [deleteCat, setDeleteCat] = useState(null); // category chờ xác nhận Xóa
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0); // page API bắt đầu từ 0
  const [size, setSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchCategories({
      page,
      size,
      search,
    })
      .then((data) => {
        setCategories(data?.content || []);
        setTotal(data?.total || 0);
      })
      .catch(() => {
        setCategories([]);
        setTotal(0);
      })
      .finally(() => setLoading(false));
  }, [page, size, search]);

  // Hàm Xóa mềm category
  const handleDelete = async (cat) => {
    try {
      await updateCategory({
        id: cat.id,
        name: cat.name,
        description: cat.description,
        status: 0,
      });
      toast.success("Đã Xóa danh mục!");
      // Refetch
      setLoading(true);
      const data = await fetchCategories({ page, size, search });
      setCategories(data?.content || []);
      setTotal(data?.total || 0);
    } catch (err) {
      toast.error(err.message || "Lỗi khi Xóa danh mục");
    } finally {
      setLoading(false);
      setConfirmOpen(false);
      setDeleteCat(null);
    }
  };

  return (
    <div className="category-page-container">
      <h1 className="category-title" style={{ fontSize: 40 }}>Danh mục món ăn</h1>
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
              navigate("/categories/add");
            } else {
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
            placeholder="Nhập từ khóa..."
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
        {loading ? (
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
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="category-image"
                    />
                  }
                  style={{
                    borderRadius: 18,
                    overflow: "hidden",
                    position: "relative",
                  }}
                  onClick={(e) => {
                    // Nếu click vào nút Xóa thì không navigate
                    if (e.target.closest(".delete-category-btn")) return;
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
                  {user &&
                    (user.user?.role === "ADMIN" ||
                      user.user?.role === "USER") && (
                      <Button
                      icon={<StopOutlined />}
                        danger
                        type="primary"
                        size="small"
                        className="delete-category-btn delete-btn-hover"
                        style={{
                          position: "absolute",
                          right: 12,
                          bottom: 12,
                          zIndex: 2,
                          background: "#fff",
                          color: "#a50034",
                          borderColor: "#a50034",
                          fontWeight: 600,
                          borderRadius: 4,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteCat(cat);
                          setConfirmOpen(true);
                        }}
                      >
                        Ngưng hoạt động
                      </Button>
                    )}
                </Card>
              </div>
            ))}
            <ConfirmModal
              open={confirmOpen}
              onOk={() => deleteCat && handleDelete(deleteCat)}
              onCancel={() => {
                setConfirmOpen(false);
                setDeleteCat(null);
              }}
              title="Xác nhận Xóa danh mục"
              content={
                deleteCat
                  ? `Bạn có chắc chắn muốn Xóa danh mục "${deleteCat.name}"?`
                  : ""
              }
              okText="Xóa"
              cancelText="Huỷ"
            />
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
    </div>
  );
};

export default CategoryPage;

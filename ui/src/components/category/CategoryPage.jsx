import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCategories } from "../../api/category";
import { filterRecipes } from "../../api/recipe";
import { Input, Pagination, Select, Card, Empty, Spin, Typography } from "antd";
import "./CategoryPage.css";
import "antd/dist/reset.css";

const PAGE_SIZE_OPTIONS = [5, 10, 20];
const { Option } = Select;

const CategoryPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
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

  return (
    <div className="category-page-container">
      <h1 className="category-title">Danh mục món ăn</h1>
      <div className="category-search-form" style={{ gap: 16 }}>
        <Input.Search
          allowClear
          placeholder="Tìm kiếm tên hoặc mô tả..."
          value={search}
          onChange={(e) => {
            setPage(0);
            setSearch(e.target.value);
          }}
          style={{ maxWidth: 320 }}
        />
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
              <Card
                key={cat.id}
                hoverable
                className="category-card"
                cover={
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="category-image"
                  />
                }
                style={{ borderRadius: 18, overflow: "hidden" }}
                onClick={() => navigate(`/recipes?categoryId=${cat.id}`)}
              >
                <div className="category-info">
                  <h2>{cat.name}</h2>
                  <p>{cat.description}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
        {/* <div style={{marginTop: 32, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 24}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
            <Typography.Text style={{fontWeight: 500}}>Số item / Trang:</Typography.Text>
            <Select
              value={size}
              onChange={val => {
                setPage(0);
                setSize(val);
              }}
              style={{minWidth: 90}}
            >
              {PAGE_SIZE_OPTIONS.map(opt => (
                <Option key={opt} value={opt}>{opt}</Option>
              ))}
            </Select>
          </div>
          <Pagination
            current={page + 1}
            pageSize={size}
            total={total}
            showSizeChanger={false}
            onChange={p => setPage(p - 1)}
            // style={{margin: '0 auto'}}
          />
        </div> */}
        <div className="pagination-section">
          <div className="pagination-info">
            <span>Hiển thị {size} công thức mỗi trang</span>
          </div>
          <div className="pagination-controls">
            <div className="page-size-selector">
              <span>Số dòng/trang:</span>
              <Select
                value={size}
                onChange={(val) => {
                  setSize(val);
                  setPage(0);
                }}
              >
                {PAGE_SIZE_OPTIONS.map((opt) => (
                  <Option key={opt} value={opt}>
                    {opt}
                  </Option>
                ))}
              </Select>
            </div>
            <Pagination
              current={page + 1}
              pageSize={size}
              total={total}
              showSizeChanger={false}
              onChange={(p) => setPage(p - 1)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;

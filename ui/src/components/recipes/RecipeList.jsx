import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaUtensils,
  FaClock,
  FaStar,
  FaHeart,
  FaArrowLeft,
} from "react-icons/fa";
import { filterRecipes } from "../../api/recipe";
import { fetchAllCategories } from "../../api/category";
import { fetchIngredients } from "../../api/ingredient";
import { Select, Pagination, Input } from "antd";
import "antd/dist/reset.css";
import "./RecipeList.css";

const { Option } = Select;
const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

const RecipeList = () => {
  const location = useLocation();
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  // Filter state
  const [keyword, setKeyword] = useState("");
  const [categoryIds, setCategoryIds] = useState([]);
  const [ingredientIds, setIngredientIds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryIdFromUrl = params.get("categoryId");

    if (categoryIdFromUrl) {
      setCategoryIds([parseInt(categoryIdFromUrl)]);
      setPage(0);
    }
    fetchAllCategories()
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
    fetchIngredients()
      .then((data) => setIngredients(Array.isArray(data) ? data : []))
      .catch(() => setIngredients([]));
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await filterRecipes({
        keyword,
        categoryIds,
        ingredientIds,
        page,
        size: pageSize,
      });
      setRecipes(data.content || []);
      setTotalPages(data.total || 1);
    } catch (err) {
      setError(err.message || "Lỗi khi tải công thức");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [keyword, categoryIds, ingredientIds, page, pageSize]);

  return (
    <div className="recipe-list-page">
      {/* Header Section */}

      {/* Filter Section */}
      <div className="filter-section">
        <div className="filter-container">
          <div className="filter-header">
            <button
            className="add-recipe-btn"
            style={{ marginLeft: "auto" }}
            onClick={() => navigate("/recipes/add")}
          >
            + Thêm công thức mới
          </button>
          </div>
          <div className="filter-content">
            <div className="filter-row">
              <div className="filter-group">
                <label>Danh mục</label>
                <Select
                  mode="multiple"
                  allowClear
                  placeholder="Chọn danh mục"
                  value={categoryIds}
                  onChange={(vals) => {
                    setCategoryIds(vals);
                    setPage(0);
                  }}
                  optionFilterProp="children"
                  showSearch
                >
                  {categories.map((cat) => (
                    <Option key={cat.id} value={cat.id}>
                      {cat.name}
                    </Option>
                  ))}
                </Select>
              </div>
              <div className="filter-group">
                <label>Nguyên liệu</label>
                <Select
                  mode="multiple"
                  allowClear
                  placeholder="Chọn nguyên liệu"
                  value={ingredientIds}
                  onChange={(vals) => {
                    setIngredientIds(vals);
                    setPage(0);
                  }}
                  optionFilterProp="children"
                  showSearch
                >
                  {ingredients.map((ing) => (
                    <Option key={ing.id} value={ing.id}>
                      {ing.name}
                    </Option>
                  ))}
                </Select>
              </div>
              <div className="filter-group search-group">
                <label>Tìm kiếm</label>
                {/* <input
                  allowClear
                  type="text"
                  placeholder="Nhập từ khóa tìm kiếm..."
                  value={keyword}
                  onChange={e => { setKeyword(e.target.value); setPage(0); }}
                  className="search-input"
                /> */}
                <Input.Search
                  allowClear
                  placeholder="Tìm kiếm tên hoặc mô tả..."
                  value={keyword}
                  onChange={(e) => {
                    setPage(0);
                    setKeyword(e.target.value);
                  }}
                  style={{ maxWidth: 320 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="content-section">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Đang tải công thức...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p>{error}</p>
          </div>
        ) : (
          <>
            <div className="recipes-grid">
              {recipes.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🍽️</div>
                  <h3>Không tìm thấy công thức</h3>
                  <p>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                </div>
              ) : (
                recipes.map((recipe) => (
                  <div key={recipe.id} className="recipe-card">
                    <div className="card-image">
                      <img
                        src={
                          recipe.imgUrl ||
                          "https://via.placeholder.com/400x250?text=No+Image"
                        }
                        alt={recipe.title}
                      />
                      <button className="like-button">
                        <FaHeart />
                      </button>
                      <div className="card-overlay">
                        <Link
                          to={`/recipes/${recipe.id}`}
                          className="view-button"
                        >
                          Xem chi tiết
                        </Link>
                      </div>
                    </div>
                    <div className="card-content">
                      <h3 className="recipe-title">{recipe.title}</h3>
                      <p className="recipe-description">{recipe.description}</p>
                      <div className="recipe-meta">
                        <div className="meta-item">
                          <FaClock />
                          <span>{recipe.time}</span>
                        </div>
                        <div className="meta-item">
                          <FaStar />
                          <span>{recipe.rating}</span>
                        </div>
                        <div className="meta-item">
                          <FaUtensils />
                          <span>{recipe.difficulty}</span>
                        </div>
                      </div>
                      <div className="card-footer">
                        <span className="likes-count">
                          {recipe.likes} lượt thích
                        </span>
                        <Link
                          to={`/recipes/${recipe.id}`}
                          className="cta-button"
                        >
                          Xem công thức
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            <div className="pagination-section">
              <div className="pagination-info">
                <span>Hiển thị {pageSize} công thức mỗi trang</span>
              </div>
              <div className="pagination-controls">
                <div className="page-size-selector">
                  <span>Số dòng/trang:</span>
                  <Select
                    value={pageSize}
                    onChange={(val) => {
                      setPageSize(val);
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
                  pageSize={pageSize}
                  total={totalPages}
                  showSizeChanger={false}
                  onChange={(p) => setPage(p - 1)}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RecipeList;

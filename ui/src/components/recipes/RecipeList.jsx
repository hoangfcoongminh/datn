import React, { use, useEffect, useState } from "react";
import ScrollToTopButton from '../common/ScrollToTopButton';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button, Spin } from "antd";
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
import { toast } from "react-toastify";
import { addFavorite } from "../../api/user";

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
  const [size, setSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [total, setTotal] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [minTime, setMinTime] = useState("");
  const [maxTime, setMaxTime] = useState("");
  const [categoryIds, setCategoryIds] = useState([]);
  const [ingredientIds, setIngredientIds] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const params = new URLSearchParams(location.search);
  const categoryIdFromUrl = params.get("categoryId");
  const [sortField, setSortField] = useState("id,asc");
  const [typeTime, setTypeTime] = useState("hour");

  useEffect(() => {
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
    setError(null);
    try {
      const data = await filterRecipes({
        keyword,
        categoryIds,
        ingredientIds,
        minTime: minTime || undefined,
        maxTime: maxTime || undefined,
        page,
        size: size,
        sort: sortField,
      });
      setRecipes(data.content || []);
      setTotal(data.total || 1);
    } catch (err) {
      setError(err.message || "Lỗi khi tải công thức");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
    // Scroll lên đầu trang mỗi khi đổi trang
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // eslint-disable-next-line
  }, [
    keyword,
    categoryIds,
    ingredientIds,
    // minTime,
    // maxTime,
    page,
    size,
    sortField,
  ]);

  const handleMinTimeChange = (value) => {
    const num = value ? Number(value) : null;

    // Chỉ validate khi cả hai giá trị cùng tồn tại
    console.log(num, " - ", maxTime);
    
    if (num !== null && maxTime !== null && num > Number(maxTime)) {
      toast.error("Khoảng thời gian không hợp lệ!");
      return;
    }

    setPage(0);
    setMinTime(value || null);
  };

  const handleMaxTimeChange = (value) => {
    const num = value ? Number(value) : null;

    // Chỉ validate khi cả hai giá trị cùng tồn tại
    console.log(minTime, " - ", num);

    if (num !== null && minTime !== null && num < Number(minTime)) {
      toast.error("Khoảng thời gian không hợp lệ!");
      return;
    }

    setPage(0);
    setMaxTime(value || null);
  };

  const [favoriteLoading, setFavoriteLoading] = useState({});
  const handleAddFavorite = async (id) => {
    setFavoriteLoading(prev => ({ ...prev, [id]: true }));
    try {
      await addFavorite(id);
      // Không cập nhật cục bộ isFavorite nữa, fetch lại danh sách để lấy totalFavorite mới nhất
      await fetchData();
    } catch (err) {
      toast.error('Lỗi khi thêm vào yêu thích');
    } finally {
      setFavoriteLoading(prev => ({ ...prev, [id]: false }));
    }
  }

  return (
    <div className="recipe-list-page">
      {/* Header Section */}
      <div
        className="recipe-list-header"
        style={{ textAlign: "center", margin: "32px 0 0 0" }}
      >
        <p
          style={{
            fontSize: 40,
            fontWeight: "bold",
            color: "#a50034",
            letterSpacing: 2,
            marginBottom: 0,
          }}
        >
          DANH SÁCH CÔNG THỨC
        </p>
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <div className="filter-container">
          <div
            className="filter-header"
            style={{ display: "flex", justifyContent: "flex-start" }}
          >
            <Button
              type="primary"
              style={{
                background: "#a50034",
                borderColor: "#a50034",
                fontWeight: 600,
                borderRadius: 8,
              }}
              onClick={() => {
                if (
                  user &&
                  (user.user.role === "USER" || user.user.role === "ADMIN")
                ) {
                  navigate("/recipes/add");
                } else {
                  toast.warning("Bạn phải Đăng nhập để thêm Công thức!");
                  setTimeout(() => navigate("/login"), 1000);
                }
              }}
            >
              + Thêm công thức mới
            </Button>
          </div>
          <div className="filter-content border">
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
                  style={{ width: 300 }}
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
                <Input
                  allowClear
                  placeholder="Tìm kiếm tên hoặc mô tả..."
                  value={keyword}
                  onChange={(e) => {
                    setPage(0);
                    setKeyword(e.target.value);
                  }}
                  style={{ maxWidth: 320, borderRadius: 8 }}
                />
              </div>
              <div className="filter-group">
                <label
                  style={{ display: "block", fontWeight: 600 }}
                >
                  Thời gian làm
                </label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    // background: "#fafafa",
                    padding: "0px 16px",
                    borderRadius: 8,
                    // border: "1px solid #ddd",
                  }}
                >
                  <label style={{ fontSize: 14 }}>Từ:</label>
                  <Input
                    type="number"
                    min={0}
                    placeholder="Từ..."
                    value={minTime ?? ""}
                    onChange={(e) => {
                      setPage(0);
                      setMinTime(e.target.value);
                      handleMinTimeChange(e.target.value);
                    }}
                    style={{
                      width: 100,
                      borderRadius: 6,
                    }}
                  />
                  <span style={{ fontWeight: 500, color: "#888" }}>-</span>
                  <label style={{ fontSize: 14 }}>Đến:</label>
                  <Input
                    type="number"
                    min={0}
                    placeholder="Đến..."
                    value={maxTime ?? ""}
                    onChange={(e) => {
                      setPage(0);
                      setMaxTime(e.target.value);
                      handleMaxTimeChange(e.target.value);
                    }}
                    style={{
                      width: 100,
                      borderRadius: 6,
                    }}
                  />
                  <Select
                    value={typeTime}
                    onChange={(value) => {
                      setTypeTime(value);
                      setPage(0);
                    }}
                    style={{ minWidth: 100 }}
                    options={[
                      { value: "minute", label: "Phút" },
                      { value: "hour", label: "Giờ" },
                    ]}
                  />
                </div>
              </div>

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
                    { value: "title,asc", label: "Tên tăng dần" },
                    { value: "title,desc", label: "Tên giảm dần" },
                    { value: "id,asc", label: "Cũ nhất" },
                    { value: "id,desc", label: "Mới nhất" },
                    // { value: "favorites,desc", label: "Yêu thích nhất" },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="content-section">
        {loading ? (
          <div style={{ textAlign: "center", margin: "40px 0" }}>
            <Spin size="large" />
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
                      <div className="recipe-meta" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div className="meta-item">
                          <FaClock />
                          <span>{recipe.cookTime.toFixed(2)} giờ</span>
                        </div>
                        <div className="meta-item">
                          <FaStar />
                          <span>{recipe.averageRating.toFixed(1)}</span>
                        </div>
                        <div className="meta-item">
                          <FaUtensils />
                          <span>{recipe.difficulty}</span>
                        </div>
                        <div className="meta-item" style={{ marginLeft: 'auto' }}>
                          <button
                            className="like-button"
                            onClick={e => {
                              e.stopPropagation();
                              e.preventDefault();
                              handleAddFavorite(recipe.id);
                            }}
                            disabled={favoriteLoading[recipe.id]}
                            title={recipe.isFavorite ? 'Bỏ yêu thích' : 'Yêu thích'}
                          >
                            {recipe.isFavorite ? <FaHeart /> : <FaHeart style={{ opacity: 0.3 }} />}
                          </button>
                        </div>
                      </div>
                      <div className="card-footer">
                        <span className="likes-count">
                          {recipe.totalFavorite} lượt thích
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
          </>
        )}
      </div>
      <ScrollToTopButton />
    </div>
  );
};

export default RecipeList;

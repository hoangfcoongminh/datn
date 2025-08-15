import React, { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaHeart } from "react-icons/fa";
import {
  recommendForUser,
  recommendForRecipe,
} from "../../../api/recommendation";
import { useNavigate } from "react-router-dom";
import { Button, Rate } from "antd";
import "./Recommendation.css";
import { toast } from "react-toastify";
import { addFavorite } from "../../../api/user";

/**
 * props:
 *   type: string ("category", "ingredient", "user", ...)
 *   id: id để truyền vào api
 *   title: tiêu đề hiển thị
 *   apiParams: object (tùy api)
 */
export default function Recommendation({
  type,
  id,
  title = "Gợi ý cho bạn",
  apiParams = {},
}) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slide, setSlide] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);
  const navigate = useNavigate();

  const fetchRecommend = async () => {
    setLoading(true);
    try {
      let data = [];
      if (type === "user") {
        data = await recommendForUser();
      } else if (type === "recipe") {
        data = await recommendForRecipe(id);
      }
      setRecipes(Array.isArray(data) ? data : []);
    } catch (err) {
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const [favoriteLoading, setFavoriteLoading] = useState({});
  const handleAddFavorite = async (id) => {
    setFavoriteLoading((prev) => ({ ...prev, [id]: true }));
    try {
      await addFavorite(id);
      // Không cập nhật cục bộ isFavorite nữa, fetch lại danh sách để lấy totalFavorite mới nhất
      await fetchRecommend();
    } catch (err) {
      toast.error("Lỗi khi thêm vào yêu thích");
    } finally {
      setFavoriteLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  useEffect(() => {
    // Responsive: 4 desktop, 2 tablet, 1 mobile
    const handleResize = () => {
      if (window.innerWidth < 600) setVisibleCount(1);
      else if (window.innerWidth < 900) setVisibleCount(2);
      else setVisibleCount(4);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchRecommend();
  }, [type, id, JSON.stringify(apiParams)]);

  // Vòng tròn, luôn hiển thị hết các card
  const maxSlide = Math.max(0, recipes.length - visibleCount);
  const next = () => setSlide((s) => (s + 1 > maxSlide ? 0 : s + 1));
  const prev = () => setSlide((s) => (s - 1 < 0 ? maxSlide : s - 1));

  // Auto slide vòng tròn
  useEffect(() => {
    if (recipes.length <= visibleCount) return;
    const timer = setInterval(() => {
      setSlide((s) => (s + 1 > maxSlide ? 0 : s + 1));
    }, 50000000);
    return () => clearInterval(timer);
  }, [recipes.length, visibleCount, maxSlide]);

  if (loading)
    return (
      <div className="recommendation-root">
        <div className="rec-loading">Đang tải...</div>
      </div>
    );
  if (!recipes.length) return null;

  return (
    <div className="recommendation-root">
      <div className="rec-header">
        <h3>{title}</h3>
      </div>
      <div className="rec-slider">
        <div className="rec-nav">
          <button className="rec-btn" onClick={prev} disabled={slide === 0}>
            <FaChevronLeft />
          </button>
          <button
            className="rec-btn"
            onClick={next}
            disabled={slide >= recipes.length - visibleCount}
          >
            <FaChevronRight />
          </button>
        </div>
        <div
          className="rec-track"
          style={{ transform: `translateX(-${slide * (100 / visibleCount)}%)` }}
        >
          {recipes.map((recipe, idx) => (
            <div
              className="rec-card"
              key={recipe.id || idx}
              style={{ width: `${100 / visibleCount}%` }}
            >
              <div className="rec-img-wrap">
                <img
                  src={
                    recipe.imgUrl ||
                    "https://via.placeholder.com/300x180?text=No+Image"
                  }
                  alt={recipe.title}
                />
              </div>
              <div className="rec-info" onClick={() => navigate(`/user/${recipe.authorUsername}`)}>
                {/* Tác giả */}
                {recipe.authorUsername && (
                  <div className="rec-author">
                    {recipe.authorAvtUrl ? (
                      <img
                        src={recipe.authorAvtUrl}
                        alt="avatar"
                        className="rec-author-avatar"
                      />
                    ) : (
                      <span
                        className="rec-author-avatar"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "#eee",
                          color: "#a50034",
                          fontWeight: 700,
                        }}
                      >
                        {recipe.authorFullName.charAt(0).toUpperCase()}
                      </span>
                    )}
                    {recipe.authorFullName}
                  </div>
                )}
                <div className="rec-title">{recipe.title}</div>
                <div className="rec-meta">
                  {typeof recipe.averageRating === "number" &&
                    !isNaN(recipe.averageRating) && (
                      <span title="Đánh giá">
                        <Rate
                          allowHalf
                          disabled
                          value={recipe.averageRating || 0}
                          style={{ fontSize: 22, color: "#faad14" }}
                        />
                        {recipe.totalReview}
                      </span>
                    )}
                  {typeof recipe.totalFavorite === "number" &&
                    !isNaN(recipe.totalFavorite) && (
                      <span
                        title="Lượt thích"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px", // khoảng cách giữa icon và số
                        }}
                      >
                        <button
                          className="like-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleAddFavorite(recipe.id);
                          }}
                          disabled={favoriteLoading[recipe.id]}
                          title={
                            recipe.isFavorite ? "Bỏ yêu thích" : "Yêu thích"
                          }
                          style={{
                            display: "flex",
                            alignItems: "center",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          {recipe.isFavorite ? (
                            <FaHeart />
                          ) : (
                            <FaHeart style={{ opacity: 0.3 }} />
                          )}
                        </button>
                        <span>{recipe.totalFavorite}</span>
                      </span>
                    )}
                </div>
                <Button
                  type="primary"
                  style={{ padding: 0, fontWeight: 600, borderRadius: 8 }}
                  onClick={() => navigate(`/recipes/${recipe.id}`)}
                >
                  Chi tiết
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

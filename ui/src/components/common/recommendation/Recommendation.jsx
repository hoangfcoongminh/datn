import React, { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import {
  recommendForUser,
  recommendForRecipe,
} from "../../../api/recommendation";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import "./Recommendation.css";

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
  const next = () =>
    setSlide((s) => (s + 1 > maxSlide ? 0 : s + 1));
  const prev = () =>
    setSlide((s) => (s - 1 < 0 ? maxSlide : s - 1));

  // Auto slide vòng tròn
  useEffect(() => {
    if (recipes.length <= visibleCount) return;
    const timer = setInterval(() => {
      setSlide((s) => (s + 1 > maxSlide ? 0 : s + 1));
    }, 5000);
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
              style={{ minWidth: `${100 / visibleCount}%` }}
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
              <div className="rec-info">
                {/* Tác giả */}
                {recipe.authorFullName && (
                  <div className="rec-author">
                    {recipe.authorImgUrl ? (
                      <img
                        src={recipe.authorImgUrl}
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
                  {typeof recipe.averageRating === 'number' && !isNaN(recipe.averageRating) && (
                    <span className="rec-rating" title="Đánh giá trung bình">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 20 20"
                        fill="#faad14"
                        style={{ marginRight: 2 }}
                      >
                        <path d="M10 15.27L16.18 18l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 3.73L3.82 18z" />
                      </svg>
                      {recipe.averageRating.toFixed(1)}
                    </span>
                  )}
                  {typeof recipe.totalFavorite === 'number' && !isNaN(recipe.totalFavorite) && (
                    <span title="Số lượt thích">
                      {recipe.totalFavorite} lượt thích
                    </span>
                  )}
                </div>
                <Button type="primary" style={{padding:0, fontWeight:600, borderRadius:8}} onClick={() => navigate(`/recipes/${recipe.id}`)}>
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

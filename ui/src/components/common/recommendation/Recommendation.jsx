import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { Card, Button, Rate, Avatar } from "antd";
import { FaHeart, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { recommendForUser, recommendForRecipe } from "../../../api/recommendation";
import { addFavorite } from "../../../api/user";

import "./Recommendation.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Recommendation({ type, id, title = "Gợi ý cho bạn" }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favoriteLoading, setFavoriteLoading] = useState({});
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      let data = [];
      if (type === "user") data = await recommendForUser();
      if (type === "recipe") data = await recommendForRecipe(id);
      setRecipes(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Không tải được dữ liệu gợi ý");
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [type, id]);

  const handleFavorite = async (recipeId) => {
    setFavoriteLoading((prev) => ({ ...prev, [recipeId]: true }));
    try {
      await addFavorite(recipeId);
      await fetchData();
    } catch {
      toast.error("Lỗi khi thêm vào yêu thích");
    } finally {
      setFavoriteLoading((prev) => ({ ...prev, [recipeId]: false }));
    }
  };

  if (loading) return <div className="rec-loading">Đang tải...</div>;
  if (!recipes.length) return null;

  const PrevArrow = ({ onClick }) => (
    <button className="slick-arrow custom-prev" onClick={onClick}>
      <FaChevronLeft />
    </button>
  );

  const NextArrow = ({ onClick }) => (
    <button className="slick-arrow custom-next" onClick={onClick}>
      <FaChevronRight />
    </button>
  );

  const settings = {
    dots: false,
    infinite: recipes.length > 4,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      { breakpoint: 900, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="recommendation-root">
      <div className="rec-header">
        <h3>{title}</h3>
      </div>

      <Slider {...settings}>
        {recipes.map((r) => (
          <div key={r.id} className="rec-card">
            <Card
              hoverable
              cover={
                <img
                  src={r.imgUrl || "https://via.placeholder.com/300x180?text=No+Image"}
                  alt={r.title}
                  onClick={() => navigate(`/recipes/${r.id}`)}
                />
              }
              className="recipe-card"
            >
              <Card.Meta
                avatar={
                  r.authorAvtUrl ? (
                    <Avatar src={r.authorAvtUrl} />
                  ) : (
                    <Avatar style={{ backgroundColor: "#f56a00" }}>
                      {r.authorFullName?.charAt(0).toUpperCase()}
                    </Avatar>
                  )
                }
                title={r.authorFullName}
                description={r.title}
                onClick={() => navigate(`/user/${r.authorUsername}`)}
                style={{ cursor: "pointer" }}
              />

              <div className="rec-meta">
                {typeof r.averageRating === "number" && (
                  <span>
                    <Rate allowHalf disabled value={r.averageRating} style={{ fontSize: 18 }} />
                    {r.totalReview}
                  </span>
                )}
                <span className="rec-fav">
                  <Button
                    type="text"
                    shape="circle"
                    onClick={() => handleFavorite(r.id)}
                    disabled={favoriteLoading[r.id]}
                    icon={
                      <FaHeart
                        style={{ color: r.isFavorite ? "red" : "gray", fontSize: 18 }}
                      />
                    }
                  />
                  <span>{r.totalFavorite}</span>
                </span>
              </div>

              <Button
                type="primary"
                block
                style={{ borderRadius: 8, fontWeight: 600 }}
                onClick={() => navigate(`/recipes/${r.id}`)}
              >
                Chi tiết
              </Button>
            </Card>
          </div>
        ))}
      </Slider>
    </div>
  );
}

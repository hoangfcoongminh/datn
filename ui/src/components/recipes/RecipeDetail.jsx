import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./RecipeDetail.css";
import {
  FaClock,
  FaUsers,
  FaHeart,
  FaRegHeart,
  FaArrowLeft,
  FaEye
} from "react-icons/fa";
import { MdOutlineFavorite } from "react-icons/md";
import { getRecipeDetail } from "../../api/recipe";
import { fetchIngredients } from "../../api/ingredient";
import { fetchUnits } from "../../api/unit";
import { Button, Image } from "antd";
import Review from "../common/review/Review";
import Recommendation from "../common/recommendation/Recommendation";
import { addFavorite } from "../../api/user";
import ChatLauncher from "../common/chatbot/ChatLauncher";
import moment from 'moment';
import ScrollToTopButton from "../common/ScrollToTopButton";
import Role from "../../enums/role";

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // Tách hàm fetchDetail để có thể gọi lại khi cần
  const fetchDetail = async () => {
    setError(null);
    try {
      const [recipeData, ingredientList, unitList] = await Promise.all([
        getRecipeDetail(id),
        fetchIngredients(),
        fetchUnits(),
      ]);
      setRecipe(recipeData.data);
      setIngredients(ingredientList.data);
      setUnits(unitList.data);
    } catch (err) {
      setError(err.message || "Lỗi khi tải chi tiết công thức.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchDetail();
  }, [id]);

  const getIngredientName = (ingredientId) => {
    const ing = ingredients.find((i) => i.id === ingredientId);
    return ing ? ing.name : `#${ingredientId}`;
  };
  const getUnitName = (unitId) => {
    const unit = units.find((u) => u.id === unitId);
    return unit ? unit.name : `#${unitId}`;
  };

  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const handleAddFavorite = async (recipeId) => {
    if (user === null) navigate("/login");
    if (!recipe) return;
    setFavoriteLoading(true);
    try {
      await addFavorite(recipeId);
    } finally {
      setFavoriteLoading(false);
      fetchDetail();
    }
  };

  const isAuthor =
    user && recipe && recipe.authorUsername === user.user.username;

  if (error) {
    return (
      <div className="recipe-detail-container">
        <div className="error-state">{error}</div>
      </div>
    );
  }
  if (!recipe) return null;

  return (
    <div className="recipe-detail-container">
      <div className="recipe-detail-content">
        <Link to="/recipes" className="back-button" onClick={() => navigate(-1)}>
          <FaArrowLeft />
          Quay lại
        </Link>

        <div className="recipe-header">
          <div className="recipe-image-section">
            {showVideo && recipe.videoUrl ? (
              <video
                style={{
                  borderRadius: 8,
                  width: "100%",
                  maxWidth: 480,
                }}
                controls
                autoPlay
                src={recipe.videoUrl}
                className="recipe-main-video"
                title="Recipe Video"
              >
                Trình duyệt của bạn không hỗ trợ video.
              </video>
            ) : (
              <Image
                style={{ borderRadius: 8 }}
                src={
                  recipe.imgUrl ||
                  "https://via.placeholder.com/400x250?text=No+Image"
                }
                alt={recipe.title}
                className="recipe-main-image"
              />
            )}
          </div>

          <div
            className="recipe-info"
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Button
                className="like-button-large"
                onClick={() => handleAddFavorite(id)}
                loading={favoriteLoading}
                style={{
                  background: "none",
                  border: "none",
                  boxShadow: "none",
                  paddingRight: 50,
                  paddingBottom: 20,
                  fontSize: 32,
                  color: recipe.isFavorite ? "#e74c3c" : "#888",
                  cursor: "pointer",
                }}
                icon={recipe.isFavorite ? <FaHeart /> : <FaRegHeart />}
              />
            </div>
            <p style={{ color: 'grey', fontSize: '14px', fontStyle: 'italic'}}>Ngày đăng: {moment(recipe.createdAt, "HH:mm:ss DD-MM-YYYY").format('DD/MM/YYYY') || ''}</p>
            <h1 className="recipe-title">{recipe.title}</h1>
            {recipe.authorUsername && (
              <div className="rec-author" onClick={() => navigate(`/user/${recipe.authorUsername}`)}>
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
            <p className="recipe-description">{recipe.description}</p>
            <div
              className="recipe-stats"
              style={{
                display: "grid",
                gridTemplateColuGmns: "1fr 1fr",
                gap: 16,
              }}
            >
              <div className="stat-item">
                <FaClock />
                <span>Chuẩn bị: {Number(recipe.prepTime).toFixed(2)} giờ</span>
              </div>
              <div className="stat-item">
                <FaClock />
                <span>Nấu: {Number(recipe.cookTime).toFixed(2)} giờ</span>
              </div>
              <div className="stat-item">
                <FaUsers />
                <span>Khẩu phần: {recipe.servings}</span>
              </div>
              <div className="stat-item">
                <MdOutlineFavorite />
                <span>Số lượt thích: {recipe.totalFavorite}</span>
              </div>
              <div className="stat-item">
                <FaEye />
                <span>Số lượt xem: {recipe.viewCount}</span>
              </div>
            </div>
            {/* {(recipe.videoUrl || isAuthor) && ( */}
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  marginTop: 16,
                  alignItems: "center",
                }}
              >
                {recipe.videoUrl && (
                  <Button
                    type="primary"
                    style={{
                      background: "#a50034",
                      borderColor: "#a50034",
                      borderRadius: 8,
                      fontWeight: 600,
                      width: "fit-content",
                    }}
                    onClick={() => setShowVideo((v) => !v)}
                  >
                    {showVideo ? "Ẩn video hướng dẫn" : "Xem video hướng dẫn"}
                  </Button>
                )}
                {(isAuthor || user.user.role === Role.ADMIN) && (
                  <Button
                    type="primary"
                    style={{
                      background: "#a50034",
                      borderColor: "#a50034",
                      borderRadius: 8,
                      fontWeight: 600,
                      width: "fit-content",
                    }}
                    onClick={() => navigate(`/recipes/edit/${id}`)}
                  >
                    Sửa công thức
                  </Button>
                )}
              </div>
            {/* )} */}
          </div>
        </div>

        <div className="recipe-content-grid">
          <div className="ingredients-section">
            <h2>Nguyên liệu</h2>
            <ul className="ingredients-list">
              {(recipe.recipeIngredients || []).map((item, idx) => (
                <li key={item.id || idx}>
                  {getIngredientName(item.ingredientId)}: {item.quantity}{" "}
                  {getUnitName(item.actualUnitId)}
                </li>
              ))}
            </ul>
          </div>

          <div className="instructions-section">
            <h2>Cách làm</h2>
            <ol className="instructions-list">
              {(recipe.recipeSteps || [])
                .sort((a, b) => a.stepNumber - b.stepNumber)
                .map((step, idx) => (
                  <li key={step.id || idx}>
                    <span className="step-number">{step.stepNumber}</span>
                    <span className="step-text">{step.stepInstruction}</span>
                  </li>
                ))}
            </ol>
          </div>
        </div>
      </div>

      {/* Review section */}
      <div style={{ marginTop: 48 }}>
        <Review
          recipeId={id}
          user={user?.user}
          allowPost={!!user}
          averageRating={recipe.averageRating}
          totalReview={recipe.totalReview}
          onReviewChange={fetchDetail}
        />
      </div>
      <div style={{ marginTop: 48 }}>
        <Recommendation
          type={"recipe"}
          id={id}
          title={"Các công thức liên quan"}
          apiParams
        />
      </div>
      <ScrollToTopButton />
      <ChatLauncher />
    </div>
  );
};

export default RecipeDetail;

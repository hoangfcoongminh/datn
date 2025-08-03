import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './RecipeDetail.css';
import { FaClock, FaUsers, FaStar, FaHeart, FaArrowLeft, FaUtensils, FaFire } from 'react-icons/fa';
import { getRecipeDetail } from '../../api/recipe';
import { fetchIngredients } from '../../api/ingredient';
import { fetchUnits } from '../../api/unit';
import { Button } from 'antd';

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [recipeData, ingredientList, unitList] = await Promise.all([
          getRecipeDetail(id),
          fetchIngredients(),
          fetchUnits()
        ]);
        setRecipe(recipeData);
        setIngredients(ingredientList);
        setUnits(unitList);
      } catch (err) {
        setError(err.message || 'Lỗi khi tải chi tiết công thức.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const getIngredientName = (ingredientId) => {
    const ing = ingredients.find(i => i.id === ingredientId);
    return ing ? ing.name : `#${ingredientId}`;
  };
  const getUnitName = (unitId) => {
    const unit = units.find(u => u.id === unitId);
    return unit ? unit.name : `#${unitId}`;
  };

  const user = JSON.parse(localStorage.getItem('user'));
  const isAuthor = user && recipe && recipe.authorUsername === user.user.username;

  if (loading) {
    return <div className="recipe-detail-container"><div className="loading-state">Đang tải chi tiết công thức...</div></div>;
  }
  if (error) {
    return <div className="recipe-detail-container"><div className="error-state">{error}</div></div>;
  }
  if (!recipe) return null;

  return (
    <div className="recipe-detail-container">
      <div className="recipe-detail-content">
        <Link to="/recipes" className="back-button">
          <FaArrowLeft />
          Quay lại danh sách
        </Link>

        <div className="recipe-header">
          <div className="recipe-image-section">
            <img src={recipe.imgUrl || 'https://via.placeholder.com/400x250?text=No+Image'} alt={recipe.title} className="recipe-main-image" />
            <button className="like-button-large">
              <FaHeart />
            </button>
          </div>

          <div className="recipe-info">
            <h1 className="recipe-title">{recipe.title}</h1>
            <p className="recipe-description">{recipe.description}</p>

            <div className="recipe-stats">
              <div className="stat-item">
                <FaClock />
                <span>Thời gian: {(Number(recipe.prepTime) + Number(recipe.cookTime)).toFixed(2)} giờ</span>
              </div>
              <div className="stat-item">
                <FaUsers />
                <span>{recipe.servings} người</span>
              </div>
            </div>
            {isAuthor && (
              <Button type="primary" 
              style={{ background: '#a50034', borderColor: '#a50034', borderRadius: 8, fontWeight: 600, width: 'fit-content', marginTop: 16 }}
              onClick={() => navigate(`/recipes/edit/${id}`)}>
                Sửa công thức
              </Button>
            )}
          </div>
        </div>

        <div className="recipe-content-grid">
          <div className="ingredients-section">
            <h2>Nguyên liệu</h2>
            <ul className="ingredients-list">
              {(recipe.recipeIngredients || []).map((item, idx) => (
                <li key={item.id || idx}>
                  {getIngredientName(item.ingredientId)}: {item.quantity} {getUnitName(item.actualUnitId)}
                </li>
              ))}
            </ul>
          </div>

          <div className="instructions-section">
            <h2>Cách làm</h2>
            <ol className="instructions-list">
              {(recipe.recipeSteps || []).sort((a, b) => a.stepNumber - b.stepNumber).map((step, idx) => (
                <li key={step.id || idx}>
                  <span className="step-number">{step.stepNumber}</span>
                  <span className="step-text">{step.stepInstruction}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;

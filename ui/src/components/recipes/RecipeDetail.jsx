import React from 'react';
import { useParams, Link } from 'react-router-dom';
import './RecipeDetail.css';
import { FaClock, FaUsers, FaStar, FaHeart, FaArrowLeft, FaUtensils, FaFire } from 'react-icons/fa';

const RecipeDetail = () => {
  const { id } = useParams();

  // Mock data for demonstration
  const recipe = {
    id: id,
    title: "Phở Bò Việt Nam",
    description: "Món phở truyền thống với nước dùng đậm đà và thịt bò tươi ngon, một món ăn đặc trưng của ẩm thực Việt Nam.",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    time: "45 phút",
    servings: "4 người",
    rating: 4.8,
    difficulty: "Trung bình",
    likes: 1250,
    calories: "450 kcal",
    ingredients: [
      "500g bánh phở",
      "300g thịt bò tái",
      "200g thịt bò chín",
      "2 lít nước dùng bò",
      "Hành lá, ngò gai",
      "Giá đỗ",
      "Chanh, ớt",
      "Nước mắm, tiêu"
    ],
    instructions: [
      "Chuẩn bị nước dùng bò đậm đà",
      "Luộc bánh phở theo hướng dẫn",
      "Thái thịt bò mỏng vừa ăn",
      "Trụng thịt bò trong nước dùng",
      "Sắp xếp bánh phở, thịt bò và rau",
      "Rưới nước dùng nóng lên trên",
      "Thêm hành lá, ngò gai và gia vị",
      "Thưởng thức nóng với chanh, ớt"
    ]
  };

  return (
    <div className="recipe-detail-container">
      <div className="recipe-detail-content">
        <Link to="/recipes" className="back-button">
          <FaArrowLeft />
          Quay lại danh sách
        </Link>

        <div className="recipe-header">
          <div className="recipe-image-section">
            <img src={recipe.image} alt={recipe.title} className="recipe-main-image" />
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
                <span>{recipe.time}</span>
              </div>
              <div className="stat-item">
                <FaUsers />
                <span>{recipe.servings}</span>
              </div>
              <div className="stat-item">
                <FaStar />
                <span>{recipe.rating}</span>
              </div>
              <div className="stat-item">
                <FaUtensils />
                <span>{recipe.difficulty}</span>
              </div>
              <div className="stat-item">
                <FaFire />
                <span>{recipe.calories}</span>
              </div>
            </div>

            <div className="recipe-actions">
              <button className="action-button primary">
                <FaHeart />
                Thích ({recipe.likes})
              </button>
              <button className="action-button secondary">
                Chia sẻ
              </button>
            </div>
          </div>
        </div>

        <div className="recipe-content-grid">
          <div className="ingredients-section">
            <h2>Nguyên liệu</h2>
            <ul className="ingredients-list">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>

          <div className="instructions-section">
            <h2>Cách làm</h2>
            <ol className="instructions-list">
              {recipe.instructions.map((instruction, index) => (
                <li key={index}>
                  <span className="step-number">{index + 1}</span>
                  <span className="step-text">{instruction}</span>
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

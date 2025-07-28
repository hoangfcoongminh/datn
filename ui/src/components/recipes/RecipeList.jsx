import React from 'react';
import { Link } from 'react-router-dom';
import './RecipeList.css';
import { FaUtensils, FaClock, FaStar, FaHeart } from 'react-icons/fa';

const RecipeList = () => {
  // Mock data for demonstration
  const recipes = [
    {
      id: 1,
      title: "Phở Bò Việt Nam",
      description: "Món phở truyền thống với nước dùng đậm đà và thịt bò tươi ngon",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      time: "45 phút",
      rating: 4.8,
      difficulty: "Trung bình",
      likes: 1250
    },
    {
      id: 2,
      title: "Bún Chả Hà Nội",
      description: "Bún chả truyền thống với thịt nướng thơm lừng và nước mắm đặc biệt",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      time: "30 phút",
      rating: 4.6,
      difficulty: "Dễ",
      likes: 980
    },
    {
      id: 3,
      title: "Cơm Tấm Sài Gòn",
      description: "Cơm tấm với sườn nướng, chả trứng và các món ăn kèm hấp dẫn",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      time: "60 phút",
      rating: 4.7,
      difficulty: "Khó",
      likes: 1560
    }
  ];

  return (
    <div className="recipe-list-container">
      <div className="recipe-list-header">
        <h1>Danh sách công thức</h1>
        <p>Khám phá hàng nghìn công thức nấu ăn ngon từ cộng đồng CookCraft</p>
      </div>
      
      <div className="recipe-grid">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="recipe-card">
            <div className="recipe-image">
              <img src={recipe.image} alt={recipe.title} />
              <div className="recipe-overlay">
                <button className="like-button">
                  <FaHeart />
                </button>
              </div>
            </div>
            
            <div className="recipe-content">
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
              
              <div className="recipe-footer">
                <span className="likes-count">{recipe.likes} lượt thích</span>
                <Link to={`/recipes/${recipe.id}`} className="view-recipe-btn">
                  Xem công thức
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeList;

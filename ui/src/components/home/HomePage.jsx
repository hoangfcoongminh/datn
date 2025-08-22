import React, { useState, useEffect } from 'react';
import './HomePage.css';
import { 
  FaUtensils, 
  FaSearch, 
  FaHeart, 
  FaUsers, 
  FaStar, 
  FaArrowRight,
  FaPlay,
  FaChevronRight,
  FaChevronLeft,
  FaClock,
  FaFire,
  FaThumbsUp
} from 'react-icons/fa';
import { Navigate, useNavigate } from 'react-router-dom';

import ChatLauncher from "../common/chatbot/ChatLauncher";
const HomePage = ({ user, onLoginClick, onSignupClick, onLogout }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  const heroSlides = [
    {
      title: "Chia sẻ đam mê",
      subtitle: "Cộng đồng nấu ăn",
      description: "Kết nối với những người yêu thích nấu ăn, chia sẻ công thức và kinh nghiệm của bạn.",
      image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      title: "Khám phá ẩm thực",
      subtitle: "Thế giới món ăn",
      description: "Hàng nghìn công thức nấu ăn từ các đầu bếp chuyên nghiệp và cộng đồng yêu thích ẩm thực.",
      image: "https://images.unsplash.com/photo-1506368249639-73a05d6f6488?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      title: "Chia sẻ đam mê",
      subtitle: "Cộng đồng nấu ăn",
      description: "Kết nối với những người yêu thích nấu ăn, chia sẻ công thức và kinh nghiệm của bạn.",
      image: "https://images.unsplash.com/photo-1528712306091-ed0763094c98?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      title: "Học hỏi mỗi ngày",
      subtitle: "Kỹ năng nấu ăn",
      description: "Từ những món ăn đơn giản đến phức tạp, nâng cao kỹ năng nấu ăn của bạn.",
      image: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }
  ];

  const features = [
    {
      icon: <FaSearch />,
      title: "Tìm kiếm thông minh",
      description: "Tìm công thức nấu ăn theo nguyên liệu, thời gian, độ khó và nhiều tiêu chí khác.",
      color: "#a50034"
    },
    {
      icon: <FaHeart />,
      title: "Lưu trữ yêu thích",
      description: "Lưu lại những công thức bạn yêu thích để dễ dàng truy cập sau này.",
      color: "#d32f2f"
    },
    {
      icon: <FaUsers />,
      title: "Cộng đồng sôi động",
      description: "Tham gia cộng đồng nấu ăn, chia sẻ và nhận phản hồi từ mọi người.",
      color: "#1976d2"
    },
    {
      icon: <FaStar />,
      title: "Đánh giá chất lượng",
      description: "Hệ thống đánh giá và bình luận giúp bạn chọn lựa công thức tốt nhất.",
      color: "#f57c00"
    },
    {
      icon: <FaClock />,
      title: "Thời gian nấu",
      description: "Biết chính xác thời gian cần thiết để chuẩn bị và nấu món ăn.",
      color: "#388e3c"
    },
    {
      icon: <FaFire />,
      title: "Độ khó phù hợp",
      description: "Từ người mới bắt đầu đến chuyên gia, có công thức phù hợp với mọi cấp độ.",
      color: "#7b1fa2"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Công thức", icon: <FaUtensils /> },
    { number: "50,000+", label: "Thành viên", icon: <FaUsers /> },
    { number: "100,000+", label: "Đánh giá", icon: <FaStar /> },
    { number: "1,000+", label: "Đầu bếp", icon: <FaThumbsUp /> }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-left">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title animate-in">
                {heroSlides[currentSlide].title}
              </h1>
              <h2 className="hero-subtitle animate-in">
                {heroSlides[currentSlide].subtitle}
              </h2>
              <p className="hero-description animate-in">
                {heroSlides[currentSlide].description}
              </p>
            </div>
            
            <div className="hero-actions animate-in">
              {user ? (
                <div className="user-welcome">
                  <div className="welcome-message">
                    <span className="welcome-icon">👋</span>
                    Chào mừng trở lại, {user.username}!
                  </div>
                  <button className="cta-button primary" onClick={() => navigate('/recipes')}>
                    Khám phá công thức
                    <FaArrowRight />
                  </button>
                </div>
              ) : (
                <div className="auth-buttons">
                  <button className="cta-button primary" onClick={onLoginClick}>
                    Đăng nhập
                    <FaArrowRight />
                  </button>
                  <button className="cta-button secondary" onClick={onSignupClick}>
                    Đăng ký
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="hero-navigation">
            <button className="nav-button" onClick={prevSlide}>
              <FaChevronLeft />
            </button>
            <div className="hero-indicators">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  className={`indicator ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
            <button className="nav-button" onClick={nextSlide}>
              <FaChevronRight />
            </button>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-background">
            {heroSlides.map((slide, index) => (
              <div
                key={index}
                className={`slide ${index === currentSlide ? 'active' : ''}`}
                style={{ backgroundImage: `url(${slide.image})` }}
              />
            ))}
            <div className="hero-overlay" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stats-header">
            <h2>CookCraft trong số liệu</h2>
            <p>Nền tảng nấu ăn hàng đầu với cộng đồng sôi động</p>
          </div>
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <div className="section-header">
            <h2>Tính năng nổi bật</h2>
            <p>Khám phá những gì làm nên sự khác biệt của CookCraft</p>
          </div>
          <div className="features-masonry">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="feature-card"
                style={{ '--accent-color': feature.color }}
              >
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <div className="feature-decoration" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <div className="cta-badge">
              <FaPlay />
              Bắt đầu ngay
            </div>
            <h2>Sẵn sàng khám phá thế giới ẩm thực?</h2>
            <p>Tham gia cộng đồng CookCraft ngay hôm nay và bắt đầu hành trình nấu ăn của bạn</p>
            <div className="cta-features">
              <span>✓ Hoàn toàn miễn phí</span>
              <span>✓ Dễ dàng sử dụng</span>
              <span>✓ Cộng đồng thân thiện</span>
            </div>
            {!user && (
              <div className="cta-buttons">
                <button className="cta-button primary" onClick={onSignupClick}>
                  Đăng ký miễn phí
                  <FaArrowRight />
                </button>
                <button className="cta-button secondary" onClick={onLoginClick}>
                  Đăng nhập
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <ChatLauncher />
    </div>
  );
};

export default HomePage;

import React, { useEffect, useMemo, useReducer, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getUserPublicProfile } from "../../api/user";
import { FaArrowLeft } from "react-icons/fa";
import { filterRecipes } from "../../api/recipe";
import { Button, Spin, Rate, Pagination } from "antd";
import { HeartOutlined, EditOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";
import "./UserProfile.css";
import ScrollToTopButton from "../common/ScrollToTopButton";
import ChatLauncher from "../common/chatbot/ChatLauncher";

export default function UserProfile() {
  const { username } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(12);
  const [averageRatingOfUser, setAverageRatingOfUser] = useState(0);
  const pageSizeOptions = [6, 12, 20, 30];
  const background = ['background1.jpg', 'background2.jpg', 'background3.jpg', 'background4.jpg']
  const randomBg = 'http://localhost:9000/images/' + background[Math.floor(Math.random() * background.length)];

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setProfileLoading(true);
        const data = await getUserPublicProfile(username);
        if (!mounted) return;
        setUser(data.data || null);
      } catch {
        setUser(null);
      } finally {
        setProfileLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [username]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await filterRecipes({
          authorUsernames: [username],
          page,
          size,
          sort: "id,desc",
        });
        if (!mounted) return;
        setRecipes(data?.data || []);
        setTotal(data?.total || 0);
      } catch {
        setRecipes([]);
        setTotal(0);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [username, page, size]);

  const currentUser = JSON.parse(localStorage.getItem("user"))?.user;
  const isOwnProfile = currentUser?.username === username;

  const displayName = useMemo(
    () => user?.fullName || user?.username || username,
    [user, username]
  );

  return (
    <div className="user-profile-page">
      <Link to="/recipes" className="back-button" onClick={() => navigate(-1)}>
        <FaArrowLeft />
        Quay lại
      </Link>
      {/* Hero Section */}
      <div
        className="user-hero"
        style={{
          backgroundImage: `url(${randomBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {profileLoading ? (
          <div className="center-row">
            <Spin size="large" />
          </div>
        ) : user ? (
          <div className="user-hero-inner">
            <div className="user-avatar-container">
              <div className="user-avatar">
                {user.imgUrl ? (
                  <img src={user.imgUrl} alt={displayName} />
                ) : (
                  <div className="avatar-fallback">
                    {(displayName || "U").charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="user-name">{displayName}</div>
              {isOwnProfile && (
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => navigate(`/profile/edit`)}
                  style={{ marginTop: '10px' }}
                >
                  Sửa trang cá nhân
                </Button>
              )}
            </div>
            <div className="user-details">
              <div className="user-info-card">
                <div className="user-stats">
                  <div className="stat-item">
                    <strong>{total || 0}</strong>
                    <span>Công thức</span>
                  </div>
                  <div className="stat-item">
                    <strong>{user.totalReviewForUser || 0}</strong>
                    <span>Đánh giá</span>
                  </div>
                  <div className="stat-item">
                    <strong>{user.totalFavoriteForUser || 0}</strong>
                    <span>Lượt thích</span>
                  </div>
                </div>
                <div className="user-rating">
                  <strong>Đánh giá trung bình: </strong>
                  <Rate
                    allowHalf
                    disabled
                    value={user.averageRating || 0}
                    style={{
                      color: "#faad14",
                      fontSize: 20,
                      marginLeft: 8,
                      marginRight: 8,
                    }}
                  />{" "}
                  {(user.averageRating || 0).toFixed(1)}
                </div>
                {user.description && (
                  <div className="user-bio">
                    <h3>Giới thiệu</h3>
                    <p>{user.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="center-row">
            <p>Không tìm thấy người dùng</p>
          </div>
        )}
      </div>

      {/* Recipes Section */}
      <div className="user-recipes">
        <div className="section-header">
          <h2>Công thức của {displayName}</h2>
        </div>

        <div className="recipes-grid">
          {recipes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🍽️</div>
              <h3>Chưa có công thức</h3>
              <p>Người dùng này chưa đăng công thức nào.</p>
            </div>
          ) : (
            recipes.map((recipe) => (
              <div
                key={recipe.id}
                className="recipe-card"
                onClick={() => navigate(`/recipes/${recipe.id}`)}
              >
                <div className="card-image">
                  <img
                    src={
                      recipe.imgUrl ||
                      "https://via.placeholder.com/400x250?text=No+Image"
                    }
                    alt={recipe.title}
                  />
                </div>
                <div className="card-content">
                  <h3 className="recipe-title">{recipe.title}</h3>
                  <div className="recipe-meta">
                    <div className="meta-item">
                      <Rate
                        allowHalf
                        disabled
                        value={recipe.averageRating || 0}
                        style={{ fontSize: 16, color: "#faad14" }}
                      />
                      <span className="meta-note">
                        {recipe.totalReview || 0} đánh giá
                      </span>
                    </div>
                    <div className="meta-item">
                      <HeartOutlined
                        style={{
                          fontSize: 16,
                          color: "#f43f5e",
                          marginRight: 4,
                        }}
                      />
                      <span className="likes-count">
                        {recipe.totalFavorite || 0} thích
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pagination-row">
          <Pagination
            current={page + 1}
            pageSize={size}
            total={total}
            showSizeChanger
            pageSizeOptions={pageSizeOptions.map(String)}
            onChange={(p, ps) => {
              setPage(p - 1);
              setSize(ps);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </div>
      </div>
      <ScrollToTopButton />
      <ChatLauncher />
    </div>
  );
}

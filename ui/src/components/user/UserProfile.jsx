import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserPublicProfile } from "../../api/user";
import { filterRecipes } from "../../api/recipe";
import { Button, Spin, Rate, Pagination } from "antd";
import "antd/dist/reset.css";
import "./UserProfile.css";

export default function UserProfile() {
  const { username } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(12);
  const pageSizeOptions = [6, 12, 20, 30];

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setProfileLoading(true);
        const data = await getUserPublicProfile(username);
        if (!mounted) return;
        setUser(data || null);
      } catch (err) {
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
          keyword: undefined,
          categoryIds: undefined,
          ingredientIds: undefined,
          authorUsernames: [username],
          page,
          size,
          sort: "id,desc",
        });
        if (!mounted) return;
        setRecipes(data?.content || []);
        setTotal(data?.total || 0);
      } catch (err) {
        setRecipes([]);
        setTotal(0);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [username, page, size]);

  const displayName = useMemo(() => user?.fullName || user?.username || username, [user, username]);

  return (
    <div className="user-profile-page">
      {/* Header */}
      <div className="user-hero">
        {profileLoading ? (
          <div className="center-row" style={{ minHeight: 160 }}>
            <Spin size="large" />
          </div>
        ) : user ? (
          <div className="user-hero-inner">
            <div className="user-avatar">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={displayName} />
              ) : (
                <div className="avatar-fallback">{(displayName || "U").charAt(0).toUpperCase()}</div>
              )}
            </div>
            <div className="user-info">
              <h1>{displayName}</h1>
              {user.bio && <p className="user-bio">{user.bio}</p>}
              <div className="user-stats">
                {typeof user.totalRecipe === "number" && (
                  <span><strong>{user.totalRecipe}</strong> công thức</span>
                )}
                {typeof user.totalFollower === "number" && (
                  <span><strong>{user.totalFollower}</strong> người theo dõi</span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="center-row" style={{ minHeight: 160 }}>
            Không tìm thấy người dùng
          </div>
        )}
      </div>

      {/* Recipes */}
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
              <div key={recipe.id} className="recipe-card" onClick={() => navigate(`/recipes/${recipe.id}`)}>
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
                      <Rate allowHalf disabled value={recipe.averageRating || 0} style={{ fontSize: 18, color: "#faad14" }} />
                      <span className="meta-note">{recipe.totalReview} đánh giá</span>
                    </div>
                    <div className="meta-item" style={{ marginLeft: "auto" }}>
                      <span className="likes-count">{recipe.totalFavorite} thích</span>
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
    </div>
  );
} 
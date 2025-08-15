// import React, { useEffect, useMemo, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { getUserPublicProfile } from "../../api/user";
// import { filterRecipes } from "../../api/recipe";
// import { Button, Spin, Rate, Pagination } from "antd";
// import "antd/dist/reset.css";
// import "./UserProfile.css";

// export default function UserProfile() {
//   const { username } = useParams();
//   const navigate = useNavigate();

//   const [user, setUser] = useState(null);
//   const [profileLoading, setProfileLoading] = useState(true);
//   const [recipes, setRecipes] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [page, setPage] = useState(0);
//   const [size, setSize] = useState(12);
//   const pageSizeOptions = [6, 12, 20, 30];

//   useEffect(() => {
//     let mounted = true;
//     (async () => {
//       try {
//         setProfileLoading(true);
//         const data = await getUserPublicProfile(username);
//         if (!mounted) return;
//         setUser(data || null);
//       } catch {
//         setUser(null);
//       } finally {
//         setProfileLoading(false);
//       }
//     })();
//     return () => {
//       mounted = false;
//     };
//   }, [username]);

//   useEffect(() => {
//     let mounted = true;
//     (async () => {
//       try {
//         const data = await filterRecipes({
//           authorUsernames: [username],
//           page,
//           size,
//           sort: "id,desc",
//         });
//         if (!mounted) return;
//         setRecipes(data?.content || []);
//         setTotal(data?.total || 0);
//       } catch {
//         setRecipes([]);
//         setTotal(0);
//       }
//     })();
//     return () => {
//       mounted = false;
//     };
//   }, [username, page, size]);

//   const displayName = useMemo(
//     () => user?.fullName || user?.username || username,
//     [user, username]
//   );

//   return (
//     <div className="user-profile-page">
//       {/* Header */}
//       <div className="user-hero">
//         {profileLoading ? (
//           <div className="center-row" style={{ minHeight: 160 }}>
//             <Spin size="large" />
//           </div>
//         ) : user ? (
//           <div className="user-hero-inner">
//             <div className="user-avatar">
//               {user.imgUrl ? (
//                 <img src={user.imgUrl} alt={displayName} />
//               ) : (
//                 <div className="avatar-fallback">
//                   {(displayName || "U").charAt(0).toUpperCase()}
//                 </div>
//               )}
//             </div>

//             <div className="user-info">
//               <h1 className="user-name">{displayName}</h1>

//               {/* User rating */}
//               {/* {typeof user.averageRating === "number" && ( */}
//                 <div className="user-rating">
//                   <Rate
//                     allowHalf
//                     disabled
//                     value={5}
//                     // value={user.averageRating}
//                     style={{ color: "#faad14", fontSize: 20 }}
//                   />
//                   <span className="rating-count">
//                     {user.totalRating || 0} lượt đánh giá
//                   </span>
//                 </div>
//               {/* )} */}

//               {/* Bio */}
              
//               {user.description && (
//                 <>
//                 <div style={{ marginTop: 10, marginBottom: 10}}>
//                 <span>Giới thiệu</span>
//                 </div>
//                 <div className="user-bio"><p>{user.description}</p></div>
//                 </>
//                 )}

//               {/* Stats */}
//               <div className="user-stats">
//                 {typeof user.totalRecipe === "number" && (
//                   <span>
//                     <strong>{user.totalRecipe}</strong> công thức
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div className="center-row" style={{ minHeight: 160 }}>
//             Không tìm thấy người dùng
//           </div>
//         )}
//       </div>

//       {/* Recipes */}
//       <div className="user-recipes">
//         <div className="section-header">
//           <h2>Công thức của {displayName}</h2>
//         </div>

//         <div className="recipes-grid">
//           {recipes.length === 0 ? (
//             <div className="empty-state">
//               <div className="empty-icon">🍽️</div>
//               <h3>Chưa có công thức</h3>
//               <p>Người dùng này chưa đăng công thức nào.</p>
//             </div>
//           ) : (
//             recipes.map((recipe) => (
//               <div
//                 key={recipe.id}
//                 className="recipe-card"
//                 onClick={() => navigate(`/recipes/${recipe.id}`)}
//               >
//                 <div className="card-image">
//                   <img
//                     src={
//                       recipe.imgUrl ||
//                       "https://via.placeholder.com/400x250?text=No+Image"
//                     }
//                     alt={recipe.title}
//                   />
//                 </div>
//                 <div className="card-content">
//                   <h3 className="recipe-title">{recipe.title}</h3>
//                   <div className="recipe-meta">
//                     <div className="meta-item">
//                       <Rate
//                         allowHalf
//                         disabled
//                         value={recipe.averageRating || 0}
//                         style={{ fontSize: 18, color: "#faad14" }}
//                       />
//                       <span className="meta-note">
//                         {recipe.totalReview} đánh giá
//                       </span>
//                     </div>
//                     <div className="meta-item" style={{ marginLeft: "auto" }}>
//                       <span className="likes-count">
//                         {recipe.totalFavorite} thích
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>

//         <div className="pagination-row">
//           <Pagination
//             current={page + 1}
//             pageSize={size}
//             total={total}
//             showSizeChanger
//             pageSizeOptions={pageSizeOptions.map(String)}
//             onChange={(p, ps) => {
//               setPage(p - 1);
//               setSize(ps);
//               window.scrollTo({ top: 0, behavior: "smooth" });
//             }}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserPublicProfile } from "../../api/user";
import { filterRecipes } from "../../api/recipe";
import { Button, Spin, Rate, Pagination } from "antd";
import { HeartOutlined } from "@ant-design/icons";
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
  const [averageRatingOfUser, setAverageRatingOfUser] = useState(0);
  const pageSizeOptions = [6, 12, 20, 30];

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setProfileLoading(true);
        const data = await getUserPublicProfile(username);
        if (!mounted) return;
        setUser(data || null);
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
        setRecipes(data?.content || []);
        setTotal(data?.total || 0);
        const totalAverageRating = data?.content?.reduce(
          (sum, recipe) => sum + (recipe.averageRating || 0),
          0
        ) || 0;
        setAverageRatingOfUser(
          data?.content?.length ? totalAverageRating / data.content.length : 0
        );
      } catch {
        setRecipes([]);
        setTotal(0);
        setAverageRatingOfUser(0);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [username, page, size]);

  const displayName = useMemo(
    () => user?.fullName || user?.username || username,
    [user, username]
  );

  return (
    <div className="user-profile-page">
      {/* Hero Section */}
      <div className="user-hero">
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
              <h1 className="user-name">{displayName}</h1>
            </div>
            <div className="user-details">
              <div className="user-info-card">
                <div className="user-stats">
                  <div className="stat-item">
                    <strong>{recipes.length || 0}</strong>
                    <span>Công thức</span>
                  </div>
                  <div className="stat-item">
                    <strong>{user.totalRating || 0}</strong>
                    <span>Đánh giá</span>
                  </div>
                </div>
                <div className="user-rating">
                  <Rate
                    allowHalf
                    disabled
                    value={averageRatingOfUser || 0}
                    style={{ color: "#faad14", fontSize: 18 }}
                  />
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
                        style={{ fontSize: 16, color: "#f43f5e", marginRight: 4 }}
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
    </div>
  );
}
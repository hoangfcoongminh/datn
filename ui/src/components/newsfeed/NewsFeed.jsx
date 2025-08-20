import React, { useEffect, useState } from "react";
import { List, Spin, Avatar, Button, Card, Pagination, Rate, Input, Select, Badge, Progress, Statistic, Row, Col } from "antd";
import { SearchOutlined, TrophyOutlined, FireOutlined, HeartOutlined, EyeOutlined, ClockCircleOutlined, UserOutlined, BookOutlined, StarOutlined } from "@ant-design/icons";
import Slider from "react-slick";
import ChatLauncher from "../common/chatbot/ChatLauncher";
import "./NewsFeed.css";
import { filterRecipes, getPopularRecipe } from "../../api/recipe";
import { getPopularUsers } from "../../api/user";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import TopUsersCarousel from "../common/rating/Rating";

const { Search } = Input;
const { Option } = Select;

export default function NewsFeed() {
  const PAGE_SIZE_OPTIONS = [6, 12, 24, 48];
  const [recipeList, setRecipeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popularByView, setPopularByView] = useState([]);
  const [popularByFavorite, setPopularByFavorite] = useState([]);
  const [favorite, setFavorite] = useState([]);
  const [topFavUsers, setTopFavUsers] = useState([]);
  const [topRatingUsers, setTopRatingUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [total, setTotal] = useState(10);
  const [sortField, setSortField] = useState("id,asc");
  const [keyword, setKeyword] = useState("");
  const [minTime, setMinTime] = useState("");
  const [maxTime, setMaxTime] = useState("");
  const [categoryIds, setCategoryIds] = useState([]);
  const [ingredientIds, setIngredientIds] = useState([]);
  const navigate = useNavigate();

  // Mock data for new sections
  const [weeklyStats, setWeeklyStats] = useState({
    totalRecipes: 1250,
    newRecipes: 45,
    totalUsers: 8924,
    activeUsers: 1847
  });

  const [trendingCategories] = useState([
    { name: "Món Việt", count: 245, growth: "+15%" },
    { name: "Dessert", count: 198, growth: "+22%" },
    { name: "Healthy", count: 167, growth: "+8%" },
    { name: "Quick Meals", count: 143, growth: "+31%" }
  ]);

  const [recentActivities] = useState([
    { user: "Minh Anh", action: "đã thêm công thức", recipe: "Bánh flan caramel", time: "2 phút trước", avatar: "/api/placeholder/32/32" },
    { user: "Thanh Hoa", action: "đã đánh giá", recipe: "Phở bò Hà Nội", time: "15 phút trước", avatar: "/api/placeholder/32/32", rating: 5 },
    { user: "Quang Minh", action: "đã yêu thích", recipe: "Bánh mì thịt nướng", time: "1 giờ trước", avatar: "/api/placeholder/32/32" },
    { user: "Thu Hà", action: "đã bình luận về", recipe: "Cơm tấm sườn nướng", time: "2 giờ trước", avatar: "/api/placeholder/32/32" }
  ]);

  const fetchRecipeList = async () => {
    try {
      const data = await filterRecipes({
        keyword,
        categoryIds,
        ingredientIds,
        minTime: minTime || undefined,
        maxTime: maxTime || undefined,
        page,
        size: size,
        sort: sortField,
      });
      setRecipeList(data.content || []);
      setTotal(data.total || 1);
    } catch (err) {
      toast.error(err.message || "Lỗi khi tải công thức");
    } finally {
      setLoading(false);
    }
  };

  const fetchPopularByFavorite = async () => {
    try {
      const data = await getPopularRecipe("favorite");
      setPopularByFavorite(data || []);
    } catch (err) {
      toast.error(err.message || "Lỗi khi tải công thức");
    } finally {
      setLoading(false);
    }
  };

  const fetchPopularByView = async () => {
    try {
      const data = await getPopularRecipe("view");
      setPopularByView(data || []);
    } catch (err) {
      toast.error(err.message || "Lỗi khi tải công thức");
    } finally {
      setLoading(false);
    }
  };

  const fetchPopularUsers = async () => {
    try {
      const data1 = await getPopularUsers("review");
      setTopRatingUsers(data1 || []);

      const data2 = await getPopularUsers("favorite");
      setTopFavUsers(data2 || []);
    } catch (err) {
      toast.error(err.message || "Lỗi khi tải công thức");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchRecipeList(),
          fetchPopularByFavorite(),
          fetchPopularByView(),
          fetchPopularUsers(),
        ]);
      } catch (err) {
        toast.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 4, slidesToScroll: 4 } },
      { breakpoint: 992, settings: { slidesToShow: 3, slidesToScroll: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  const handleCardClick = (id) => {
    navigate(`/recipes/${id}`);
  };

  const handleSearch = (value) => {
    setKeyword(value);
    setPage(0);
    fetchRecipeList();
  };

  return (
    <div className="newsfeed-root">
      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="hero-content">
          <h1 className="hero-title">Chào mừng đến với Cộng đồng Ẩm thực</h1>
          <p className="hero-subtitle">Khám phá hàng ngàn công thức từ những người đầu bếp tài năng</p>
        </div>
        <div className="hero-search-section">
          <Search
            placeholder="Tìm kiếm công thức yêu thích..."
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            className="hero-search"
          />
        </div>
        <div className="hero-stats">
          <Row gutter={16} justify="center">
            <Col span={6}>
              <Statistic title="Tổng công thức" value={weeklyStats.totalRecipes} prefix={<BookOutlined />} />
            </Col>
            <Col span={6}>
              <Statistic title="Công thức mới" value={weeklyStats.newRecipes} prefix={<FireOutlined />} />
            </Col>
            <Col span={6}>
              <Statistic title="Người dùng" value={weeklyStats.totalUsers} prefix={<UserOutlined />} />
            </Col>
            <Col span={6}>
              <Statistic title="Đang hoạt động" value={weeklyStats.activeUsers} prefix={<EyeOutlined />} />
            </Col>
          </Row>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3 className="section-title">
          <TrophyOutlined /> Thể loại thịnh hành
        </h3>
        <div className="trending-categories">
          {trendingCategories.map((category, index) => (
            <Card key={index} className="category-card" hoverable>
              <div className="category-info">
                <h4>{category.name}</h4>
                <p>{category.count} công thức</p>
                <Badge count={category.growth} style={{ backgroundColor: '#52c41a' }} />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="newsfeed-section">
        <h3 className="newsfeed-section-title">
          <ClockCircleOutlined /> Hoạt động gần đây
        </h3>
        <Card className="activity-card">
          <List
            itemLayout="horizontal"
            dataSource={recentActivities}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={item.avatar} />}
                  title={
                    <span>
                      <strong>{item.user}</strong> {item.action} <em>{item.recipe}</em>
                      {item.rating && (
                        <Rate disabled defaultValue={item.rating} style={{ marginLeft: 8, fontSize: 12 }} />
                      )}
                    </span>
                  }
                  description={item.time}
                />
              </List.Item>
            )}
          />
        </Card>
      </div>

      <h2 className="newsfeed-title">Khám phá công thức</h2>

      {/* Section: Danh sách công thức */}
      <div className="newsfeed-section">
        <h3 className="newsfeed-section-title">Danh sách công thức</h3>
        <div className="filter-bar">
          <Select
            placeholder="Sắp xếp theo"
            style={{ width: 200, marginRight: 16 }}
            onChange={(value) => setSortField(value)}
            value={sortField}
          >
            <Option value="id,asc">Mới nhất</Option>
            <Option value="totalFavorite,desc">Phổ biến nhất</Option>
            <Option value="averageRating,desc">Đánh giá cao nhất</Option>
          </Select>
        </div>
        <div className="recipes-grid">
          {recipeList.map((r) => (
            <div key={r.id} className="recipe-card">
              <div className="card-image">
                <img
                  src={r.imgUrl || "https://via.placeholder.com/400x250?text=No+Image"}
                  alt={r.title}
                />
                <div className="card-overlay">
                  <div
                    onClick={() => handleCardClick(r.id)}
                    className="view-button"
                  >
                    Xem chi tiết
                  </div>
                </div>
              </div>
              <div className="card-content">
                <div className="rec-author" onClick={() => navigate(`/user/${r.authorUsername}`)}>
                  {r.authorAvtUrl ? (
                    <img
                      src={r.authorAvtUrl}
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
                      {r.authorFullName?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  )}
                  {r.authorFullName || 'Unknown'}
                </div>
                <h3 className="recipe-title">{r.title}</h3>
                <p className="recipe-description">{r.description}</p>
                <div className="recipe-meta">
                  <div className="meta-item">
                    <Rate
                      allowHalf
                      disabled
                      value={r.averageRating || 0}
                      style={{ fontSize: 18, color: "#faad14" }}
                    />
                    <span style={{ color: "#000", fontWeight: 500 }}>
                      {r.totalReview || 0} đánh giá
                    </span>
                  </div>
                </div>
                <div className="card-footer">
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <button className="like-button">
                      <HeartOutlined />
                    </button>
                    <span className="likes-count">
                      {r.totalFavorite} lượt thích
                    </span>
                  </div>
                  <div
                    onClick={() => handleCardClick(r.id)}
                    className="cta-button"
                    style={{ cursor: 'pointer' }}
                  >
                    Xem công thức
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Pagination
          current={page + 1}
          pageSize={size}
          total={total}
          pageSizeOptions={PAGE_SIZE_OPTIONS}
          showSizeChanger
          onChange={(p, s) => {
            setPage(p - 1);
            setSize(s);
            fetchRecipeList();
          }}
          style={{ marginTop: 16, textAlign: "center" }}
        />
      </div>

      {/* Section: Công thức phổ biến (slide) */}
      <div className="newsfeed-section">
        <h3 className="newsfeed-section-title">
          <EyeOutlined /> Công thức phổ biến
        </h3>
        <div className="recipes-grid-slider">
          <Slider {...sliderSettings}>
            {popularByView.map((r) => (
              <div key={r.id}>
                <div className="recipe-card slider-card">
                  <div className="card-image">
                    <img
                      src={r.imgUrl || "https://via.placeholder.com/400x250?text=No+Image"}
                      alt={r.title}
                    />
                    <div className="card-overlay">
                      <div
                        onClick={() => handleCardClick(r.id)}
                        className="view-button"
                      >
                        Xem chi tiết
                      </div>
                    </div>
                  </div>
                  <div className="card-content">
                    <h3 className="recipe-title">{r.title}</h3>
                    <p className="recipe-description">{r.description}</p>
                    <div className="card-footer">
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <HeartOutlined style={{ color: '#f43f5e' }} />
                        <span className="likes-count">
                          {r.totalFavorite} lượt thích
                        </span>
                      </div>
                      <div
                        onClick={() => handleCardClick(r.id)}
                        className="cta-button"
                        style={{ cursor: 'pointer' }}
                      >
                        Xem
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>

      {/* Section: Công thức yêu thích nhất (slide) */}
      <div className="newsfeed-section">
        <h3 className="newsfeed-section-title">
          <HeartOutlined /> Công thức được yêu thích nhất
        </h3>
        <div className="recipes-grid-slider">
          <Slider {...sliderSettings}>
            {popularByFavorite.map((r) => (
              <div key={r.id}>
                <div className="recipe-card slider-card">
                  <div className="card-image">
                    <img
                      src={r.imgUrl || "https://via.placeholder.com/400x250?text=No+Image"}
                      alt={r.title}
                    />
                    <div className="card-overlay">
                      <div
                        onClick={() => handleCardClick(r.id)}
                        className="view-button"
                      >
                        Xem chi tiết
                      </div>
                    </div>
                  </div>
                  <div className="card-content">
                    <h3 className="recipe-title">{r.title}</h3>
                    <p className="recipe-description">{r.description}</p>
                    <div className="card-footer">
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <HeartOutlined style={{ color: '#f43f5e' }} />
                        <span className="likes-count">
                          {r.totalFavorite} lượt thích
                        </span>
                      </div>
                      <div
                        onClick={() => handleCardClick(r.id)}
                        className="cta-button"
                        style={{ cursor: 'pointer' }}
                      >
                        Xem
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>

      {/* Người dùng có lượt đánh giá cao nhất */}
      <div className="newsfeed-section">
        <h3 className="newsfeed-section-title">Người dùng được đánh giá cao</h3>
        <TopUsersCarousel users={topRatingUsers} type="rating" />
      </div>

      {/* Người dùng có nhiều lượt thích nhất */}
      <div className="newsfeed-section">
        <h3 className="newsfeed-section-title">Người dùng được yêu thích nhất</h3>
        <TopUsersCarousel users={topFavUsers} type="favorite" />
      </div>

      {/* Weekly Challenge */}
      <div className="newsfeed-section">
        <h3 className="newsfeed-section-title">
          <TrophyOutlined /> Thử thách tuần này
        </h3>
        <Card className="challenge-card">
          <Row gutter={16}>
            <Col span={16}>
              <h4>Thử thách: "Món ăn healthy dưới 30 phút"</h4>
              <p>Hãy chia sẻ công thức món ăn healthy có thể hoàn thành trong vòng 30 phút. Công thức hay nhất sẽ nhận được phần thưởng đặc biệt!</p>
              <Button type="primary">Tham gia ngay</Button>
            </Col>
            <Col span={8}>
              <div className="challenge-progress">
                <Statistic title="Số người tham gia" value={127} />
                <Progress percent={65} status="active" />
                <p>Còn 3 ngày</p>
              </div>
            </Col>
          </Row>
        </Card>
      </div>

      <ChatLauncher />
    </div>
  );
}
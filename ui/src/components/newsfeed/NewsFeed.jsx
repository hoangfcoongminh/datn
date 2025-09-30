import React, { useEffect, useState } from "react";
import { Button, Card, Pagination, Rate, Input, Select, Badge, Progress, Statistic, Row, Col } from "antd";
import { TrophyOutlined, FireOutlined, HeartOutlined, EyeOutlined, UserOutlined, BookOutlined } from "@ant-design/icons";
import Slider from "react-slick";
import ChatLauncher from "../common/chatbot/ChatLauncher";
import "./NewsFeed.css";
import { filterRecipes, getPopularRecipe } from "../../api/recipe";
import { fetchPopularCategories } from "../../api/category";
import { getPopularUsers } from "../../api/user";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import TopUsersCarousel from "../common/rating/Rating";
import CountUp from 'react-countup';
import ScrollToTopButton from "../common/ScrollToTopButton";
import { fetchNewsFeed } from "../../api/newsfeed";

const { Option } = Select;

export default function NewsFeed() {
  const PAGE_SIZE_OPTIONS = [6, 12, 24, 48];
  const [recipeList, setRecipeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popularByView, setPopularByView] = useState([]);
  const [popularByFavorite, setPopularByFavorite] = useState([]);
  const [topFavUsers, setTopFavUsers] = useState([]);
  const [topRatingUsers, setTopRatingUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [total, setTotal] = useState(10);
  const [sortField, setSortField] = useState("id,desc");
  const [keyword, setKeyword] = useState("");
  const [minTime, setMinTime] = useState("");
  const [maxTime, setMaxTime] = useState("");
  const [categoryIds, setCategoryIds] = useState([]);
  const [ingredientIds, setIngredientIds] = useState([]);
  const navigate = useNavigate();

  // Mock data for new sections
  const [weeklyStats, setWeeklyStats] = useState({
    totalUser: 0,
    activeUser: 0,
    totalRecipe: 0,
    newRecipeOfWeek: 0
  });

  const [trendingCategories, setTrendingCategories] = useState([]);

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
      setRecipeList(data.data || []);
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
      setPopularByFavorite(data.data || []);
    } catch (err) {
      toast.error(err.message || "Lỗi khi tải công thức");
    } finally {
      setLoading(false);
    }
  };

  const fetchPopularByView = async () => {
    try {
      const data = await getPopularRecipe("view");
      setPopularByView(data.data);
    } catch (err) {
      toast.error(err.message || "Lỗi khi tải công thức");
    } finally {
      setLoading(false);
    }
  };

  const fetchPopularUsers = async () => {
    try {
      const data1 = await getPopularUsers("review");
      setTopRatingUsers(data1.data);

      const data2 = await getPopularUsers("favorite");
      setTopFavUsers(data2.data);
    } catch (err) {
      toast.error(err.message || "Lỗi khi tải công thức");
    } finally {
      setLoading(false);
    }
  };

  const getPopularCategories = async () => {
    try {
      const data = await fetchPopularCategories();
      setTrendingCategories(data.data)
      console.log('popular categories', trendingCategories);

    } catch (err) {
      toast.error(err.message || 'Đã có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  }

  const fetchWeeklyStats = async () => {
    try {
      const data = await fetchNewsFeed();
      console.log('weekly stats', data);
      
      if (data.success) {
        setWeeklyStats(data.data);
      } else {
        toast.error("Lỗi khi tải thống kê cho newsfeed");
      }
    } catch (err) {
      toast.error(err.message || "Lỗi khi tải thống kê tuần");
    }
  };

  // Effect cho việc fetch dữ liệu ban đầu
  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchPopularByFavorite(),
          fetchPopularByView(),
          fetchPopularUsers(),
          getPopularCategories(),
          fetchWeeklyStats(), // Fetch weekly stats
        ]);
      } catch (err) {
        if (isMounted) toast.error(err?.message || "Có lỗi xảy ra");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Effect riêng cho recipe list, chạy khi page, size hoặc các filter thay đổi
  useEffect(() => {
    let isMounted = true;

    const loadRecipes = async () => {
      try {
        setLoading(true);
        const data = await filterRecipes({
          keyword,
          categoryIds,
          ingredientIds,
          minTime: minTime || undefined,
          maxTime: maxTime || undefined,
          page,
          size,
          sort: sortField,
        });
        if (isMounted) {
          setRecipeList(data.data || []);
          setTotal(data.total || 0);
        }
      } catch (err) {
        if (isMounted) toast.error(err?.message || "Có lỗi xảy ra");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadRecipes();

    return () => {
      isMounted = false;
    };
  }, [page, size, keyword, categoryIds, ingredientIds, minTime, maxTime, sortField]);

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
        <div className="hero-stats">
          <Row gutter={16} justify="center">
            <Col span={6}>
              <Statistic title="Tổng công thức" valueRender={() => <CountUp end={weeklyStats.totalRecipe} duration={1.5} />} prefix={<BookOutlined />} />
            </Col>
            <Col span={6}>
              <Statistic title="Công thức mới trong tuần" valueRender={() => <CountUp end={weeklyStats.newRecipeOfWeek} duration={1.5} />} prefix={<FireOutlined />} />
            </Col>
            <Col span={6}>
              <Statistic title="Người dùng" valueRender={() => <CountUp end={weeklyStats.totalUser} duration={1.5} />} prefix={<UserOutlined />} />
            </Col>
            <Col span={6}>
              <Statistic title="Đang hoạt động" valueRender={() => <CountUp end={weeklyStats.activeUser} duration={1.5} />} prefix={<EyeOutlined />} />
            </Col>
          </Row>
        </div>
      </div>

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
            <Option value="id,desc">Mới nhất</Option>
            <Option value="id,asc">Cũ nhất</Option>
            <Option value="title,asc">Tên A-Z</Option>
            <Option value="title,desc">Tên Z-A</Option>
          </Select>
          <Input
            allowClear
            placeholder="Tìm kiếm công thức yêu thích..."
            value={keyword}
            onChange={(e) => {
              setPage(0);
              setKeyword(e.target.value);
            }}
            style={{ maxWidth: 320, borderRadius: 8 }}
            className="hero-search"
          />
          <Link
            to="/recipes"
            style={{
              float: "right",
              color: "#1890ff",
              // fontWeight: "bold",
              textDecoration: "none",
              marginTop: "8px",
              transition: "color 0.3s",
            }}
            onMouseEnter={(e) => (e.target.style.color = "#2823b5ff")}
            onMouseLeave={(e) => (e.target.style.color = "#1890ff")}
          >
            Tìm kiếm nhiều hơn ?
          </Link>
        </div>
        <div className="recipes-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px'
        }}>
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
                {/* <p className="recipe-description">{r.description}</p> */}
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

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32, marginBottom: 32 }}>
          <Pagination
            current={page + 1}
            pageSize={size}
            total={total}
            pageSizeOptions={PAGE_SIZE_OPTIONS}
            showSizeChanger
            showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} công thức`}
            onChange={(p, s) => {
              setPage(p - 1);
              setSize(s);
            }}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3 className="section-title">
          <TrophyOutlined /> Thể loại thịnh hành
        </h3>
        <div className="trending-categories" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          padding: '20px'
        }}>
          {trendingCategories.map((category, index) => (
            <Card
              key={index}
              hoverable
              cover={
                <div style={{
                  height: '160px',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <img
                    src={category.imgUrl || "https://via.placeholder.com/400x250?text=No+Image"}
                    alt={category.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.6))'
                  }} />
                </div>
              }
              className="category-card"
              onClick={() => navigate(`/recipes?categoryId=${category.id}`)}
              style={{ position: 'relative' }}
            >
              <div className="category-info" style={{ position: 'relative' }}>
                <h4 style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  marginBottom: '8px',
                  color: '#000'
                }}>{category.name}</h4>
                <p style={{
                  color: '#666',
                  marginBottom: '8px'
                }}>{category.count} công thức</p>
                <div
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '-4px',
                    padding: '0 8px',
                    fontSize: '12px',
                    lineHeight: '20px',
                    borderRadius: '6px',
                    fontWeight: 500,
                    backgroundColor: category.growth >= 0 ? '#52c41a' : '#ff4d4f',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {category.growth > 0 ? '+' : ''}
                  <CountUp
                    end={Math.abs(category.growth)}
                    duration={2}
                    decimals={1}
                  />
                  %
                </div>
              </div>
            </Card>
          ))}
        </div>
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
        {popularByFavorite.length > 0 ? (
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
        ) : (
          <p>Chưa có công thức nào được yêu thích.</p>
        )}
      </div>

      {/* Người dùng có lượt đánh giá cao nhất */}
      <div className="newsfeed-section">
        <h3 className="newsfeed-section-title">Người dùng được đánh giá cao</h3>
        {topRatingUsers.length > 0 ? (
          <TopUsersCarousel users={topRatingUsers} type="rating" />
        ) : (
          <p>Chưa có người dùng nào được đánh giá cao.</p>
        )}
      </div>

      {/* Người dùng có nhiều lượt thích nhất */}
      <div className="newsfeed-section">
        <h3 className="newsfeed-section-title">Người dùng được yêu thích nhất</h3>
        {topFavUsers.length > 0 ? (
          <TopUsersCarousel users={topFavUsers} type="favorite" />
        ) : (
          <p>Chưa có người dùng nào được yêu thích.</p>
        )}
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
      <ScrollToTopButton />
      <ChatLauncher />
    </div>
  );
}
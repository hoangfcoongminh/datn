import React, { useEffect, useState } from "react";
import { List, Spin, Avatar, Button, Card, Pagination, Carousel } from "antd";
import Slider from "react-slick";
import ChatLauncher from "../common/chatbot/ChatLauncher";
import "./NewsFeed.css";
import { filterRecipes, getPopularRecipe } from "../../api/recipe";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function NewsFeed() {
  const PAGE_SIZE_OPTIONS = [8, 12, 24, 48];
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

  const fetchRecipeList = async () => {
    setLoading(true);
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
    setLoading(true);
    try {
      const data = await getPopularRecipe('favorite');
      setPopularByFavorite(data || []);
      // setTotal(data.total || 1);
    } catch (err) {
      toast.error(err.message || "Lỗi khi tải công thức");
    } finally {
      setLoading(false);
    }
  };

  const fetchPopularByView = async () => {
    setLoading(true);
    try {
      const data = await getPopularRecipe('view');
      console.log('data: ', data);

      setPopularByView(data || []);
      // setTotal(data.total || 1);
    } catch (err) {
      toast.error(err.message || "Lỗi khi tải công thức");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchRecipeList(),
          fetchPopularByFavorite(),
          fetchPopularByView(),
        ]);
      } catch (err) {
        toast.error(err);
      }
    };

    loadData();
    console.log('view: ', popularByView);
    console.log('favorite: ', popularByFavorite);

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

  return (
    <div className="newsfeed-root">
      <h2 className="newsfeed-title">News Feed</h2>

      {/* Section: Danh sách công thức */}
      <div className="newsfeed-section">
        <h3 className="newsfeed-section-title">Danh sách công thức</h3>
        <div className="newsfeed-list-row">
          {recipeList.map((r) => (
            <Card
              key={r.id}
              hoverable
              onClick={() => handleCardClick(r.id)}
              className="newsfeed-card"
              cover={<img src={r.imgUrl} alt={r.title} style={{ height: 80, objectFit: "cover" }} />}
            >
              <div className="newsfeed-card-title">{r.title}</div>
              <div className="newsfeed-card-meta">{r.totalFavorite} lượt thích</div>
            </Card>
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
            fetchRecipeList(); // gọi lại API
          }}
          style={{ marginTop: 16, textAlign: "center" }}
        />
      </div>

      {/* Section: Công thức phổ biến (slide) */}
      <div className="newsfeed-section">
        <h3>Công thức phổ biến</h3>
        <Slider {...sliderSettings}>
          {popularByView.map((r) => (
            <Card
              key={r.id}
              hoverable
              onClick={() => handleCardClick(r.id)}
              className="newsfeed-card"
              cover={
                <img
                  src={r.imgUrl}
                  alt={r.title}
                  style={{ height: 100, objectFit: "cover" }}
                />
              }
            >
              <div className="newsfeed-card-title">{r.title}</div>
              <div className="newsfeed-card-meta">
                {r.totalFavorite} lượt thích
              </div>
            </Card>
          ))}
        </Slider>
      </div>

      {/* Section: Công thức yêu thích nhất (slide) */}
      <div className="newsfeed-section">
        <h3>Công thức được yêu thích nhất</h3>
        <Slider {...sliderSettings}>
          {popularByFavorite.map((r) => (
            <Card
              key={r.id}
              hoverable
              onClick={() => handleCardClick(r.id)}
              className="newsfeed-card"
              cover={
                <img
                  src={r.imgUrl}
                  alt={r.title}
                  style={{ height: 100, objectFit: "cover" }}
                />
              }
            >
              <div className="newsfeed-card-title">{r.title}</div>
              <div className="newsfeed-card-meta">
                {r.totalFavorite} lượt thích
              </div>
            </Card>
          ))}
        </Slider>
      </div>
    
      {/* Section: Người dùng có lượt đánh giá cao nhất */}
      <div className="newsfeed-section">
        <h3 className="newsfeed-section-title">
          Người dùng có lượt đánh giá cao nhất
        </h3>
        <div className="newsfeed-list-row">
          {topRatingUsers.map((u) => (
            <Card
              key={u.id}
              hoverable
              className="newsfeed-card"
              style={{ textAlign: "center" }}
            >
              <Avatar src={u.imgUrl} size={64} style={{ marginBottom: 8 }} />
              <div className="newsfeed-card-title">{u.name}</div>
              <div className="newsfeed-card-meta">
                {u.totalRating} lượt đánh giá
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Section: NewsFeed gốc */}
      {/* <div className="newsfeed-section">
        <h3 className="newsfeed-section-title">Hoạt động cộng đồng</h3>
        {loading ? (
          <Spin size="large" />
        ) : (
          <List
            itemLayout="vertical"
            dataSource={posts}
            renderItem={(item) => (
              <List.Item
                key={item.id}
                extra={
                  item.imgUrl && (
                    <img width={180} alt="post" src={item.imgUrl} />
                  )
                }
              >
                <List.Item.Meta
                  avatar={<Avatar src={item.authorImgUrl} />}
                  title={
                    <Link to={`/user/${item.authorId}`}>{item.authorName}</Link>
                  }
                  description={item.createdAt}
                />
                <div className="newsfeed-content">{item}</div>
                <Button type="link" href={`/post/${item.id}`}>
                  Xem chi tiết
                </Button>
              </List.Item>
            )}
          />
        )}
      </div> */}

      <ChatLauncher />
    </div>
  );
}

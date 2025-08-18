import React, { useEffect, useState } from "react";
import { List, Spin, Avatar, Button, Card } from "antd";
import { Link } from "react-router-dom";
import ChatLauncher from "../common/chatbot/ChatLauncher";
import "./NewsFeed.css";
import { filterRecipes } from "../../api/recipe";
import { toast } from "react-toastify";

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

  const fetchRecipeList = async function fetchFeed() {
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

  const fetchPopular = async function fetchFeed() {
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



  useEffect(() => {
    fetchFeed();
  }, []);

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
              className="newsfeed-card"
              cover={
                <img
                  src={r.imgUrl}
                  alt={r.title}
                  style={{ height: 80, objectFit: "cover" }}
                />
              }
            >
              <div className="newsfeed-card-title">{r.title}</div>
              <div className="newsfeed-card-meta">{r.favorite} lượt thích</div>
            </Card>
          ))}
        </div>
      </div>

      {/* Section: Công thức phổ biến */}
      <div className="newsfeed-section">
        <h3 className="newsfeed-section-title">Công thức phổ biến</h3>
        <div className="newsfeed-list-row">
          {popular.map((r) => (
            <Card
              key={r.id}
              hoverable
              className="newsfeed-card"
              cover={
                <img
                  src={r.imgUrl}
                  alt={r.title}
                  style={{ height: 80, objectFit: "cover" }}
                />
              }
            >
              <div className="newsfeed-card-title">{r.title}</div>
              <div className="newsfeed-card-meta">{r.favorite} lượt thích</div>
            </Card>
          ))}
        </div>
      </div>

      {/* Section: Công thức yêu thích nhất */}
      <div className="newsfeed-section">
        <h3 className="newsfeed-section-title">
          Công thức được yêu thích nhất
        </h3>
        <div className="newsfeed-list-row">
          {favorite.map((r) => (
            <Card
              key={r.id}
              hoverable
              className="newsfeed-card"
              cover={
                <img
                  src={r.imgUrl}
                  alt={r.title}
                  style={{ height: 80, objectFit: "cover" }}
                />
              }
            >
              <div className="newsfeed-card-title">{r.title}</div>
              <div className="newsfeed-card-meta">{r.favorite} lượt thích</div>
            </Card>
          ))}
        </div>
      </div>

      {/* Section: Top 3 người dùng có lượt yêu thích cao nhất */}
      <div className="newsfeed-section">
        <h3 className="newsfeed-section-title">
          Top 3 người dùng có lượt yêu thích cao nhất
        </h3>
        <div className="newsfeed-list-row">
          {topFavUsers.map((u) => (
            <Card
              key={u.id}
              hoverable
              className="newsfeed-card"
              style={{ textAlign: "center" }}
            >
              <Avatar src={u.imgUrl} size={64} style={{ marginBottom: 8 }} />
              <div className="newsfeed-card-title">{u.name}</div>
              <div className="newsfeed-card-meta">
                {u.totalFavorite} lượt thích
              </div>
            </Card>
          ))}
        </div>
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
                <div className="newsfeed-content">{item.content}</div>
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

import React, { useEffect, useState } from "react";
import { List, Spin, Avatar, Button, Card } from "antd";
import { Link } from "react-router-dom";
import { getNewsFeed } from "../../api/newsfeed";
import ChatLauncher from "../common/chatbot/ChatLauncher";
import {
  getPopularRecipes,
  getMostFavoriteRecipes,
  getTopUsersByFavorite,
  getTopUsersByRating
} from "../../api/newsfeedExtra";
import "./NewsFeed.css";

export default function NewsFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popular, setPopular] = useState([]);
  const [favorite, setFavorite] = useState([]);
  const [topFavUsers, setTopFavUsers] = useState([]);
  const [topRatingUsers, setTopRatingUsers] = useState([]);

  useEffect(() => {
    async function fetchFeed() {
      setLoading(true);
      try {
        const data = await getNewsFeed();
        setPosts(Array.isArray(data) ? data : []);
      } catch (err) {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchFeed();

    // Fetch extra sections
    getPopularRecipes().then(setPopular);
    getMostFavoriteRecipes().then(setFavorite);
    getTopUsersByFavorite().then(setTopFavUsers);
    getTopUsersByRating().then(setTopRatingUsers);
  }, []);

  return (
    <div className="newsfeed-root">
      <h2 className="newsfeed-title">News Feed</h2>

      {/* Section: Món ăn phổ biến */}
      <div className="newsfeed-section">
        <h3 className="newsfeed-section-title">Món ăn phổ biến</h3>
        <div className="newsfeed-list-row">
          {popular.map((r) => (
            <Card key={r.id} hoverable className="newsfeed-card" cover={<img src={r.imgUrl} alt={r.title} style={{height:80,objectFit:'cover'}} />}>
              <div className="newsfeed-card-title">{r.title}</div>
              <div className="newsfeed-card-meta">{r.favorite} lượt thích</div>
            </Card>
          ))}
        </div>
      </div>

      {/* Section: Món ăn yêu thích nhất */}
      <div className="newsfeed-section">
        <h3 className="newsfeed-section-title">Món ăn được yêu thích nhất</h3>
        <div className="newsfeed-list-row">
          {favorite.map((r) => (
            <Card key={r.id} hoverable className="newsfeed-card" cover={<img src={r.imgUrl} alt={r.title} style={{height:80,objectFit:'cover'}} />}>
              <div className="newsfeed-card-title">{r.title}</div>
              <div className="newsfeed-card-meta">{r.favorite} lượt thích</div>
            </Card>
          ))}
        </div>
      </div>

      {/* Section: Top 3 người dùng có lượt yêu thích cao nhất */}
      <div className="newsfeed-section">
        <h3 className="newsfeed-section-title">Top 3 người dùng có lượt yêu thích cao nhất</h3>
        <div className="newsfeed-list-row">
          {topFavUsers.map((u) => (
            <Card key={u.id} hoverable className="newsfeed-card" style={{textAlign:'center'}}>
              <Avatar src={u.imgUrl} size={64} style={{marginBottom:8}} />
              <div className="newsfeed-card-title">{u.name}</div>
              <div className="newsfeed-card-meta">{u.totalFavorite} lượt thích</div>
            </Card>
          ))}
        </div>
      </div>

      {/* Section: Người dùng có lượt đánh giá cao nhất */}
      <div className="newsfeed-section">
        <h3 className="newsfeed-section-title">Người dùng có lượt đánh giá cao nhất</h3>
        <div className="newsfeed-list-row">
          {topRatingUsers.map((u) => (
            <Card key={u.id} hoverable className="newsfeed-card" style={{textAlign:'center'}}>
              <Avatar src={u.imgUrl} size={64} style={{marginBottom:8}} />
              <div className="newsfeed-card-title">{u.name}</div>
              <div className="newsfeed-card-meta">{u.totalRating} lượt đánh giá</div>
            </Card>
          ))}
        </div>
      </div>

      {/* Section: NewsFeed gốc */}
      <div className="newsfeed-section">
        <h3 className="newsfeed-section-title">Hoạt động cộng đồng</h3>
        {loading ? (
          <Spin size="large" />
        ) : (
          <List
            itemLayout="vertical"
            dataSource={posts}
            renderItem={item => (
              <List.Item
                key={item.id}
                extra={item.imgUrl && (
                  <img width={180} alt="post" src={item.imgUrl} />
                )}
              >
                <List.Item.Meta
                  avatar={<Avatar src={item.authorImgUrl} />}
                  title={<Link to={`/user/${item.authorId}`}>{item.authorName}</Link>}
                  description={item.createdAt}
                />
                <div className="newsfeed-content">{item.content}</div>
                <Button type="link" href={`/post/${item.id}`}>Xem chi tiết</Button>
              </List.Item>
            )}
          />
        )}
      </div>

      <ChatLauncher />
    </div>
  );
}

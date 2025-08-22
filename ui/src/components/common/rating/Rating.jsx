import React from "react";
import { Card, Avatar, Rate } from "antd";
import { HeartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./Rating.css";

export default function TopUsersCarousel({ users = [], type = "rating" }) {
  if (users.length === 0) return null;
  const navigate = useNavigate();

  const middle = users[0];
  const left = users[1];
  const right = users[2];

  const renderCard = (user, highlight = false) => {
    if (!user) return null;
    return (
      <Card
        key={user.id}
        hoverable
        onClick={() => navigate(`/user/${user.username}`)}
        className={`top-user-card ${highlight ? "highlight" : ""}`}
      >
        <Avatar src={user.imgUrl} size={highlight ? 80 : 64} />
        <div className="card-title">{user.fullName}</div>
        <div className="user-meta">
          {type === "rating" ? (
            <>
              <Rate allowHalf disabled value={user.averageRating} />
              <div>Tổng đánh giá: {user.totalReviewForUser}</div>
            </>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <HeartOutlined />
              {user.totalFavoriteForUser || 0} thích
            </div>
          )}
        </div>
      </Card>
    )
  };

  return (
    <div
      className="top-users-row"
      style={{
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "flex-end",
        gap: "16px",
      }}
    >
      {/* Left side */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {renderCard(left, false)}
      </div>

      {/* Middle */}
      <div>{renderCard(middle, true)}</div>

      {/* Right side */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {renderCard(right, false)}
      </div>
    </div>
  );
}

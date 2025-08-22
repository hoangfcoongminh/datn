// Helper to format time difference
function getRelativeTime(dateString) {
  // Hỗ trợ định dạng 'HH:mm:ss DD-MM-YYYY'
  let date;
  if (/^\d{2}:\d{2}:\d{2} \d{2}-\d{2}-\d{4}$/.test(dateString)) {
    // Chuyển thành 'YYYY-MM-DDTHH:mm:ss'
    const [time, dmy] = dateString.split(' ');
    const [day, month, year] = dmy.split('-');
    date = new Date(`${year}-${month}-${day}T${time}`);
  } else {
    date = new Date(dateString);
  }
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Vừa xong';
  if (diffMins < 60) return `${diffMins} phút trước`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} giờ trước`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} ngày trước`;
}

import React, { useEffect, useState } from "react";
import { Avatar, Button, Input, List, Pagination, Spin, Rate } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { fetchReviews, postReview, updateReview } from "../../../api/review";
import ConfirmModal from "../ConfirmModal";
import "./Review.css";

export default function Review({ recipeId, user, allowPost = true, averageRating, totalReview, onReviewChange }) {
  const [reviews, setReviews] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cmt, setCmt] = useState("");
  const [posting, setPosting] = useState(false);
  const [rating, setRating] = useState(5);
  const pageSize = 5;
  const [confirmOpen, setConfirmOpen] = useState(false);

  const loadReviews = async (p = page) => {
    setLoading(true);
    const data = await fetchReviews(recipeId, p, pageSize);
    setReviews(data.data || []);
    setTotal(() => {
      return data.total || 0;
    });
    
    setLoading(false);
  };

  useEffect(() => {
    loadReviews(1);
    setPage(1);
    // eslint-disable-next-line
  }, [recipeId]);

  const handlePost = async () => {
    if (!cmt.trim() || !rating) return;
    setPosting(true);
    try {
      const comment = {
        recipeId: recipeId,
        rating: rating,
        comment: cmt.trim()
      };
      await postReview(comment);
      setCmt("");
      setRating(5);
      setPage(1);
      loadReviews(1);
      if (onReviewChange) onReviewChange();
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = async () => {
    try {
      const comment = {
        recipeId: recipeId,
        status: 0
      }
      await updateReview(comment);
      if (onReviewChange) onReviewChange();
    } finally {
     loadReviews(1);
     setConfirmOpen(false);
    }
  };

  return (
    <div className="review-root">
      <div
        style={{
          fontWeight: 900,
          fontSize: 32,
          background: 'linear-gradient(90deg, #a50034 0%, #ff7e5f 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textFillColor: 'transparent',
          marginBottom: 10,
          textAlign: 'left',
          letterSpacing: 1.5,
          textShadow: '0 2px 8px rgba(165,0,52,0.10)',
        }}
      >
        Đánh giá của người dùng
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18, marginLeft: 2 }}>
        <span style={{ fontWeight: 700, fontSize: 20, color: '#faad14', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Rate allowHalf disabled value={averageRating || 0} style={{ fontSize: 22, color: '#faad14' }} />
          <span style={{ color: '#a50034', fontWeight: 800, fontSize: 22 }}>{averageRating ? averageRating.toFixed(1) : '0.0'}</span>
        </span>
        <span style={{ color: '#888', fontWeight: 500, fontSize: 16 }}>
          {totalReview || 0} lượt đánh giá
        </span>
      </div>
      {allowPost && (
        <div className="review-input-box">
          <Avatar icon={<UserOutlined />} src={user?.imgUrl} size={48} />
          <div className="review-input-content">
            <div style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
              <Rate allowHalf value={rating} onChange={setRating} />
              <span style={{ color: '#faad14', fontWeight: 600, fontSize: 16 }}>{rating.toFixed(1)} / 5</span>
            </div>
            <Input.TextArea
              value={cmt}
              onChange={e => setCmt(e.target.value)}
              style={{ fontSize: 17 }}
              placeholder="Viết bình luận..."
              rows={3}
              disabled={posting}
              onPressEnter={e => {
                if (!e.shiftKey) {
                  e.preventDefault();
                  handlePost();
                }
              }}
            />
            <div style={{ textAlign: "right", marginTop: 8 }}>
              <Button
                type="primary"
                loading={posting}
                onClick={handlePost}
                disabled={!cmt.trim() || !rating}
                className="btn-send"
              >
                Gửi
              </Button>
            </div>
          </div>
        </div>
      )}
      <Spin spinning={loading}>
        <List
          className="review-list"
          dataSource={reviews}
          locale={{ emptyText: "Chưa có đánh giá nào" }}
          renderItem={item => (
            <List.Item>
              <div style={{ display: 'flex', width: '100%' }}>
                <Avatar src={item.imgUrl} icon={<UserOutlined />} size={40} style={{ marginTop: 2 }} />
                <div style={{ flex: 1, marginLeft: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#d81f11ff', position: 'relative' }}>
                    <span style={{ fontWeight: 500, fontSize: 16 }}>
                      {item.fullName}
                      {item.username === user?.username && <span style={{ color: '#266c82ff', fontWeight: 600 }}>-Đánh giá của bạn</span>}
                    </span>
                    <span style={{ color: "#888", fontSize: 13 }}>{getRelativeTime(item.createdAt)}</span>
                    {typeof item.rating === "number" && (
                      <span style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: 10 }}>
                        <Rate allowHalf disabled value={item.rating} />
                      </span>
                    )}
                    {/* Nút xóa chỉ hiển thị nếu là chủ comment */}
                    {item.username === user?.username && (
                      <Button
                        danger
                        size="small"
                        style={{ position: 'absolute', right: 0, top: 0 }}
                        onClick={() => setConfirmOpen(true)}
                      >
                        Xóa
                      </Button>
                    )}
                  </div>
                  <div
                    className="review-comment"
                    style={{
                      marginTop: 8,
                      background: '#f7f7f7',
                      borderRadius: 8,
                      color: '#464444ff',
                      fontSize: 15,
                      border: '1px solid #e0e0e0',
                      padding: '14px 16px',
                      minHeight: 40,
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {item.comment}
                  </div>
                </div>
              </div>
            </List.Item>
          )}
        />
        {total > pageSize && (
          <div style={{ width: '100%' }}>
            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
              <Pagination
                current={page}
                pageSize={pageSize}
                total={total}
                onChange={p => {
                  setPage(p);
                  loadReviews(p);
                }}
                showSizeChanger={false}
              />
            </div>
          </div>
        )}
        <ConfirmModal
          open={confirmOpen}
          onOk={() => {
            handleDelete();
          }}
          onCancel={() => {
            setConfirmOpen(false);
          }}
          title="Xác nhận xóa bài đánh giá"
          content={"Bạn có chắc chắn muốn xóa bài đánh giá này ?"}
          okText="Xóa"
          cancelText="Huỷ"
        />
      </Spin>
    </div>
  );
}

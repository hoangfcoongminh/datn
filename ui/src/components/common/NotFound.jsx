import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => (
  <div className="not-found-container">
    <div className="not-found-content">
      <div className="not-found-icon">404</div>
      <h1 className="not-found-title">Không tìm thấy trang</h1>
      <p className="not-found-description">
        Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
      </p>
      <Link to="/" className="not-found-button">
        Về trang chủ
      </Link>
    </div>
  </div>
);

export default NotFound;

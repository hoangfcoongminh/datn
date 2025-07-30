import React, { useState } from 'react';
import { FaBell, FaUserCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import logo from '../../assets/react.svg'; // Đổi thành logo của bạn nếu có
import './Header.css';

const Header = ({ user, onLogout, onAccount, onNavigate }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="main-header">
      <div className="header-left">
        <img
          src={logo}
          alt="logo"
          className="header-logo"
          onClick={() => onNavigate('home')}
          style={{ cursor: 'pointer' }}
        />
        <button className="header-btn" onClick={() => onNavigate('home')}>Trang chủ</button>
        <button className="header-btn" onClick={() => onNavigate('category')}>Category</button>
        <button className="header-btn" onClick={() => onNavigate('ingredient')}>Ingredient</button>
        <button className="header-btn" onClick={() => onNavigate('recipe')}>Recipe</button>
      </div>
      <div className="header-right">
        <button className="header-icon-btn" title="Thông báo"><FaBell /></button>
        <div className="header-user-dropdown">
          <button className="header-icon-btn" onClick={() => setShowDropdown(v => !v)}>
            <FaUserCircle style={{ fontSize: 22 }} />
            {showDropdown ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          {showDropdown && (
            <div className="header-dropdown-list">
              <button onClick={onAccount}>Quản lý tài khoản</button>
              <button onClick={onLogout}>Đăng xuất</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

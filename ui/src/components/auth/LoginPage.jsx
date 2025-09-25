import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';
import { login } from '../../api/auth';
import { FaUserAlt, FaLock, FaHome, FaUserPlus } from 'react-icons/fa';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import ChatLauncher from '../common/chatbot/ChatLauncher';
import cookingImg from '../../assets/cooking.png';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const data = await login(username, password);
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      toast.success('Đăng nhập thành công!');
      onLogin && onLogin(username, data);
    } catch (err) {
      if (Array.isArray(err.message)) {
        setError(err.message.join('\n'));
      } else {
        setError(err.message || 'Đăng nhập thất bại.');
      }
      toast.error(err.message || 'Đăng nhập thất bại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-wrapper">
        <div className="auth-header">
          <div className="auth-logo-circle">
            <img src={cookingImg} alt="CookCraft" />
          </div>
          <h2>Đăng nhập</h2>
          <p className="auth-sub">Chào mừng bạn trở lại với CookCraft!</p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-input-group">
            <span className="auth-input-icon"><FaUserAlt /></span>
            <input
              type="text"
              placeholder="Tên đăng nhập"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoComplete="username"
              disabled={loading}
            />
          </div>
          
          <div className="auth-input-group" style={{position:'relative'}}>
            <span className="auth-input-icon"><FaLock /></span>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Mật khẩu"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              disabled={loading}
            />
            <span
              className="password-toggle"
              onClick={() => setShowPassword(v => !v)}
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          
          {error && (
            <div className="auth-error">
              {error.split('\n').map((line, i) => <div key={i}>{line}</div>)}
            </div>
          )}
          
          <button 
            type="submit" 
            className="auth-btn-main" 
            disabled={loading}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <div className="auth-navigation">
          <div className="auth-nav-divider">
            <span>hoặc</span>
          </div>
          
          <div className="auth-nav-buttons">
            <Link to="/signup" className="auth-nav-btn secondary">
              <FaUserPlus />
              Chưa có tài khoản? Đăng ký
            </Link>
            
            <Link to="/home" className="auth-nav-btn home">
              <FaHome />
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
      <ChatLauncher />
    </div>
  );
};

export default LoginPage;

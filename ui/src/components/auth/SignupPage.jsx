import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';
import { FaUserAlt, FaLock, FaEnvelope, FaHome, FaSignInAlt } from 'react-icons/fa';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { signup } from '../../api/auth';

const SignupPage = ({ onSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password || !confirmPassword || !email || !fullName) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const data = await signup({ username, password, confirmPassword, fullName, email });
      onSignup && onSignup(username, data);
    } catch (err) {
      if (Array.isArray(err.message)) {
        setError(err.message.join('\n'));
      } else {
        setError(err.message || 'Đăng ký thất bại.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-wrapper">
        <div className="auth-header">
          <div className="auth-logo-circle">
            <img src="/vite.svg" alt="CookCraft" />
          </div>
          <h2>Đăng ký</h2>
          <p className="auth-sub">Tạo tài khoản CookCraft để bắt đầu hành trình nấu ăn!</p>
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
          
          <div className="auth-input-group">
            <span className="auth-input-icon"><FaUserAlt /></span>
            <input
              type="text"
              placeholder="Họ và tên"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              autoComplete="name"
              disabled={loading}
            />
          </div>
          
          <div className="auth-input-group">
            <span className="auth-input-icon"><FaEnvelope /></span>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
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
              autoComplete="new-password"
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
          
          <div className="auth-input-group" style={{position:'relative'}}>
            <span className="auth-input-icon"><FaLock /></span>
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder="Xác nhận mật khẩu"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              disabled={loading}
            />
            <span
              className="password-toggle"
              onClick={() => setShowConfirm(v => !v)}
              aria-label={showConfirm ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            >
              {showConfirm ? <FaEyeSlash /> : <FaEye />}
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
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
        </form>

        <div className="auth-navigation">
          <div className="auth-nav-divider">
            <span>hoặc</span>
          </div>
          
          <div className="auth-nav-buttons">
            <Link to="/login" className="auth-nav-btn secondary">
              <FaSignInAlt />
              Đã có tài khoản? Đăng nhập
            </Link>
            
            <Link to="/" className="auth-nav-btn home">
              <FaHome />
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

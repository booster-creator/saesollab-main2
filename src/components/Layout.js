import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Layout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  if (isLoginPage) {
    return children;
  }

  return (
    <div className="layout">
      <header className="header">
        <div className="header-container">
          <div className="header-left">
            <Link to="/" className="logo">
              <div className="check-icon" />
            </Link>
            
            <nav className="nav">
              <Link 
                to="/search" 
                className={`nav-link ${location.pathname === '/search' ? 'active' : ''}`}
              >
                검색 분석
              </Link>
              <Link 
                to="/insights" 
                className={`nav-link ${location.pathname === '/insights' ? 'active' : ''}`}
              >
                인사이트
              </Link>
            </nav>
          </div>

          <div className="header-right">
            {user ? (
              <div className="user-menu">
                <Link to="/profile" className="profile-link">
                  <img src={user.photoURL} alt="" className="user-avatar" />
                  <span>{user.displayName}</span>
                </Link>
                <button onClick={logout} className="logout-button">
                  로그아웃
                </button>
              </div>
            ) : (
              <Link to="/login" className="login-link">
                로그인
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="main">
        <div className="main-container">
          {children}
        </div>
      </main>
    </div>
  );
}

export default Layout; 
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Banner from './Banner';

function Layout({ children }) {
  const { logout } = useAuth();
  const location = useLocation();
  
  return (
    <div className="layout">
      <nav className="navbar">
        <div className="nav-brand">콘텐츠랩</div>
        <div className="nav-links">
          <Link to="/home" className={location.pathname === '/home' ? 'active' : ''}>
            홈
          </Link>
          <Link to="/search" className={location.pathname === '/search' ? 'active' : ''}>
            검색
          </Link>
          <Link to="/mypage" className={location.pathname === '/mypage' ? 'active' : ''}>
            마이페이지
          </Link>
          <button onClick={logout} className="logout-button">
            로그아웃
          </button>
        </div>
      </nav>
      
      <Banner />
      
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default Layout; 
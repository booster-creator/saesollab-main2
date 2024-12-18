import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Layout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="toss-layout">
      <header className="toss-header-nav">
        <div className="toss-header-content">
          <div className="toss-header-left">
            <Link to="/" className="toss-logo">
              <img src="/assets/images/logo.svg" alt="콘텐츠랩" />
              <span>콘텐츠랩</span>
            </Link>
            <nav className="toss-nav">
              <Link 
                to="/search" 
                className={`toss-nav-item ${location.pathname === '/search' ? 'active' : ''}`}
              >
                검색 분석
              </Link>
              <Link 
                to="/insights" 
                className={`toss-nav-item ${location.pathname === '/insights' ? 'active' : ''}`}
              >
                인사이트
              </Link>
            </nav>
          </div>
          <div className="toss-header-right">
            {user && (
              <>
                <Link to="/mypage" className="toss-profile">
                  <img src={user.picture} alt={user.name} className="toss-avatar" />
                  <span className="toss-username">{user.name}</span>
                </Link>
                <button onClick={logout} className="toss-logout-button">
                  로그아웃
                </button>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="toss-main">
        {children}
      </main>
      <footer className="toss-footer">
        <div className="toss-footer-content">
          <div className="toss-footer-top">
            <div className="toss-footer-logo">
              <img src="/assets/images/logo.svg" alt="콘텐츠랩" />
              <span>콘텐츠랩</span>
            </div>
            <div className="toss-footer-links">
              <div className="toss-footer-section">
                <h4>서비스</h4>
                <Link to="/search">검색 분석</Link>
                <Link to="/insights">인사이트</Link>
                <Link to="/pricing">요금제</Link>
              </div>
              <div className="toss-footer-section">
                <h4>회사</h4>
                <Link to="/about">회사 소개</Link>
                <Link to="/terms">이용약관</Link>
                <Link to="/privacy">개인정보처리방침</Link>
              </div>
              <div className="toss-footer-section">
                <h4>고객센터</h4>
                <a href="mailto:support@contentlab.kr">이메일 문의</a>
                <span>평일 10:00 - 17:00</span>
              </div>
            </div>
          </div>
          <div className="toss-footer-bottom">
            <div className="toss-company-info">
              <p>스튜디오새솔 | 대표이사 : 이도훈 | 사업자등록번호 : 218-55-00940</p>
              <p>서울특별시 중랑구 용마산로 252</p>
              <p>© studiosaesol . All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout; 
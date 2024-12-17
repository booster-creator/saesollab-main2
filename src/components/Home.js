import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <h1>YouTube 데이터 분석 플랫폼</h1>
      <div className="features">
        <div className="feature-card" onClick={() => navigate('/search')}>
          <h3>YouTube 검색 분석</h3>
          <p>채널과 영상의 성과를 분석하세요</p>
        </div>
        {/* 추가 기능 카드들 */}
      </div>
    </div>
  );
}

export default Home; 
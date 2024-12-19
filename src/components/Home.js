import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home">
      <header className="home-header">
        <h1>YouTube 채널 성장을 위한<br />데이터 기반 인사이트</h1>
        <p>검색 데이터 분석으로 채널 성장에 필요한 인사이트를 제공합니다</p>
      </header>

      <div className="feature-grid">
        <div className="feature-card">
          <div className="feature-icon search" />
          <h3>검색 트렌드 분석</h3>
          <p>실시간 검색량과 트렌드 변화를 분석하여 제공합니다</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon competition" />
          <h3>경쟁 강도 분석</h3>
          <p>키워드별 경쟁 채널 수와 경쟁 강도를 확인할 수 있습니다</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon keyword" />
          <h3>연관 키워드 추천</h3>
          <p>AI가 분석한 연관성 높은 키워드를 추천해드립니다</p>
        </div>
      </div>
    </div>
  );
}

export default Home; 
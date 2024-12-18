import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="toss-home">
      <section className="toss-hero">
        <h1>YouTube 채널 성장을 위한 모든 것</h1>
        <p>데이터 기반의 인사이트로 채널 성장을 가속화하세요</p>
        <div className="toss-hero-actions">
          <Link to="/search" className="toss-button-primary">시작하기</Link>
          <Link to="/insights" className="toss-button-secondary">인사이트 보기</Link>
        </div>
      </section>

      <section className="toss-features">
        {/* 주요 기능 섹션 */}
      </section>

      <section className="toss-stats">
        {/* 통계 섹션 */}
      </section>
    </div>
  );
}

export default Home; 
import React from 'react';

function Insights() {
  return (
    <div className="toss-insights">
      <div className="toss-insights-hero">
        <div className="toss-insights-content">
          <h1>YouTube 데이터로 보는 인사이트</h1>
          <p className="toss-insights-subtitle">
            채널과 영상의 성과를 분석하여 성장 전략을 제시합니다
          </p>
        </div>
        <div className="toss-insights-illustration">
          <img src="/assets/images/insights-hero.svg" alt="" />
        </div>
      </div>

      <div className="toss-insights-grid">
        <div className="toss-insight-card">
          <div className="toss-insight-icon">📈</div>
          <h3>실시간 트렌드</h3>
          <p>인기 있는 키워드와 주제를 실시간으로 분석합니다</p>
        </div>
        <div className="toss-insight-card">
          <div className="toss-insight-icon">🎯</div>
          <h3>맞춤형 전략</h3>
          <p>채널 특성에 맞는 최적의 성장 전략을 제안합니다</p>
        </div>
        <div className="toss-insight-card">
          <div className="toss-insight-icon">📊</div>
          <h3>상세 분석</h3>
          <p>조회수, 구독자, 수익 등 핵심 지표를 분석합니다</p>
        </div>
      </div>
    </div>
  );
}

export default Insights; 
import React from 'react';

function Insights() {
  return (
    <div className="insights-page">
      <header className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">인사이트</h1>
          <p className="page-description">
            YouTube 트렌드와 성장 기회를 발견하세요
          </p>
        </div>
      </header>

      <div className="insights-content">
        <div className="insights-grid">
          <div className="insight-card featured">
            <div className="insight-header">
              <span className="insight-badge">주간 트렌드</span>
              <time className="insight-date">2024년 1월</time>
            </div>
            <h2 className="insight-title">
              쇼츠 콘텐츠의 성장세가 두드러집니다
            </h2>
            <p className="insight-description">
              지난 달 대비 쇼츠 콘텐츠의 조회수가 45% 증가했습니다. 특히 1분 이내의 짧은 콘텐츠가 높은 성과를 보이고 있습니다.
            </p>
            <div className="insight-stats">
              <div className="stat-item">
                <span className="stat-label">평균 조회수</span>
                <span className="stat-value">+45%</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">참여율</span>
                <span className="stat-value">12.3%</span>
              </div>
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-header">
              <span className="insight-badge">카테고리 분석</span>
            </div>
            <h3 className="insight-title">
              성장하는 카테고리 TOP 3
            </h3>
            <ul className="trend-list">
              <li className="trend-item">
                <span className="trend-rank">1</span>
                <span className="trend-name">테크</span>
                <span className="trend-value positive">+23%</span>
              </li>
              <li className="trend-item">
                <span className="trend-rank">2</span>
                <span className="trend-name">교육</span>
                <span className="trend-value positive">+18%</span>
              </li>
              <li className="trend-item">
                <span className="trend-rank">3</span>
                <span className="trend-name">요리</span>
                <span className="trend-value positive">+15%</span>
              </li>
            </ul>
          </div>

          <div className="insight-card">
            <div className="insight-header">
              <span className="insight-badge">시청자 분석</span>
            </div>
            <h3 className="insight-title">
              주요 시청 시간대
            </h3>
            <div className="time-chart">
              {/* 차트 컴포넌트 추가 예정 */}
              <div className="chart-placeholder">
                시간대별 시청자 분포 차트
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Insights; 
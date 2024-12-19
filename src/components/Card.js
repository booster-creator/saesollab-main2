import React from 'react';

function Card({ video, rank }) {
  const formatNumber = (num) => {
    return new Intl.NumberFormat('ko-KR').format(num);
  };

  return (
    <div className="card">
      <div className="card-rank">#{rank}</div>
      <div className="card-content">
        <h3 className="card-title">{video.title}</h3>
        <p className="card-channel">{video.channelTitle}</p>
        
        <div className="stats">
          <div className="stat">
            <span className="stat-label">조회수</span>
            <span className="stat-value">{formatNumber(video.viewCount)}</span>
          </div>
          <div className="stat">
            <span className="stat-label">좋아요</span>
            <span className="stat-value">{formatNumber(video.likeCount)}</span>
          </div>
          <div className="stat">
            <span className="stat-label">댓글</span>
            <span className="stat-value">{formatNumber(video.commentCount)}</span>
          </div>
          <div className="stat">
            <span className="stat-label">구독자</span>
            <span className="stat-value">{formatNumber(video.subscriberCount)}</span>
          </div>
        </div>

        <div className="meter">
          <div className="meter-header">
            <span>노출온도</span>
            <span className="meter-value">{video.tension}</span>
          </div>
          <div className="meter-bar">
            <div 
              className="meter-fill"
              style={{width: `${Math.min(video.tension * 100, 100)}%`}}
            />
          </div>
        </div>

        <div className="card-actions">
          <a 
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            동영상 보기
          </a>
          <button className="btn btn-primary">
            상세 분석
          </button>
        </div>
      </div>
    </div>
  );
}

export default Card; 
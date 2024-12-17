import React, { useState, useEffect } from 'react';
import axios from 'axios';

function YouTubeAnalyzer() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);

  // 검색 기록 로드
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    setSearchHistory(history);
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const response = await axios.post('/.netlify/functions/youtube', {
        query,
        maxResults: 30
      });
      setResults(response.data);

      // 검색 기록 업데이트
      const newHistory = [query, ...searchHistory.filter(item => item !== query)].slice(0, 5);
      setSearchHistory(newHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    } catch (error) {
      console.error('검색 실패:', error);
    }
    setLoading(false);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('ko-KR').format(num);
  };

  return (
    <div className="analyzer-modern">
      <div className="search-container">
        <div className="search-box">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="YouTube 검색어 입력"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch} disabled={loading}>
            {loading ? '검색 중...' : '검색'}
          </button>
        </div>
        
        {searchHistory.length > 0 && (
          <div className="search-history">
            <h3>최근 검색어</h3>
            <div className="history-tags">
              {searchHistory.map((term, index) => (
                <button
                  key={index}
                  className="history-tag"
                  onClick={() => {
                    setQuery(term);
                    handleSearch();
                  }}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="results-grid">
        {results.map((video, index) => (
          <div key={video.videoId} className="video-card">
            <div className="rank-badge">#{index + 1}</div>
            <div className="card-content">
              <h3 className="video-title">{video.title}</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-label">조회수</span>
                  <span className="stat-value">{formatNumber(video.viewCount)}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">좋아요</span>
                  <span className="stat-value">{formatNumber(video.likeCount)}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">댓글</span>
                  <span className="stat-value">{formatNumber(video.commentCount)}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">구독자</span>
                  <span className="stat-value">{formatNumber(video.subscriberCount)}</span>
                </div>
                <div className="stat-item highlight">
                  <span className="stat-label">노출온도</span>
                  <span className="stat-value">{video.tension}</span>
                </div>
              </div>
              <a href={video.url} target="_blank" rel="noopener noreferrer" className="watch-button">
                동영상 보기
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default YouTubeAnalyzer; 
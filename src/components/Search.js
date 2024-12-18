import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);

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
    <div className="search-page">
      <div className="search-header">
        <h1>YouTube 데이터 분석</h1>
        <p>채널과 영상의 성과를 실시간으로 분석하세요</p>
      </div>

      <div className="search-section">
        <div className="search-box">
          <div className="search-input-wrapper">
            <i className="search-icon">🔍</i>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="분석하고 싶은 YouTube 키워드를 입력하세요"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button 
            onClick={handleSearch} 
            disabled={loading || !query.trim()}
            className={loading ? 'loading' : ''}
          >
            {loading ? '분석 중...' : '분석하기'}
          </button>
        </div>

        {searchHistory.length > 0 && (
          <div className="search-history">
            <div className="history-header">
              <h3>최근 검색어</h3>
              <button className="clear-history" onClick={() => setSearchHistory([])}>
                전체 삭제
              </button>
            </div>
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
                  <span className="tag-icon">🕒</span>
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div className="results-section">
          <div className="results-header">
            <h2>분석 결과</h2>
            <div className="results-meta">
              <span>{results.length}개의 결과</span>
              <select className="sort-select">
                <option value="tension">노출온도 순</option>
                <option value="views">조회수 순</option>
                <option value="subscribers">구독자 순</option>
              </select>
            </div>
          </div>

          <div className="results-grid">
            {results.map((video, index) => (
              <div key={video.videoId} className="video-card">
                <div className="rank-badge">#{index + 1}</div>
                <div className="card-content">
                  <div className="video-info">
                    <h3 className="video-title">{video.title}</h3>
                    <p className="channel-name">{video.channelTitle}</p>
                  </div>
                  
                  <div className="stats-grid">
                    <div className="stat-item">
                      <span className="stat-icon">👁️</span>
                      <span className="stat-label">조회수</span>
                      <span className="stat-value">{formatNumber(video.viewCount)}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-icon">👍</span>
                      <span className="stat-label">좋아요</span>
                      <span className="stat-value">{formatNumber(video.likeCount)}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-icon">💬</span>
                      <span className="stat-label">댓글</span>
                      <span className="stat-value">{formatNumber(video.commentCount)}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-icon">👥</span>
                      <span className="stat-label">구독자</span>
                      <span className="stat-value">{formatNumber(video.subscriberCount)}</span>
                    </div>
                  </div>

                  <div className="tension-meter">
                    <div className="tension-label">
                      <span>노출온도</span>
                      <span className="tension-value">{video.tension}</span>
                    </div>
                    <div className="tension-bar">
                      <div 
                        className="tension-fill" 
                        style={{width: `${Math.min(video.tension * 100, 100)}%`}}
                      />
                    </div>
                  </div>

                  <div className="card-actions">
                    <a 
                      href={video.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="watch-button"
                    >
                      동영상 보기
                    </a>
                    <button className="analyze-button">
                      상세 분석
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <p>데이터를 분석하고 있습니다...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Search; 
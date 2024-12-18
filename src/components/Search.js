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
    <div className="toss-container">
      <div className="toss-header">
        <h1>YouTube 분석</h1>
        <p className="toss-subtitle">채널과 영상의 성과를 실시간으로 분석하세요</p>
      </div>

      <div className="toss-search-section">
        <div className="toss-search-box">
          <div className="toss-input-wrapper">
            <svg className="toss-search-icon" /* SVG 코드 *//>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="분석하고 싶은 YouTube 키워드를 입력하세요"
              className="toss-input"
            />
          </div>
          <button 
            className={`toss-button ${loading ? 'loading' : ''}`}
            onClick={handleSearch}
            disabled={loading || !query.trim()}
          >
            {loading ? (
              <span className="toss-loading-dots">
                <span>.</span><span>.</span><span>.</span>
              </span>
            ) : '분석하기'}
          </button>
        </div>

        {searchHistory.length > 0 && (
          <div className="toss-history">
            <div className="toss-history-header">
              <span className="toss-label">최근 검색어</span>
              <button className="toss-text-button" onClick={() => setSearchHistory([])}>
                전체 삭제
              </button>
            </div>
            <div className="toss-chips">
              {searchHistory.map((term, index) => (
                <button
                  key={index}
                  className="toss-chip"
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

      {results.length > 0 && (
        <div className="toss-results">
          <div className="toss-results-header">
            <div className="toss-results-info">
              <h2>분석 결과</h2>
              <span className="toss-results-count">{results.length}개의 결과</span>
            </div>
            <select className="toss-select">
              <option value="tension">노출온도 순</option>
              <option value="views">조회수 순</option>
              <option value="subscribers">구독자 순</option>
            </select>
          </div>

          <div className="toss-grid">
            {results.map((video, index) => (
              <div key={video.videoId} className="toss-card">
                <div className="toss-card-rank">#{index + 1}</div>
                <div className="toss-card-content">
                  <h3 className="toss-card-title">{video.title}</h3>
                  <p className="toss-card-channel">{video.channelTitle}</p>
                  
                  <div className="toss-stats">
                    <div className="toss-stat">
                      <span className="toss-stat-label">조회수</span>
                      <span className="toss-stat-value">{formatNumber(video.viewCount)}</span>
                    </div>
                    <div className="toss-stat">
                      <span className="toss-stat-label">좋아요</span>
                      <span className="toss-stat-value">{formatNumber(video.likeCount)}</span>
                    </div>
                    <div className="toss-stat">
                      <span className="toss-stat-label">댓글</span>
                      <span className="toss-stat-value">{formatNumber(video.commentCount)}</span>
                    </div>
                    <div className="toss-stat">
                      <span className="toss-stat-label">구독자</span>
                      <span className="toss-stat-value">{formatNumber(video.subscriberCount)}</span>
                    </div>
                  </div>

                  <div className="toss-meter">
                    <div className="toss-meter-header">
                      <span>노출온도</span>
                      <span className="toss-meter-value">{video.tension}</span>
                    </div>
                    <div className="toss-meter-bar">
                      <div 
                        className="toss-meter-fill"
                        style={{width: `${Math.min(video.tension * 100, 100)}%`}}
                      />
                    </div>
                  </div>

                  <div className="toss-actions">
                    <a 
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="toss-button-secondary"
                    >
                      동영상 보기
                    </a>
                    <button className="toss-button-primary">
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
        <div className="toss-overlay">
          <div className="toss-loading">
            <div className="toss-loading-spinner" />
            <p>데이터를 분석하고 있습니다</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Search; 
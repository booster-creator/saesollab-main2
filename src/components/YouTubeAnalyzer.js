import React, { useState } from 'react';
import axios from 'axios';

function YouTubeAnalyzer() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/.netlify/functions/youtube', {
        query,
        maxResults: 30
      });
      setResults(response.data);
    } catch (error) {
      console.error('검색 실패:', error);
    }
    setLoading(false);
  };

  return (
    <div className="analyzer-container">
      <div className="search-section">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="YouTube 검색어 입력"
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? '검색 중...' : '검색'}
        </button>
      </div>

      <div className="results-section">
        {results.map((video) => (
          <div key={video.videoId} className="video-card">
            <h3>{video.title}</h3>
            <div className="stats">
              <p>조회수: {video.viewCount}</p>
              <p>좋아요: {video.likeCount}</p>
              <p>구독자: {video.subscriberCount}</p>
            </div>
            <a href={video.url} target="_blank" rel="noopener noreferrer">
              동영상 보기
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default YouTubeAnalyzer; 
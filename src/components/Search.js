import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { analyzeKeyword, analyzeYouTubeData } from '../services/api';
import { db } from '../services/firebase';
import { collection, addDoc } from 'firebase/firestore';

function Search() {
  const { user } = useAuth();
  const [keyword, setKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [youtubeData, setYoutubeData] = useState(null);
  const [searchResults, setSearchResults] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    setIsLoading(true);
    setError(null);
    setResults(null);
    setSearchResults([]);

    try {
      console.log('Analyzing keyword:', keyword);
      const data = await analyzeKeyword(keyword);
      console.log('Analysis results:', data);
      setResults(data);

      if (data.youtubeData && Array.isArray(data.youtubeData)) {
        const formattedResults = data.youtubeData.map(item => ({
          title: item.video.title,
          views: item.video.viewCount,
          likes: item.video.likeCount,
          comments: item.video.commentCount,
          url: item.video.url,
          thumbnail: item.thumbnail,
          channelTitle: item.channel.title,
          publishedAt: item.video.publishedAt,
          tension: item.tension,
          tensionLevel: item.tensionLevel,
          tensionColor: item.tensionColor
        }));
        setSearchResults(formattedResults);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setError(error.message || '검색 중 오류가 발생했습니다.');
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  const renderSearchResults = () => {
    if (!searchResults.length) return null;
    
    return (
      <div className="youtube-results">
        <h3>관련 YouTube 영상</h3>
        {searchResults.map((video, index) => (
          <div key={index} className="video-item" style={{ borderLeft: `4px solid ${video.tensionColor}` }}>
            <img src={video.thumbnail} alt={video.title} className="video-thumbnail" />
            <div className="video-info">
              <h4>{video.title}</h4>
              <p className="channel-title">{video.channelTitle}</p>
              <div className="video-stats">
                <span>조회수: {video.views?.toLocaleString() || '0'}</span>
                <span>좋아요: {video.likes?.toLocaleString() || '0'}</span>
                <span>댓글: {video.comments?.toLocaleString() || '0'}</span>
                <span className="tension-badge" style={{ backgroundColor: video.tensionColor }}>
                  노출 온도: {video.tensionLevel || '측정 중'}
                </span>
              </div>
              <div className="engagement-stats">
                <span>구독자 대비 조회수: {video.metrics.subscriberViewRatio}</span>
                <span>상호작용률: {((video.likes + video.comments) / video.views * 100).toFixed(2)}%</span>
              </div>
              <a href={video.url} target="_blank" rel="noopener noreferrer" className="video-link">
                영상 보기
              </a>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="search-page">
      <header className="search-header">
        <h1>검색 분석</h1>
        <p>YouTube 검색 데이터를 분석하여 채널 성장에 도움이 되는 인사이트를 제공합니다</p>
      </header>

      <form className="search-form" onSubmit={handleSubmit}>
        <div className="search-input-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="분석하고 싶은 키워드를 입력하세요"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            disabled={isLoading}
          />
          {keyword && (
            <button 
              type="button" 
              className="clear-button"
              onClick={() => setKeyword('')}
            >
              ✕
            </button>
          )}
        </div>
        <button 
          type="submit" 
          className="search-button"
          disabled={isLoading || !keyword.trim()}
        >
          {isLoading ? '분석 중...' : '분석하기'}
        </button>
      </form>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {results && (
        <>
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-header">
                <h3>검색량</h3>
                <span className="metric-badge">실시간</span>
              </div>
              <div className="metric-value">{results.searchVolume}</div>
              <div className="metric-trend">
                <span className="trend-value positive">+{results.volumeGrowth}</span>
                <span className="trend-label">지난달 대비</span>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <h3>경쟁 강도</h3>
              </div>
              <div className="metric-value">{results.competition}</div>
              <p className="metric-description">
                현재 약 {results.competitorCount.toLocaleString()}개의 채널이 해당 키워드로 활동 중입니다
              </p>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <h3>연관 키워드</h3>
              </div>
              <div className="keyword-list">
                {results.relatedKeywords.map((keyword, index) => (
                  <span key={index} className="keyword-tag">{keyword}</span>
                ))}
              </div>
            </div>

            {youtubeData && (
              <div className="metric-card youtube-analysis">
                <div className="metric-header">
                  <h3>YouTube 분석</h3>
                </div>
                <div className="youtube-metrics">
                  <div className="metric-item">
                    <span className="label">조회수</span>
                    <span className="value">{youtubeData.video.viewCount.toLocaleString()}</span>
                  </div>
                  <div className="metric-item">
                    <span className="label">구독자 수</span>
                    <span className="value">{youtubeData.channel.subscriberCount.toLocaleString()}</span>
                  </div>
                  <div className="metric-item">
                    <span className="label">구독자 대비 조회수</span>
                    <span className="value" data-type="ratio">{youtubeData.metrics.subscriberViewRatio}</span>
                  </div>
                  <div className="metric-item">
                    <span className="label">조회수 대비 좋아요</span>
                    <span className="value" data-type="ratio">{youtubeData.metrics.viewLikeRatio}</span>
                  </div>
                  <div className="metric-item">
                    <span className="label">조회수 대비 댓글</span>
                    <span className="value" data-type="ratio">{youtubeData.metrics.viewCommentRatio}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          {renderSearchResults()}
        </>
      )}
    </div>
  );
}

export default Search; 
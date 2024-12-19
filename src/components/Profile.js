import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { formatDate } from '../utils/dateUtils';
import { getRecentSearches } from '../services/supabase';

function Profile() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    searchCount: 42,
    savedKeywords: ['브이로그', '일상', '먹방', '게임', '리뷰'],
    recentSearches: [
      { keyword: '브이로그', date: new Date(Date.now() - 1000 * 60 * 5) },  // 5분 전
      { keyword: '일상 브이로그', date: new Date(Date.now() - 1000 * 60 * 60 * 2) },  // 2시간 전
      { keyword: '먹방', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) },  // 2일 전
    ]
  });
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    async function loadSearchHistory() {
      try {
        const history = await getRecentSearches(user.uid);
        setSearchHistory(history);
      } catch (error) {
        console.error('Failed to load search history:', error);
      }
    }

    if (user) {
      loadSearchHistory();
    }
  }, [user]);

  return (
    <div className="profile">
      <header className="profile-header">
        <div className="profile-info">
          <img src={user.photoURL} alt="" className="profile-avatar" />
          <div>
            <h1>{user.displayName}</h1>
            <p>{user.email}</p>
          </div>
        </div>
      </header>

      <div className="profile-content">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>검색 횟수</h3>
            <div className="stat-value">{stats.searchCount}</div>
          </div>

          <div className="stat-card">
            <h3>저장된 키워드</h3>
            <div className="keyword-list">
              {stats.savedKeywords.map((keyword, index) => (
                <span key={index} className="keyword-tag">{keyword}</span>
              ))}
            </div>
          </div>

          <div className="stat-card">
            <h3>최근 검색</h3>
            <div className="search-history">
              {searchHistory.map((search, index) => (
                <div key={index} className="history-item">
                  <span>{search.keyword}</span>
                  <time>{formatDate(search.date)}</time>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile; 
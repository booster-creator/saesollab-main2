import React from 'react';
import { useAuth } from '../contexts/AuthContext';

function MyPage() {
  const { user } = useAuth();

  return (
    <div className="mypage">
      <h1>마이페이지</h1>
      <div className="profile-section">
        {/* 프로필 정보 */}
      </div>
      <div className="history-section">
        <h2>최근 검색 기록</h2>
        {/* 검색 기록 표시 */}
      </div>
    </div>
  );
}

export default MyPage; 
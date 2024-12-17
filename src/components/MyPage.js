import React from 'react';
import { useAuth } from '../contexts/AuthContext';

function MyPage() {
  const { user } = useAuth();

  return (
    <div className="mypage">
      <h1>마이페이지</h1>
      <div className="profile-section">
        <h2>프로필 정보</h2>
        {user && (
          <div className="profile-info">
            <p>이메일: {user.email}</p>
            {/* 추가 사용자 정보 표시 */}
          </div>
        )}
      </div>
      <div className="history-section">
        <h2>최근 검색 기록</h2>
        {/* 검색 기록 표시 */}
      </div>
    </div>
  );
}

export default MyPage; 
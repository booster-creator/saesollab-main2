import React from 'react';
import { useAuth } from '../contexts/AuthContext';

function MyPage() {
  const { user } = useAuth();

  return (
    <div className="toss-mypage">
      <div className="toss-profile-header">
        <div className="toss-profile-info">
          <img src={user.picture} alt={user.name} className="toss-profile-avatar" />
          <div>
            <h1>{user.name}</h1>
            <p>{user.email}</p>
          </div>
        </div>
      </div>

      <div className="toss-profile-content">
        <section className="toss-history">
          {/* 검색 기록 */}
        </section>

        <section className="toss-settings">
          {/* 설정 */}
        </section>
      </div>
    </div>
  );
}

export default MyPage; 
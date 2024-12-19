import React from 'react';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const { loginWithGoogle } = useAuth();

  return (
    <div className="login">
      <div className="logo">
        <div className="check-icon" />
        <span>Beta</span>
      </div>

      <h1>
        데이터로 시작하는<br />
        YouTube 채널 성장
      </h1>

      <p>
        AI 기반 검색 데이터 분석으로<br />
        채널 성장에 필요한 인사이트를 제공합니다
      </p>

      <button onClick={loginWithGoogle}>
        <img src="/assets/images/google-logo.svg" alt="" />
        Google로 시작하기
      </button>

      <small>
        계속 진행하면 서비스 약관과 개인정보 처리방침에 동의하는 것으로 간주됩니다
      </small>
    </div>
  );
}

export default Login; 
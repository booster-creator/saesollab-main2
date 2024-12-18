import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/.netlify/functions/google-login', {
        credential: credentialResponse.credential,
      });
      
      localStorage.setItem('token', response.data.token);
      login(response.data.user);
      navigate('/home');
    } catch (error) {
      console.error('구글 로그인 실패:', error);
      setError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-content">
          <div className="login-header">
            <img src="/assets/images/logo.svg" alt="콘텐츠랩" className="logo" />
            <h1>콘텐츠랩</h1>
            <p className="subtitle">YouTube 데이터 분석 플랫폼</p>
          </div>
          <div className="login-features">
            <div className="feature">
              <div className="feature-icon">📈</div>
              <h3>실시간 분석</h3>
              <p>채널과 영상의 성과를 실시간으로 분석하세요</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🎯</div>
              <h3>맞춤 인사이트</h3>
              <p>데이터 기반의 맞춤형 인사이트를 제공합니다</p>
            </div>
          </div>
        </div>
      </div>
      <div className="login-right">
        <div className="login-box">
          <h2>시작하기</h2>
          <p className="login-description">
            간편하게 시작하고 강력한 분석 도구를 경험하세요
          </p>
          <div className="social-login">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('로그인 실패')}
              useOneTap
              theme="filled_blue"
              size="large"
              shape="pill"
              locale="ko"
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className="terms">
            <p>계속 진행하면 <a href="#">서비스 약관</a>과</p>
            <p><a href="#">개인정보 처리방침</a>에 동의하는 것으로 간주됩니다</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login; 
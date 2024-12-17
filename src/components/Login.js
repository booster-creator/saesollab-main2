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
      <div className="login-background">
        <img src="/assets/images/pattern.svg" alt="" className="pattern-bg" />
      </div>
      
      <div className="login-container">
        <div className="login-content">
          <div className="login-header">
            <img src="/assets/images/logo.svg" alt="콘텐츠랩" className="logo" />
            <h1>콘텐츠랩</h1>
            <p>YouTube 데이터 분석 플랫폼</p>
          </div>

          <div className="login-box">
            <div className="feature-highlights">
              <div className="feature-item">
                <img src="/assets/images/analysis.svg" alt="" />
                <h3>데이터 분석</h3>
                <p>YouTube 채널과 영상의 성과를 분석하세요</p>
              </div>
              <div className="feature-item">
                <img src="/assets/images/insights.svg" alt="" />
                <h3>인사이트 도출</h3>
                <p>데이터 기반의 인사이트를 얻어보세요</p>
              </div>
            </div>

            <div className="login-action">
              <h2>시작하기</h2>
              <p className="login-description">
                Google 계정으로 간편하게 시작하세요
              </p>
              {error && <div className="error-message">{error}</div>}
              <div className="google-login-button">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError('로그인 실패. 다시 시도해주세요.')}
                  useOneTap
                  theme="filled_black"
                  shape="pill"
                  size="large"
                  text="signin_with"
                  locale="ko"
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
    </div>
  );
}

export default Login; 
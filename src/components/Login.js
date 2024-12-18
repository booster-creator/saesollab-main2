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
          <div className="login-illustration">
            <img src="/assets/images/analysis-illustration.svg" alt="" />
          </div>
          <div className="login-text">
            <h2>YouTube 데이터 분석으로</h2>
            <h2>채널 성장을 가속화하세요</h2>
            <p>지금 시작하고 인사이트를 얻어보세요</p>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-form">
          <h1>시작하기</h1>
          <div className="social-login">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('로그인 실패. 다시 시도해주세요.')}
              useOneTap
              theme="outline"
              size="large"
              text="signin_with"
              shape="rectangular"
              locale="ko"
              disabled={loading}
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className="terms-text">
            <p>계속 진행하면 콘텐츠랩의 <a href="#">서비스 약관</a>과</p>
            <p><a href="#">개인정보 처리방침</a>에 동의하는 것으로 간주됩니다.</p>
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
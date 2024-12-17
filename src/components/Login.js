import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

function Login({ onLoginSuccess }) {
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post('/.netlify/functions/google-login', {
        credential: credentialResponse.credential,
      });
      
      localStorage.setItem('token', response.data.token);
      onLoginSuccess();
    } catch (error) {
      console.error('구글 로그인 실패:', error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>콘텐츠랩</h1>
          <p>YouTube 데이터 분석 플랫폼</p>
        </div>
        <div className="login-box">
          <h2>시작하기</h2>
          <p className="login-description">
            YouTube 채널 분석을 위해 로그인해주세요
          </p>
          <div className="google-login-button">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => console.error('구글 로그인 실패')}
              useOneTap
              theme="filled_black"
              shape="pill"
              size="large"
              text="signin_with"
              locale="ko"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login; 
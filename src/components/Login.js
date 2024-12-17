import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

function Login() {
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // Netlify 함수 엔드포인트 사용
      const response = await axios.post('/.netlify/functions/google-login', {
        credential: credentialResponse.credential,
      });
      
      localStorage.setItem('token', response.data.token);
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('구글 로그인 실패:', error);
    }
  };

  const handleGoogleError = () => {
    console.error('구글 로그인 실패');
  };

  return (
    <div className="login-container">
      <h2>로그인</h2>
      <div className="google-login-button">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          useOneTap
        />
      </div>
    </div>
  );
}

export default Login; 
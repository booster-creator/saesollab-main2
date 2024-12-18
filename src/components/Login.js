import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post('/.netlify/functions/google-login', {
        credential: credentialResponse.credential,
      });
      
      localStorage.setItem('token', response.data.token);
      login(response.data.user);
      navigate('/');
    } catch (error) {
      console.error('구글 로그인 실패:', error);
    }
  };

  return (
    <div className="login-container">
      <header className="header">
        <div className="logo-container">
          <img src="/assets/images/logo.svg" alt="DontuLab 로고" className="logo" />
          <span>DontuLab</span>
        </div>
      </header>
      
      <main>
        <section className="login-section">
          <h1 className="login-title">계정에 로그인</h1>
          <p className="login-description">Google 계정을 통해 편리하게 로그인하세요.</p>
          
          <div className="social-login">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => console.log('Login Failed')}
              useOneTap
              theme="outline"
              size="large"
              text="signin_with"
              shape="rectangular"
              locale="ko"
              width="100%"
            />
          </div>

          <hr className="divider" />

          <div className="additional-links">
            <a href="/about" className="about-link">회사 소개</a>
            <a href="/support" className="support-link">고객지원</a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <nav className="footer-nav">
          <ul>
            <li><a href="/about">회사 소개</a></li>
            <li><a href="/support">고객지원</a></li>
            <li><a href="/policy">이용약관</a></li>
            <li><a href="/privacy">개인정보처리방침</a></li>
          </ul>
        </nav>
        <p className="copyright">© 2024 DontuLab. 모든 권리 보유.</p>
      </footer>
    </div>
  );
}

export default Login; 
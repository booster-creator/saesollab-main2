import React, { useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from './components/Login';
import YouTubeAnalyzer from './components/YouTubeAnalyzer';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <div className="app">
        {!isLoggedIn ? (
          <Login onLoginSuccess={() => setIsLoggedIn(true)} />
        ) : (
          <YouTubeAnalyzer />
        )}
      </div>
    </GoogleOAuthProvider>
  );
}

export default App; 
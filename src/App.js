import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      {/* 기존 앱 컴포넌트들 */}
    </GoogleOAuthProvider>
  );
}

export default App; 
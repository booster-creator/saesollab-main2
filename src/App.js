import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './components/Login';
import Home from './components/Home';
import Search from './components/Search';
import Insights from './components/Insights';
import MyPage from './components/MyPage';
import PrivateRoute from './components/PrivateRoute';

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <PrivateRoute>
                <Layout>
                  <Home />
                </Layout>
              </PrivateRoute>
            } />
            <Route path="/search" element={
              <PrivateRoute>
                <Layout>
                  <Search />
                </Layout>
              </PrivateRoute>
            } />
            <Route path="/insights" element={
              <PrivateRoute>
                <Layout>
                  <Insights />
                </Layout>
              </PrivateRoute>
            } />
            <Route path="/mypage" element={
              <PrivateRoute>
                <Layout>
                  <MyPage />
                </Layout>
              </PrivateRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App; 
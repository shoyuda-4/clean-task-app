import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import LoginPage from './components/LoginPage';
import Layout from './components/Layout';
import TaskPage from './components/TaskPage';
import TaskEditPage from './components/TaskEditPage';
import UserProfilePage from './components/UserProfilePage';
import TaskCreatePage from './components/TaskCreatePage';
import TopPage from './components/TopPage';
import SignUpPage from './components/SignUpPage';
import CheckEmailPage from './components/CheckEmailPage';

// Supabase クライアントの作成
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_API_KEY
);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      const token = localStorage.getItem('supabase_token');
      const refreshToken = localStorage.getItem('supabase_refresh_token');

      if (!token || !refreshToken) {
        console.log('No valid token found in localStorage');
        setLoading(false);
        return;
      }

      try {
        console.log('Setting session with token:', token);

        // `access_token` と `refresh_token` を使用してセッションを設定
        const { data: session, error } = await supabase.auth.setSession({
          access_token: token,
          refresh_token: refreshToken
        });

        if (error) {
          console.error('Error setting session:', error);
        } else {
          console.log('Session set successfully:', session);
          setUser(session?.user);
        }
      } catch (err) {
        console.error('Error during session setting:', err);
      }

      setLoading(false);
    };

    loadSession();

    // ログイン状態の監視
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          setUser(session.user);
          console.log('Auth state changed: User logged in', session);
          localStorage.setItem('supabase_token', session.access_token);
          localStorage.setItem('supabase_refresh_token', session.refresh_token);
        } else {
          setUser(null);
          console.log('Auth state changed: User logged out');
          localStorage.removeItem('supabase_token');
          localStorage.removeItem('supabase_refresh_token');
        }
      }
    );

    // クリーンアップ: コンポーネントのアンマウント時にリスナーを解除
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // 定期的にセッションを更新（例: 30分ごと）
  useEffect(() => {
    const interval = setInterval(async () => {
      console.log('Refreshing session...');
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error('Error refreshing session:', error);
        setUser(null);
        localStorage.removeItem('supabase_token');
        localStorage.removeItem('supabase_refresh_token');
      } else {
        console.log('Session refreshed successfully:', data.session);
        localStorage.setItem('supabase_token', data.session.access_token);
        localStorage.setItem('supabase_refresh_token', data.session.refresh_token);
        setUser(data.session.user);
      }
    }, 30 * 60 * 1000); // 30分ごとに実行

    return () => clearInterval(interval);
  }, []);
  
  

  // ローディング中は何も表示しない、もしくはローディングメッセージを表示
  if (loading) {
    return <div>Loading...</div>;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <Router>
      <Layout user={user} handleLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<TopPage />} />
        <Route path="/login" element={user ? <Navigate to="/tasks" /> : <LoginPage />} />
        <Route path="/signup" element={user ? <Navigate to="/tasks" /> : <SignUpPage />} />
        <Route path="/tasks" element={user ? <TaskPage /> : <Navigate to="/login" />} />
        <Route path="/tasks/edit/:taskId" element={user ? <TaskEditPage /> : <Navigate to="/login" />} />
        <Route path="/profile" element={user ? <UserProfilePage /> : <Navigate to="/login" />} />
        <Route path="/tasks/create" element={user ? <TaskCreatePage /> : <Navigate to="/login" />} />
        <Route path="/check-email" element={<CheckEmailPage />}/>
      </Routes>
    </Router>
  );
}

export default App;

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); 
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // サインアップリクエストを送る
    const response = await fetch('http://localhost:3000/signin', {  // サーバーのエンドポイント（例: '/signup'）
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      // サインアップ成功
      console.log('User login:', data.user);
      localStorage.setItem('supabase_token', data.token);
      localStorage.setItem('supabase_refresh_token', data.refresh_token);
      
      window.location.reload();
    } else {
      // サインアップ失敗
      setError(data.error || 'Something went wrong');
    }

    setLoading(false);
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'wait...' : 'Login'}
        </button>
      </form>
      <Link to="/signup">新規登録ページへ</Link>
    </div>
  );
}

export default LoginPage;

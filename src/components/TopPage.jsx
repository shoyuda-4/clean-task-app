import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function TopPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    // ここで実際に認証処理を行う
    console.log('Logging in with:', email, password);
    // ログイン成功後にタスクページへ遷移
    navigate('/tasks');
  };

  return (
    <div>
      <h1>TopPage</h1>
      <button onClick={() => navigate('/login')}>Login</button>
      <button onClick={() => navigate('/signup')}>Sign Up</button>
    </div>
  );
}

export default TopPage;
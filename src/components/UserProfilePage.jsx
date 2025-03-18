import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function UserProfilePage() {
  const [user, setUser] = useState(null); // ユーザー情報を管理するステート
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // ここでは仮のユーザー情報を使用しています。
    // 実際には、Supabaseなどでユーザー情報を取得します。
    const fetchedUser = { id: 1, email: 'user@example.com' }; // 仮のデータ
    setUser(fetchedUser);
    setEmail(fetchedUser.email);
  }, []);

  const handleSave = () => {
    console.log('User profile updated:', email);
    // 実際のAPIを呼んで、ユーザー情報を更新します。
    navigate('/tasks'); // 更新後にタスクページに遷移
  };

  return (
    <div>
      <h1>User Profile</h1>
      {user ? (
        <div>
          <p>Email: {user.email}</p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Update your email"
          />
          <button onClick={handleSave}>Save Changes</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default UserProfilePage;

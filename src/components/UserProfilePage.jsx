import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function UserProfilePage({ handleDeleteUser }) {
  const [user, setUser] = useState(null); // ユーザー情報を管理するステート
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const { userId } = useParams();

  useEffect(() => {
    async function fetchUser() {
      const response = await fetch(`http://localhost:3000/${userId}`);
      const data = await response.json();
      setUser(data);
      setEmail(data.email);
    }
    fetchUser();
  }, []);

  return (
    <div>
      <h1>User Profile</h1>
      {user ? (
        <div>
          <button onClick={handleDeleteUser}>Delete User</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default UserProfilePage;

import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ user, handleLogout }) => {
  return (
    <nav style={{ display: "flex", justifyContent: "space-between", padding: "10px", background: "#eee" }}>
      <div>
      {user ? (
          <Link to={`/${user.id}`}>Profile</Link>
        ) : (
          <span>Profile</span>  // ログイン前はリンクを表示しない
        )}
        {' | '}
        <Link to="/tasks">Tasks</Link>
      </div>
      <div>
        {user ? (
          <button onClick={handleLogout}>ログアウト</button>
        ) : (
          <Link to="/login">ログイン</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

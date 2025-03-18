import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ user, handleLogout }) => {
  return (
    <nav style={{ display: "flex", justifyContent: "space-between", padding: "10px", background: "#eee" }}>
      <div>
        <Link to="/">Home</Link> | 
        <Link to="/profile">Profile</Link> | 
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

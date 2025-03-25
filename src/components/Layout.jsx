import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = ({ user, handleLogout }) => {
  const location = useLocation(); // 現在の URL を取得

  return (
    <div>
      {location.pathname !== "/login" && location.pathname !== "/" && location.pathname !== "/signup" && location.pathname !== "/check-email" && <Navbar user={user} handleLogout={handleLogout} />}
    </div>
  );
};

export default Layout;

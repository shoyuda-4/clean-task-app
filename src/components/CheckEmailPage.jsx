import React from 'react';
import { Link } from "react-router-dom";

function CheckEmailPage() {
  return (
    <div>
      <h1>Check Email</h1>
      <p>メールのリンクを押した後でログインをしてください</p>
      <Link to="/login">ログインページへ</Link>
    </div>
  );
}

export default CheckEmailPage;
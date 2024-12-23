import React, { useState, useEffect } from 'react';

const App = () => {
  const [getData, setGetData] = useState(null); // GETリクエストのデータ
  const [postData, setPostData] = useState(null); // POSTリクエストのレスポンスデータ

  // Hono サーバーの GET エンドポイントからデータを取得
  useEffect(() => {
    fetch('http://localhost:3000/api/hello') // Hono サーバーのエンドポイント
      .then((response) => response.json())
      .then((data) => setGetData(data))
      .catch((error) => console.error('GETリクエストのエラー:', error));
  }, []);

  // Hono サーバーの POST エンドポイントにデータを送信
  const handlePostRequest = () => {
    fetch('http://localhost:3000/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'React User', age: 25 }), // 送信するデータ
    })
      .then((response) => response.json())
      .then((data) => setPostData(data))
      .catch((error) => console.error('POSTリクエストのエラー:', error));
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Honoとの連携例</h1>

      {/* GETリクエストの結果を表示 */}
      <section style={{ marginBottom: '20px' }}>
        <h2>GET リクエスト結果:</h2>
        {getData ? (
          <p>メッセージ: {getData.message}</p>
        ) : (
          <p>データを取得中...</p>
        )}
      </section>

      {/* POSTリクエストの結果を表示 */}
      <section>
        <h2>POST リクエスト結果:</h2>
        <button onClick={handlePostRequest} style={{ padding: '10px 20px', cursor: 'pointer' }}>
          データを送信
        </button>
        {postData && (
          <div style={{ marginTop: '10px' }}>
            <p>受信データ:</p>
            <pre style={{ background: '#f4f4f4', padding: '10px', borderRadius: '5px' }}>
              {JSON.stringify(postData, null, 2)}
            </pre>
          </div>
        )}
      </section>
    </div>
  );
};

export default App;

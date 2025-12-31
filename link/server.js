const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const app = express();

// 1. 資料庫連線設定
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Render PostgreSQL 必須開啟 SSL
});

app.use(express.json());

// 2. 讓伺服器可以讀取你的 HTML/CSS/JS 檔案 (靜態檔案)
app.use(express.static(path.join(__dirname, '.')));

// 3. 建立一個 API 路由來測試資料庫
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()'); // 取得資料庫目前時間
    res.json({ success: true, time: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. 設定啟動 Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`伺服器啟動於 port ${PORT}`);
});
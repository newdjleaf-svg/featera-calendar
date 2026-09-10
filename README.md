# FEATERA 行事曆排程系統 — Railway PostgreSQL 雲端版

## Railway 必要變數
在 `featera-calendar → Variables` 確認：

- `DATABASE_URL=${{Postgres.DATABASE_URL}}`
- `ADMIN_USER=Featera`（可自行更改）
- `ADMIN_PASSWORD=請設定強密碼`
- `SESSION_SECRET=請設定一串長隨機字串`

`DATABASE_URL` 已存在且正確時不要重複新增。

## 雲端同步
- `server.js` 啟動時自動建立 `featera_calendar_state` 資料表。
- 管理員登入後自動下載 PostgreSQL 最新資料。
- 管理員修改並儲存時，資料會自動同步到 PostgreSQL。
- 訪客登入後自動讀取 PostgreSQL 最新資料，沒有寫入權限。
- 「雲端」按鈕仍可手動立即上傳或重新下載。

## 第一次部署
1. 將本專案內容推送到 GitHub repository 根目錄。
2. Railway 會依 `package.json` 執行 `npm start`。
3. 第一次啟動會自動建表。
4. 管理員第一次登入時，如果雲端尚無資料，會將目前裝置資料初始化到 PostgreSQL。

## 健康檢查
部署後開啟 `/api/health`，正常應回傳：
`{"ok":true,"database":true}`

## 安全
管理員密碼不再寫在瀏覽器端程式中。請在 Railway Variables 管理帳密，不要將資料庫密碼寫入 `app.js`。

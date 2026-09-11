# FEATERA 行事曆排程系統 v9.0

Railway + PostgreSQL 雲端版。v9.0 新增「音控排程專區」，與講師/主持人完全分開，並使用獨立音控權限。

## Railway Variables

既有：
- `DATABASE_URL=${{Postgres.DATABASE_URL}}`
- `ADMIN_USER`
- `ADMIN_PASSWORD`
- `SESSION_SECRET`

音控帳號預設即可使用：
- 帳號：`featera_dj`
- 密碼：`featera168`

若要改音控帳密，可另外在 Railway Variables 設定：
- `DJ_USER`
- `DJ_PASSWORD`

## v9.0 音控功能

- 獨立音控登入與權限。
- 音控帳號只能更新 `/api/audio-state`，不能寫入主行事曆 `/api/state`。
- 音控名單可新增、刪除、依地區分類，一人可支援多區。
- 音控排程與主行事曆共用同一 Railway PostgreSQL 資料庫，但以獨立資料列保存，避免互相覆蓋。
- 排程前自動檢查「音控不可與當日同區主持人為同一人」。
- 音控表的標題、欄位文字、星期名稱、主要配色均可設定。
- 每一筆音控文字可手動改字、字級、顏色、左/中/右、粗體、斜體、底線。
- 可匯出 PNG；支援 Web Share 的手機/瀏覽器可直接分享到通訊軟體或 Email，否則下載 PNG。
- 2026/09 預載畫面中的音控名單與範例排程，之後可完全自行修改。

## GitHub / Railway 更新

將本 ZIP 內所有檔案覆蓋 GitHub repository 根目錄後 Commit。若 Railway 沒有自動抓到最新 commit，使用 Railway 的 **Deploy Latest Commit**。

線上 `index.html` 可搜尋 `9.0.0` 確認已部署最新版。


## v10.0 台灣國定假日
- 依行政院人事行政總處辦公日曆表內建 2026、2027 國定假日、補假與連假。
- 系統假日於畫面與 PNG 匯出自動顯示，不覆蓋手動假日。
- 可於「系統設定」開關自動假日；顏色沿用「星期 / 日期配色」的國定假日顏色。
- 音控擔任表同步顯示系統假日。

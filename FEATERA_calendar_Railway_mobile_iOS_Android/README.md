# FEATERA Calendar App

## 功能
- 固定 16:9 橫式行事曆輸出
- 日期版面固定 7 欄 × 5 列（35 格）
- 地區切換：台灣 / 中國廈門
- 2026 年官方國定假日自動切換
- 中國廈門 2026 調休上班日也會標示
- 自訂年月大標題
- 新增 / 修改 / 刪除行程
- 行程標題與內容可個別設定字體大小
- 匯出 PNG 時功能列不會進入出圖範圍

## 重要：7×5 固定版面
固定 35 格會從「包含當月 1 日的星期一」開始連續顯示 35 天。
少數自然月曆需要第 6 週的月份，月底最後幾天可能不在該月的 7×5 畫面內；可切換到下一個月查看。

## 2026 假日資料來源
- 台灣：行政院人事行政總處 115 年（2026）政府行政機關辦公日曆表。
- 中國廈門：國務院辦公廳 2026 年部分節假日安排通知。

2027 年之後的實際假日安排需待官方公布後，再加入 `public/app.js` 的 `HOLIDAY_DATA`。

## Railway 部署
1. 將整個專案上傳到 GitHub Repository。
2. Railway 建立 New Project。
3. 選擇 Deploy from GitHub Repo。
4. 選擇此 Repository。
5. Railway 會自動執行 `npm install` 與 `npm start`。
6. 在 Railway Settings / Networking 建立 Public Domain。

## 資料儲存
目前使用瀏覽器 localStorage，因此同一瀏覽器會保留資料，但不同裝置不會同步。

## iOS / Android 手機版
- 會自動偵測 iPhone / iPad / Android，套用不同的手機操作列與 Safe Area 版面。
- 行事曆 PNG 區域仍維持橫式 16:9；手機上可左右滑動查看，不會壓扁輸出圖片。
- `分享` 會產生 PNG 預覽，再透過 Web Share API 呼叫手機原生分享面板，可選擇裝置上已安裝且支援分享的通訊 App。
- iOS 瀏覽器基於系統安全權限，純網頁無法保證「一鍵直接寫入照片圖庫」。本 APP 提供圖片預覽、長按儲存與 iOS 系統分享面板；可在系統提供選項時選「儲存影像」。
- Android 的 `儲存圖片` 會下載 PNG 到裝置；Android 相簿/Google Photos 是否立即索引下載檔案由裝置與瀏覽器決定。
- Web Share API 需要 HTTPS；Railway 公開網域預設提供 HTTPS。

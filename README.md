# FEATERA 專用行事曆排程 Web App

## 主要功能
- 月曆版面參考公司既有樣式，跨月日期留白。
- 管理員 / 訪客模式；訪客唯讀，可匯出 PNG / 分享。
- 每筆行程可新增多行文字，每一行獨立設定：字體大小、顏色、對齊、粗體、斜體、底線。
- 大標題、副標題、公司營業時間、客服電話、各分公司地址/電話/FAX皆可修改。
- Logo 可自行上傳並儲存。
- 講師、主持人、音控名單可新增修改；講師星級 1～3 星；經銷商聘級依 SM→GM→PM→SD→GD→PD→SP→GP→PP→DP→DDP。
- 每日行程可記錄區域、課程類型、講師、主持人、音控、人數、備註。
- 「三個月排程檢查」會依附件規則提示異常。
- 匯出 PNG 為 A4 橫式比例，匯出時隱藏功能按鈕；支援 Web Share API 的裝置可直接分享。
- 預設 LocalStorage；可設定 Supabase URL + anon key 做雲端同步。

## 預設登入
- 帳號：`Featera`
- 密碼：`featera168`

## 本機開啟
不要直接雙擊 index.html（部分瀏覽器會限制 fetch seed.json）。建議在資料夾內執行：

```bash
python3 -m http.server 8080
```
然後開啟 `http://localhost:8080`。

## GitHub Pages
把此資料夾所有檔案放到 repository 根目錄，Pages 的 Source 選 Deploy from a branch 即可。

## Supabase 雲端同步
1. 建立 Supabase project。
2. 在 SQL Editor 執行 `supabase-schema.sql`。
3. App 以管理員登入 → 系統設定 → 填入 Project URL 與 anon key → 儲存。
4. 點右上「雲端」即可上傳/下載同步。

注意：目前採簡化 RLS，適合公司內部使用；若公開網路使用，建議改成 Supabase Auth + 角色權限。

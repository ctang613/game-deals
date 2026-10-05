# 打機佬

香港 Steam、Nintendo Switch、PlayStation 今晚特價同消息。靜態頁，GitHub Pages 由 `main` 根目錄提供。

**線上：** https://ctang613.github.io/game-deals/

畫面只讀 `data.json`。平台篩選係 `all`、`steam`、`switch`、`ps`（網址 hash：`#steam`、`#switch`、`#ps`）。

## 點更新

改 `data.json` 就得，唔使 build。

- `region` / `currency`：而家係 `HK`、`HKD`。畫面會顯示「香港 · HKD」同每張卡上嘅 HK 標
- `news[]`：`platform` 用 `steam`、`switch` 或 `ps`。`image` 係封面網址（https），冇圖或者載入失敗會出平台色塊
- `deals[]`：`discount` 係整數百分比，`price` / `was` 用 `HK$`。`image` 同樣係封面網址
- `ends` 冇截止日期就放 `null`
- `.nojekyll` 令 Pages 唔好行 Jekyll，`data.json` 先會原樣送出

## 2026-10-05 資料

- Steam 港區價：當日 `store.steampowered.com` appdetails，封面用 Steam CDN
- Switch／PS：香港商店頁嘅港幣價同連結，封面用 Steam、PlayStation 或文章圖片
- 薩爾達 40 週年主機消息標「日本」，其餘消息標 HK

買之前再對一次商店頁。

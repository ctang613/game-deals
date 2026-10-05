# 打機佬

Steam、Nintendo Switch、PlayStation 今晚特價同消息。靜態頁，GitHub Pages 由 `main` 根目錄提供。

**線上：** https://ctang613.github.io/game-deals/

畫面只讀 `data.json`。平台篩選係 `all`、`steam`、`switch`、`ps`（網址 hash：`#steam`、`#switch`、`#ps`）。

## 點更新

改 `data.json` 就得，唔使 build。

- `news[]`：`platform` 用 `steam`、`switch` 或 `ps`
- `deals[]`：`discount` 係整數百分比，`price` / `was` 自己帶貨幣（港區 Steam 用 `HK$`，呢版 Switch／PS 公開價用 `US$`）
- `ends` 冇截止日期就放 `null`
- `.nojekyll` 令 Pages 唔好行 Jekyll，`data.json` 先會原樣送出

## 2026-10-05 資料

- Steam 港區價：當日 `store.steampowered.com` appdetails／featuredcategories
- 截止日期：Loot.hk 特別促銷，同埋萬代南夢宮秋季特賣（至 10月9日）
- Switch：Nintendo Everything 10月4日北美 eShop 彙整，加 Nintendo Insider 嘅 Crunching Koalas（至 10月8日）
- PS：GamingBible 嘅 Autumn Adventures（至 10月7日，美區價）；PS Plus 10月會免見 PlayStation.Blog

買之前再對一次商店頁。

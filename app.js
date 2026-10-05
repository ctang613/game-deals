const PLATFORM_SHORT = {
  steam: "Steam",
  switch: "Switch",
  ps: "PS",
};

const state = {
  data: null,
  platform: "all",
};

function platformFromHash() {
  const id = location.hash.replace("#", "");
  if (id === "steam" || id === "switch" || id === "ps" || id === "all") return id;
  return "all";
}

function formatDate(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${Number(m)}月${Number(d)}日`;
}

function matches(item) {
  return state.platform === "all" || item.platform === state.platform;
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function safeUrl(url) {
  try {
    const parsed = new URL(url);
    if (parsed.protocol === "https:") return parsed.href;
  } catch {
    /* ignore bad urls */
  }
  return null;
}

function isHongKong(region) {
  if (!region) return false;
  return region === "HK" || region === "香港" || region === "港區" || region.startsWith("港服");
}

function placeName(region) {
  if (!region) return "";
  if (region === "HK" || region === "香港" || region === "港區") return "香港";
  return region;
}

function dealCount(platformId) {
  return state.data.deals.filter((deal) => platformId === "all" || deal.platform === platformId).length;
}

function numericDiscount(deal) {
  return typeof deal.discount === "number" && Number.isFinite(deal.discount) ? deal.discount : null;
}

function thumb(imageUrl, platform) {
  const wrap = el("div", "thumb");
  wrap.dataset.platform = platform;
  const fallback = el("span", "fallback-label", PLATFORM_SHORT[platform] || "HK");
  wrap.appendChild(fallback);
  const href = safeUrl(imageUrl);
  if (!href) {
    wrap.classList.add("is-fallback");
    return wrap;
  }
  const img = document.createElement("img");
  img.alt = "";
  img.loading = "lazy";
  img.decoding = "async";
  img.src = href;
  img.addEventListener("error", () => {
    img.remove();
    wrap.classList.add("is-fallback");
  });
  wrap.appendChild(img);
  return wrap;
}

function renderFilters() {
  const nav = document.getElementById("filters");
  nav.replaceChildren();
  for (const platform of state.data.platforms) {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.platform = platform.id;
    button.setAttribute("aria-pressed", String(platform.id === state.platform));
    button.append(el("span", null, platform.label), el("span", "filter-count", String(dealCount(platform.id))));
    button.addEventListener("click", () => {
      state.platform = platform.id;
      history.replaceState(null, "", platform.id === "all" ? location.pathname + location.search : `#${platform.id}`);
      render();
    });
    nav.appendChild(button);
  }
}

function renderNews() {
  const items = state.data.news.filter(matches);
  const root = document.getElementById("news");
  document.getElementById("news-count").textContent = `${items.length} 則`;
  root.replaceChildren();
  if (!items.length) {
    root.appendChild(el("p", "empty", "呢個平台今晚未有消息。"));
    return;
  }
  for (const item of items) {
    const href = safeUrl(item.url);
    const card = href ? document.createElement("a") : document.createElement("article");
    card.className = "card news-card";
    if (href) {
      card.href = href;
      card.target = "_blank";
      card.rel = "noopener noreferrer";
    }
    const media = el("div", "media");
    media.appendChild(thumb(item.image, item.platform));
    const chip = el("span", `chip ${item.platform}`, PLATFORM_SHORT[item.platform] || item.platform);
    media.appendChild(chip);
    card.appendChild(media);

    const body = el("div", "card-body");
    const meta = el("p", "meta");
    if (isHongKong(item.region)) meta.appendChild(el("span", "hk", "HK"));
    meta.append(document.createTextNode(`${formatDate(item.date)} · ${item.source}`));
    body.append(meta, el("h3", null, item.title), el("p", "summary", item.summary));
    if (href) body.appendChild(el("p", "open-label", "開啟來源"));
    card.appendChild(body);
    root.appendChild(card);
  }
}

function renderDeals() {
  const items = state.data.deals
    .filter(matches)
    .slice()
    .sort((a, b) => {
      const left = numericDiscount(a);
      const right = numericDiscount(b);
      if (left == null && right == null) return a.title.localeCompare(b.title, "zh-Hant");
      if (left == null) return 1;
      if (right == null) return -1;
      return right - left || a.title.localeCompare(b.title, "zh-Hant");
    });
  const root = document.getElementById("deals");
  document.getElementById("deals-count").textContent = `${items.length} 個 · 折扣高至低`;
  root.replaceChildren();
  if (!items.length) {
    root.appendChild(el("p", "empty", "呢個平台今晚未有特價。"));
    return;
  }
  for (const deal of items) {
    const href = safeUrl(deal.url);
    const card = href ? document.createElement("a") : document.createElement("article");
    card.className = "card deal";
    if (href) {
      card.href = href;
      card.target = "_blank";
      card.rel = "noopener noreferrer";
    }
    const media = el("div", "media");
    media.appendChild(thumb(deal.image, deal.platform));
    const discount = numericDiscount(deal);
    if (discount != null) media.appendChild(el("span", "off", `-${discount}%`));
    media.appendChild(el("span", `chip ${deal.platform}`, PLATFORM_SHORT[deal.platform] || deal.platform));
    card.appendChild(media);

    const body = el("div", "card-body");
    body.appendChild(el("h3", null, deal.title));
    const meta = el("p", "meta");
    if (isHongKong(deal.region)) meta.appendChild(el("span", "hk", "HK"));
    const bits = [placeName(deal.region)];
    if (deal.ends) bits.push(`至 ${formatDate(deal.ends)}`);
    if (deal.source) bits.push(deal.source);
    meta.append(document.createTextNode(bits.filter(Boolean).join(" · ")));
    body.appendChild(meta);

    const prices = el("div", "price-row");
    prices.appendChild(el("span", "price", deal.price));
    if (deal.was) prices.appendChild(el("span", "was", deal.was));
    body.appendChild(prices);
    card.appendChild(body);
    root.appendChild(card);
  }
}

function render() {
  renderFilters();
  renderDeals();
  renderNews();
}

function showRegion() {
  const region = state.data.region === "HK" ? "香港" : state.data.region || "香港";
  const currency = state.data.currency || "HKD";
  document.getElementById("region-pill").textContent = `${region} · ${currency}`;
}

async function init() {
  state.platform = platformFromHash();
  try {
    const response = await fetch("data.json");
    if (!response.ok) throw new Error(`data.json ${response.status}`);
    state.data = await response.json();
    const stamp = String(state.data.updated || "").replace("T", " ").replace("+08:00", " HKT");
    document.getElementById("kicker").textContent = stamp ? `更新 ${stamp}` : "香港";
    document.getElementById("lede").textContent = state.data.headline || "";
    document.getElementById("note").textContent = state.data.note || "";
    showRegion();
    render();
  } catch (error) {
    document.getElementById("kicker").textContent = "載入失敗";
    document.getElementById("lede").textContent = "讀唔到 data.json。";
    document.getElementById("news").appendChild(el("p", "error", String(error)));
  }
}

window.addEventListener("hashchange", () => {
  state.platform = platformFromHash();
  if (state.data) render();
});

init();

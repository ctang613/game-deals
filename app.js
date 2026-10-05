const PLATFORM_LABEL = {
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

function renderFilters() {
  const nav = document.getElementById("filters");
  nav.replaceChildren();
  for (const platform of state.data.platforms) {
    const button = el("button", null, platform.label);
    button.type = "button";
    button.dataset.platform = platform.id;
    button.setAttribute("aria-pressed", String(platform.id === state.platform));
    button.addEventListener("click", () => {
      state.platform = platform.id;
      history.replaceState(null, "", platform.id === "all" ? location.pathname : `#${platform.id}`);
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
    const card = el("article");
    card.dataset.platform = item.platform;
    const meta = el("p", "meta");
    const badge = el("span", `badge ${item.platform}`, PLATFORM_LABEL[item.platform] || item.platform);
    meta.append(badge, document.createTextNode(`${formatDate(item.date)} · ${item.source}`));
    card.append(meta, el("h3", null, item.title), el("p", null, item.summary));
    const href = safeUrl(item.url);
    if (href) {
      const link = el("a", "source-link", "睇來源");
      link.href = href;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      card.appendChild(link);
    }
    root.appendChild(card);
  }
}

function renderDeals() {
  const items = state.data.deals
    .filter(matches)
    .slice()
    .sort((a, b) => b.discount - a.discount || a.title.localeCompare(b.title));
  const root = document.getElementById("deals");
  document.getElementById("deals-count").textContent = `${items.length} 個`;
  root.replaceChildren();
  if (!items.length) {
    root.appendChild(el("p", "empty", "呢個平台今晚未有特價。"));
    return;
  }
  for (const deal of items) {
    const href = safeUrl(deal.url);
    const row = href ? document.createElement("a") : document.createElement("article");
    row.className = "deal";
    if (href) {
      row.href = href;
      row.target = "_blank";
      row.rel = "noopener noreferrer";
    }
    row.appendChild(el("div", "discount", `-${deal.discount}%`));

    const body = el("div");
    body.appendChild(el("h3", null, deal.title));
    const bits = [PLATFORM_LABEL[deal.platform] || deal.platform, deal.region];
    if (deal.ends) bits.push(`至 ${formatDate(deal.ends)}`);
    if (deal.source) bits.push(deal.source);
    const sub = el("p", "sub");
    const badge = el("span", `badge ${deal.platform}`, PLATFORM_LABEL[deal.platform] || deal.platform);
    sub.append(badge, document.createTextNode(bits.slice(1).join(" · ")));
    body.appendChild(sub);
    row.appendChild(body);

    const price = el("div", "pricebox");
    price.append(el("span", "price", deal.price), el("span", "was", deal.was));
    row.appendChild(price);
    root.appendChild(row);
  }
}

function render() {
  renderFilters();
  renderNews();
  renderDeals();
}

async function init() {
  state.platform = platformFromHash();
  try {
    const response = await fetch("data.json");
    if (!response.ok) throw new Error(`data.json ${response.status}`);
    state.data = await response.json();
    document.getElementById("kicker").textContent = `更新 ${state.data.updated.replace("T", " ").replace("+08:00", " HKT")}`;
    document.getElementById("lede").textContent = state.data.headline;
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

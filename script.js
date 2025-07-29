const holdings = {
  BTC: 0.05675,
  ETH: 5.2352,
  LDO: 3250.23,
  SOL: 74.45,
  SEI: 8452.6,
  ZK: 42341.35,
  MANTA: 8378,
  STRK: 15373,
  OP: 4478,
  ARB: 4956,
  BAKE: 16453,
  FLOW: 5600,
  KSM: 148,
  GMT: 45234,
  IO: 2390,
  IMX: 3200,
  ENA: 8543,
};

const tokenIdMap = {
  BTC: "bitcoin",
  ETH: "ethereum",
  LDO: "lido-dao",
  SOL: "solana",
  SEI: "sei-network",
  ZK: "zksync",
  MANTA: "manta-network",
  STRK: "starknet",
  OP: "optimism",
  ARB: "arbitrum",
  BAKE: "bakerytoken",
  FLOW: "flow",
  KSM: "kusama",
  GMT: "stepn",
  IO: "io-net",
  IMX: "immutable-x",
  ENA: "ethena",
};

const ctx = document.getElementById("chart").getContext("2d");
let balanceChart;
let balanceHistory = [];
let dateLabels = [];

function initChart() {
  balanceChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: dateLabels,
      datasets: [{
        label: "Balance",
        data: balanceHistory,
        borderColor: "orange",
        backgroundColor: "transparent",
        pointRadius: 4,
        borderWidth: 2,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { labels: { color: "orange" } }
      },
      scales: {
        x: { ticks: { color: "#ccc" } },
        y: { ticks: { color: "#ccc" } }
      }
    }
  });
}

function updateTime() {
  const now = new Date();
  document.getElementById("time").textContent = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

async function fetchPrices(ids) {
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(",")}&vs_currencies=usd`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (e) {
    console.error("Ошибка загрузки цен:", e);
    return {};
  }
}

function displayTokens(priceMap) {
  const table = document.getElementById("tokens");
  table.innerHTML = "";
  let total = 0;

  for (const [symbol, amount] of Object.entries(holdings)) {
    const id = tokenIdMap[symbol];
    const price = priceMap[id]?.usd || 0;
    const value = price * amount;
    total += value;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="token-name">${symbol}</td>
      <td class="token-amount">${amount}</td>
      <td class="token-value">$${value.toFixed(2)}</td>
    `;
    table.appendChild(row);
  }

  document.getElementById("balance").textContent = `$${total.toFixed(2)}`;
  document.getElementById("loading").style.display = "none";

  const date = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
  if (!dateLabels.includes(date)) {
    dateLabels.push(date);
    balanceHistory.push(total.toFixed(2));
    if (dateLabels.length > 7) {
      dateLabels.shift();
      balanceHistory.shift();
    }
    balanceChart.update();
  }
}

async function initialLoad() {
  const ids = Object.values(tokenIdMap);
  const prices = await fetchPrices(ids);
  displayTokens(prices);
}

async function partialUpdates() {
  const symbols = Object.keys(tokenIdMap);
  let index = 0;

  setInterval(async () => {
    const group = symbols.slice(index, index + 4).map(sym => tokenIdMap[sym]);
    const prices = await fetchPrices(group);

    for (const sym of symbols.slice(index, index + 4)) {
      const id = tokenIdMap[sym];
      if (prices[id]) {
        const cell = document.querySelector(`td.token-name:contains(${sym})`);
        if (cell) {
          const price = prices[id].usd;
          const amount = holdings[sym];
          const value = price * amount;
          const row = cell.parentElement;
          row.children[2].textContent = `$${value.toFixed(2)}`;
        }
      }
    }

    index = (index + 4) % symbols.length;
  }, 5000);
}

window.onload = async () => {
  updateTime();
  setInterval(updateTime, 60000);

  initChart();
  await initialLoad();
  partialUpdates();
};
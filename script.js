const holdings = {
  BTC: 0.057,
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
  ENA: 9543,
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
        legend: {
          labels: { color: "orange" }
        }
      },
      scales: {
        x: { ticks: { color: "#ccc" } },
        y: { ticks: { color: "#ccc" } }
      }
    }
  });
}

async function fetchAllPrices() {
  const ids = Object.values(tokenIdMap).join(",");
  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`);
    if (!res.ok) throw new Error("Failed to load prices");
    return await res.json();
  } catch (err) {
    console.error("Ошибка загрузки:", err);
    return {};
  }
}

async function updateWallet() {
  const priceData = await fetchAllPrices();
  const table = document.getElementById("tokens");
  const balanceEl = document.getElementById("balance");
  const loadingEl = document.getElementById("loading");

  table.innerHTML = "";
  let total = 0;

  for (const [symbol, amount] of Object.entries(holdings)) {
    const id = tokenIdMap[symbol];
    const price = priceData[id]?.usd || 0;
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

  balanceEl.textContent = `$${total.toFixed(2)}`;
  loadingEl.style.display = "none";

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

function updateTime() {
  const now = new Date();
  document.getElementById("time").textContent = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

window.onload = async () => {
  updateTime();
  setInterval(updateTime, 60000);
  initChart();
  await updateWallet();
  setInterval(updateWallet, 15000);
};
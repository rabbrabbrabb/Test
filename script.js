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

const chartCtx = document.getElementById("chart").getContext("2d");
let balanceChart;
let balanceHistory = [];
let dateLabels = [];

async function fetchPrices(symbols) {
  const result = {};
  for (let symbol of symbols) {
    try {
      const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${symbol.toLowerCase()}&vs_currencies=usd`);
      const data = await response.json();
      result[symbol] = data[symbol.toLowerCase()]?.usd || 0;
    } catch {
      result[symbol] = 0;
    }
  }
  return result;
}

function updateClock() {
  const now = new Date();
  document.getElementById("time").textContent = now.toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit' });
}

async function updateWallet() {
  const tokenSymbols = Object.keys(holdings);
  const prices = await fetchPrices(tokenSymbols);

  const tokensTable = document.getElementById("tokens");
  tokensTable.innerHTML = "";

  let total = 0;

  for (const [symbol, amount] of Object.entries(holdings)) {
    const price = prices[symbol];
    const value = (price * amount).toFixed(2);
    total += +value;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="token-name">${symbol}</td>
      <td class="token-amount">${amount}</td>
      <td class="token-value">$${value}</td>
    `;
    tokensTable.appendChild(row);
  }

  document.getElementById("balance").textContent = `$${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  document.getElementById("loading").style.display = "none";

  // Update chart
  const now = new Date();
  const date = now.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
  if (!dateLabels.includes(date)) {
    dateLabels.push(date);
    balanceHistory.push(total);
    if (dateLabels.length > 7) {
      dateLabels.shift();
      balanceHistory.shift();
    }
    balanceChart.update();
  }
}

function initChart() {
  balanceChart = new Chart(chartCtx, {
    type: "line",
    data: {
      labels: dateLabels,
      datasets: [
        {
          label: "Balance",
          data: balanceHistory,
          borderColor: "orange",
          backgroundColor: "transparent",
          pointBorderColor: "orange",
          tension: 0.3
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: false,
        },
      },
      plugins: {
        legend: {
          labels: {
            color: "orange",
          },
        },
      },
    },
  });
}

window.onload = async () => {
  updateClock();
  setInterval(updateClock, 60000);

  initChart();
  await updateWallet();
  setInterval(updateWallet, 5000); // обновление каждые 15 сек
};
const tokens = [
  { name: "BTC", id: "bitcoin", amount: 0.05675 },
  { name: "ETH", id: "ethereum", amount: 5.2352 },
  { name: "LDO", id: "lido-dao", amount: 3250.23 },
  { name: "SOL", id: "solana", amount: 74.45 },
  { name: "SEI", id: "sei-network", amount: 8452.6 },
  { name: "ZK", id: "zksync", amount: 42341.35 },
  { name: "MANTA", id: "manta-network", amount: 8378 },
  { name: "STRK", id: "starknet", amount: 15373 },
  { name: "OP", id: "optimism", amount: 4478 },
  { name: "ARB", id: "arbitrum", amount: 4956 },
  { name: "SONIC", id: "sonic", amount: 5890 },
  { name: "BAKE", id: "bakerytoken", amount: 16453 },
  { name: "FLOW", id: "flow", amount: 5600 },
  { name: "KSM", id: "kusama", amount: 148 },
  { name: "GMT", id: "stepn", amount: 45234 },
  { name: "IO", id: "io-net", amount: 2390 },
  { name: "IMX", id: "immutable-x", amount: 3200 },
  { name: "ENA", id: "ethena", amount: 9543 },
];

let chart, chartData = [], labels = [];

function updateDisplay() {
  const container = document.getElementById("tokenList");
  container.innerHTML = "";
  let total = 0;

  tokens.forEach(token => {
    if (!token.price) return;
    const value = token.amount * token.price;
    token.value = value;
    total += value;

    const row = document.createElement("div");
    row.innerHTML = `
      <span>${token.name}</span>
      <span>${token.amount.toLocaleString()}</span>
      <span>$${value.toFixed(2)}</span>
    `;
    row.style.display = "flex";
    row.style.justifyContent = "space-between";
    container.appendChild(row);
  });

  document.getElementById("total").innerText = "$" + total.toFixed(2);
}

function updateChart() {
  const total = tokens.reduce((sum, t) => sum + (t.value || 0), 0);
  const now = new Date();
  const label = now.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });

  if (!labels.includes(label)) {
    labels.push(label);
    chartData.push(total);

    if (labels.length > 7) {
      labels.shift();
      chartData.shift();
    }

    chart.data.labels = labels;
    chart.data.datasets[0].data = chartData;
    chart.update();
  }
}

async function initialFetch() {
  const ids = tokens.map(t => t.id).join(",");
  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`);
    const data = await res.json();
    tokens.forEach(t => {
      const price = data[t.id]?.usd;
      if (price) {
        t.price = price;
        t.value = price * t.amount;
      }
    });
    updateDisplay();
    updateChart();
  } catch (e) {
    console.error("Initial fetch error:", e.message);
  }
}

let currentIndex = 0;
async function fetchPrices() {
  const group = tokens.slice(currentIndex, currentIndex + 4);
  currentIndex = (currentIndex + 4) % tokens.length;
  const ids = group.map(t => t.id).join(",");
  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`);
    const data = await res.json();
    group.forEach(t => {
      const price = data[t.id]?.usd;
      if (price) {
        t.price = price;
        t.value = price * t.amount;
      }
    });
    updateDisplay();
    updateChart();
  } catch (e) {
    console.error("Price fetch error:", e.message);
  }
}

window.onload = () => {
  const ctx = document.getElementById("chart").getContext("2d");
  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [{
        label: "Balance",
        data: [],
        borderColor: "orange",
        backgroundColor: "transparent",
        pointRadius: 5,
        pointHoverRadius: 7,
        borderWidth: 2,
      }],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: "white",
          },
        },
      },
      scales: {
        x: {
          ticks: { color: "white" },
        },
        y: {
          ticks: { color: "white" },
        },
      },
    },
  });

  initialFetch();
  setInterval(fetchPrices, 10000);
};
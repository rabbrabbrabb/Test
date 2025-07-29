const tokens = [
  { id: "bitcoin", symbol: "BTC", amount: 0.05675 },
  { id: "ethereum", symbol: "ETH", amount: 5.2352 },
  { id: "lido-dao", symbol: "LDO", amount: 3250.23 },
  { id: "solana", symbol: "SOL", amount: 74.45 },
  { id: "sei-network", symbol: "SEI", amount: 8452.6 },
  { id: "zksync", symbol: "ZK", amount: 42341.35 },
  { id: "manta-network", symbol: "MANTA", amount: 8378 },
  { id: "starknet", symbol: "STRK", amount: 15373 },
  { id: "optimism", symbol: "OP", amount: 4478 },
  { id: "arbitrum", symbol: "ARB", amount: 4956 },
  { id: "bakerytoken", symbol: "BAKE", amount: 16453 },
  { id: "flow", symbol: "FLOW", amount: 5600 },
  { id: "kusama", symbol: "KSM", amount: 148 },
  { id: "stepn", symbol: "GMT", amount: 45234 },
  { id: "io", symbol: "IO", amount: 2390 },
  { id: "immutable-x", symbol: "IMX", amount: 3200 },
  { id: "ethena", symbol: "ENA", amount: 8543 }
];

let total = 0;
let chartData = [];
let chartLabels = [];
let currentGroup = 0;

// разделим токены на группы по 3–4
const chunkSize = 4;
const tokenGroups = [];
for (let i = 0; i < tokens.length; i += chunkSize) {
  tokenGroups.push(tokens.slice(i, i + chunkSize));
}

async function fetchHistory(id) {
  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=7`);
    const json = await res.json();
    return json.prices.map(p => p[1]);
  } catch (e) {
    console.error(`History error for ${id}:`, e);
    return Array(7).fill(0);
  }
}

async function buildHistory() {
  const arrays = await Promise.all(tokens.map(t => fetchHistory(t.id)));
  for (let i = 0; i < arrays[0].length; i++) {
    let sum = 0;
    tokens.forEach((t, idx) => {
      sum += arrays[idx][i] * t.amount;
    });
    const daysAgo = arrays[0].length - 1 - i;
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    chartLabels.push(date.toLocaleDateString("en-GB",{day:"2-digit",month:"short"}));
    chartData.push(sum.toFixed(2));
  }
}

function renderTableRow(token, valueUSD) {
  const row = document.querySelector(`tr[data-symbol="${token.symbol}"]`);
  if (row) {
    row.children[2].innerText = `$${valueUSD.toFixed(2)}`;
  } else {
    const table = document.getElementById("tokenTable");
    const tr = document.createElement("tr");
    tr.setAttribute("data-symbol", token.symbol);
    tr.innerHTML = `
      <td style="text-align:left;">${token.symbol}</td>
      <td style="text-align:center;">${token.amount}</td>
      <td style="text-align:right;">$${valueUSD.toFixed(2)}</td>
    `;
    table.appendChild(tr);
  }
}

async function updateGroup() {
  const group = tokenGroups[currentGroup];
  const ids = group.map(t => t.id).join(',');
  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`);
    const prices = await res.json();
    let subtotal = 0;
    group.forEach(token => {
      const price = prices[token.id]?.usd || 0;
      const value = price * token.amount;
      subtotal += value;
      renderTableRow(token, value);
    });
    total += subtotal;
    document.getElementById("total").innerText = `$${total.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}`;
  } catch (e) {
    console.error("Group update failed:", e);
  }

  currentGroup = (currentGroup + 1) % tokenGroups.length;
}

async function main() {
  await buildHistory();
  chart.update();

  total = 0;
  document.getElementById("tokenTable").innerHTML = "";
  document.getElementById("total").innerText = "$0.00";

  updateGroup(); // сразу первый запуск
  setInterval(updateGroup, 15000); // каждые 15 сек
}

const ctx = document.getElementById("balanceChart").getContext("2d");
const chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: chartLabels,
    datasets: [{
      label: "Balance",
      data: chartData,
      borderColor: "orange",
      backgroundColor: "transparent",
      pointRadius: 5
    }]
  },
  options: {
    scales: {
      y: { beginAtZero: false }
    }
  }
});

main();
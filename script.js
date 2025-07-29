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

const chartData = [];
const chartLabels = [];

async function fetchHistory(id) {
  const res = await fetch(`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=7`);
  const json = await res.json();
  return json.prices.map(p => p[1]); // daily prices from each point
}

async function buildHistory() {
  const arrays = await Promise.all(tokens.map(t => fetchHistory(t.id)));
  // for each day index, sum across all tokens
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

async function updateCurrent() {
  const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${tokens.map(t=>t.id).join(',')}&vs_currencies=usd`);
  const prices = await res.json();
  let total = 0;
  const table = document.getElementById("tokenTable");
  table.innerHTML = "";
  tokens.forEach(t => {
    const price = prices[t.id]?.usd || 0;
    const value = price * t.amount;
    total += value;
    table.innerHTML += `<tr>
      <td style="text-align:left;">${t.symbol}</td>
      <td style="text-align:center;">${t.amount}</td>
      <td style="text-align:right;">$${value.toFixed(2)}</td>
    </tr>`;
  });
  document.getElementById("total").innerText = `$${total.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}`;
}

async function main() {
  await buildHistory();
  chart.update();
  await updateCurrent();
  setInterval(updateCurrent, 10000);
}

const ctx = document.getElementById("balanceChart").getContext("2d");
const chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: chartLabels,
    datasets: [{ label: "Balance", data: chartData, borderColor: "orange", backgroundColor: "transparent", pointRadius: 5 }]
  },
  options: { scales: { y: { beginAtZero: false } }}
});

main();
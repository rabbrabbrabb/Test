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

async function updateData() {
  const ids = tokens.map(t => t.id).join(',');
  const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`);
  const prices = await res.json();

  let total = 0;
  const table = document.getElementById("tokenTable");
  table.innerHTML = "";

  tokens.forEach(token => {
    const price = prices[token.id]?.usd || 0;
    const value = price * token.amount;
    total += value;

    const row = `<tr>
      <td style="text-align:left;">${token.symbol}</td>
      <td style="text-align:center;">${token.amount}</td>
      <td style="text-align:right;">$${value.toFixed(2)}</td>
    </tr>`;

    table.innerHTML += row;
  });

  document.getElementById("total").innerText = `$${total.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;

  const now = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
  if (chartData.length > 7) {
    chartData.shift();
    chartLabels.shift();
  }
  chartData.push(total);
  chartLabels.push(now);
  chart.update();
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

setInterval(updateData, 10000);
updateData();
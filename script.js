const tokens = [
  { id: "bitcoin", symbol: "BTC", amount: 0.1749, purchase: 11000 },
  { id: "ethereum", symbol: "ETH", amount: 5.0, purchase: 20000 },
  { id: "lido-dao", symbol: "LDO", amount: 4666.67, purchase: 4900 },
  { id: "solana", symbol: "SOL", amount: 77.78, purchase: 14000 },
  { id: "sei-network", symbol: "SEI", amount: 10000, purchase: 3500 },
  { id: "zksync", symbol: "ZK", amount: 3000, purchase: 1200 },
  { id: "manta-network", symbol: "MANTA", amount: 2500, purchase: 1500 },
  { id: "starknet", symbol: "STRK", amount: 2000, purchase: 1200 },
  { id: "optimism", symbol: "OP", amount: 2000, purchase: 3000 },
  { id: "arbitrum", symbol: "ARB", amount: 2500, purchase: 2000 },
  { id: "sonic", symbol: "S", amount: 3000, purchase: 1500 },
  { id: "bakerytoken", symbol: "BAKE", amount: 10000, purchase: 2500 },
  { id: "flow", symbol: "FLOW", amount: 5000, purchase: 1500 },
  { id: "kusama", symbol: "KSM", amount: 80, purchase: 2000 },
  { id: "stepn", symbol: "GMT", amount: 10000, purchase: 1500 },
  { id: "io", symbol: "IO", amount: 8500, purchase: 1700 },
  { id: "immutable-x", symbol: "IMX", amount: 4000, purchase: 1600 },
  { id: "thorchain", symbol: "RUNE", amount: 500, purchase: 1000 },
  { id: "ethena", symbol: "ENA", amount: 10000, purchase: 5000 },
];

const chartData = [];
const chartLabels = [];

async function updateData() {
  const ids = tokens.map(t => t.id).join(',');
  const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`);
  const prices = await res.json();

  let total = 0;
  const table = document.getElementById('tokenTable');
  table.innerHTML = "";

  tokens.forEach(token => {
    const price = prices[token.id]?.usd || 0;
    const value = price * token.amount;
    const change = ((value - token.purchase) / token.purchase) * 100;
    total += value;

    const row = `<tr>
      <td>${token.symbol}</td>
      <td>${token.amount}</td>
      <td>$${value.toFixed(2)}</td>
      <td class="${change >= 0 ? 'positive' : 'negative'}">${change.toFixed(2)}%</td>
    </tr>`;
    table.innerHTML += row;
  });

  document.getElementById("total").innerText = `$${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const now = new Date();
  document.getElementById("time").innerText = now.toTimeString().slice(0, 5);

  if (chartData.length > 7) {
    chartData.shift();
    chartLabels.shift();
  }
  chartData.push(total);
  chartLabels.push(now.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }));
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
      pointRadius: 5,
      pointHoverRadius: 7,
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: false
      }
    }
  }
});

setInterval(updateData, 15000);
updateData();
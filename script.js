const tokens = [
  ["bitcoin", "BTC", 0.1749, 62869],
  ["ethereum", "ETH", 5.0, 3800],
  ["lido-dao", "LDO", 4666.67, 0.964],
  ["solana", "SOL", 77.78, 34.8],
  ["catgirl", "CATI", 100000, 0.021],
  ["sei-network", "SEI", 10000, 0.34],
  ["zksync", "ZK", 3000, 0.393],
  ["manta-network", "MANTA", 2500, 0.58],
  ["starknet", "STRK", 2000, 0.595],
  ["optimism", "OP", 2000, 1.45],
  ["arbitrum", "ARB", 2500, 0.78],
  ["saffron-finance", "S", 3000, 0.493],
  ["bakerytoken", "BAKE", 10000, 0.24],
  ["flow", "FLOW", 5000, 0.31],
  ["kusama", "KSM", 80, 23.75],
  ["stepn", "GMT", 10000, 0.149],
  ["io", "IO", 8500, 0.194],
  ["immutable-x", "IMX", 4000, 0.4],
  ["thorchain", "RUNE", 500, 1.9],
  ["ethena", "ENA", 10000, 0.47]
];

const today = new Date().toISOString().split("T")[0];

function fetchPrices() {
  const ids = tokens.map(t => t[0]).join(',');
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      let total = 0;
      let html = "";

      tokens.forEach(([id, symbol, qty, entry]) => {
        const price = data[id]?.usd || 0;
        const usd = qty * price;
        const pct = entry ? (((price - entry) / entry) * 100).toFixed(2) : "0.00";
        const pctColor = pct >= 0 ? 'lime' : 'red';

        total += usd;

        html += `
          <div style="text-align:left">${symbol}</div>
          <div style="text-align:center">${qty}</div>
          <div style="text-align:right">$${usd.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
          <div style="text-align:right; color:${pctColor}">${pct}%</div>
        `;
      });

      document.getElementById("tokens").innerHTML = html;
      document.getElementById("total-balance").innerText = "$" + total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});

      renderChart(total);
    });
}

function renderChart(total) {
  const ctx = document.getElementById('balanceChart').getContext('2d');
  const chartLabels = ['23 Jul', '24 Jul', '25 Jul', '26 Jul', '27 Jul', '28 Jul', today];
  const chartData = [78000, 79000, 77000, 80000, 80500, 81500, total];

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: chartLabels,
      datasets: [{
        label: 'Total Balance (USD)',
        data: chartData,
        borderColor: 'orange',
        backgroundColor: 'rgba(255,165,0,0.1)',
        tension: 0.3
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: false }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

fetchPrices();
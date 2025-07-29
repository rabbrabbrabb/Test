const tokens = [
  ["BTC", "0.1749", 11000, 10600],
  ["ETH", "5.00", 20000, 19000],
  ["LDO", "4666.67", 4900, 4500],
  ["SOL", "77.78", 14000, 13500],
  ["CATI", "100000", 1900, 2100],
  ["SEI", "10000", 3500, 3400],
  ["ZK", "3000", 1200, 1180],
  ["MANTA", "2500", 1500, 1450],
  ["STRK", "2000", 1200, 1190],
  ["OP", "2000", 3000, 2900],
  ["ARB", "2500", 2000, 1950],
  ["S", "3000", 1500, 1480],
  ["BAKE", "10000", 2500, 2400],
  ["FLOW", "5000", 1500, 1550],
  ["KSM", "80", 2000, 1900],
  ["GMT", "10000", 1500, 1490],
  ["IO", "8500", 1700, 1650],
  ["IMX", "4000", 1600, 1600],
  ["RUNE", "500", 1000, 950],
  ["ENA", "10000", 5000, 4700],
];

const today = new Date().toISOString().split("T")[0];

function calcPercentage(current, original) {
  return ((current - original) / original * 100).toFixed(2);
}

document.getElementById("tokens").innerHTML = tokens.map(([name, qty, now, entry]) => {
  const pct = calcPercentage(now, entry);
  return `
    <div style="text-align:left">${name}</div>
    <div style="text-align:center">${qty}</div>
    <div style="text-align:right">$${now.toLocaleString()}</div>
    <div style="text-align:right; color:${pct >= 0 ? 'lime' : 'red'}">${pct}%</div>
  `;
}).join('');

const chartLabels = ['23 Jul', '24 Jul', '25 Jul', '26 Jul', '27 Jul', '28 Jul', today];
const chartData = [78000, 79000, 77000, 80000, 80500, 81500, 84431];

const ctx = document.getElementById('balanceChart').getContext('2d');
const balanceChart = new Chart(ctx, {
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
    scales: { y: { beginAtZero: false } },
    plugins: { legend: { display: false } }
  }
});
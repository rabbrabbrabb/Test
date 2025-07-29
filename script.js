const tokens = [
  ["BTC", 0.1749, 61000, 62869],
  ["ETH", 5.00, 4000, 3800],
  ["LDO", 4666.67, 1.05, 0.964],
  ["SOL", 77.78, 35.00, 34.8],
  ["CATI", 100000, 0.019, 0.021],
  ["SEI", 10000, 0.35, 0.34],
  ["ZK", 3000, 0.4, 0.393],
  ["MANTA", 2500, 0.6, 0.58],
  ["STRK", 2000, 0.6, 0.595],
  ["OP", 2000, 1.5, 1.45],
  ["ARB", 2500, 0.8, 0.78],
  ["S", 3000, 0.5, 0.493],
  ["BAKE", 10000, 0.25, 0.24],
  ["FLOW", 5000, 0.3, 0.31],
  ["KSM", 80, 25.0, 23.75],
  ["GMT", 10000, 0.15, 0.149],
  ["IO", 8500, 0.2, 0.194],
  ["IMX", 4000, 0.4, 0.4],
  ["RUNE", 500, 2.0, 1.9],
  ["ENA", 10000, 0.5, 0.47]
];

const today = new Date().toISOString().split("T")[0];

function calcUSD(amount, price) {
  return amount * price;
}

function calcPct(now, entry) {
  return ((now - entry) / entry * 100).toFixed(2);
}

let total = 0;

document.getElementById("tokens").innerHTML = tokens.map(([name, amount, current, entry]) => {
  const usd = calcUSD(amount, current);
  const pct = calcPct(current, entry);
  total += usd;
  return `
    <div style="text-align:left">${name}</div>
    <div style="text-align:center">${amount}</div>
    <div style="text-align:right">$${usd.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
    <div style="text-align:right; color:${pct >= 0 ? 'lime' : 'red'}">${pct}%</div>
  `;
}).join('');

document.getElementById("total-balance").innerText = "$" + total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});

const ctx = document.getElementById('balanceChart').getContext('2d');
const chartLabels = ['23 Jul', '24 Jul', '25 Jul', '26 Jul', '27 Jul', '28 Jul', today];
const chartData = [78000, 79000, 77000, 80000, 80500, 81500, total.toFixed(2)];

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
    scales: {
      y: { beginAtZero: false }
    },
    plugins: {
      legend: { display: false }
    }
  }
});
const ctx = document.getElementById('balanceChart').getContext('2d');
const balanceChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['23 Jul', '24 Jul', '25 Jul', '26 Jul', '27 Jul', '28 Jul', '29 Jul'],
        datasets: [{
            label: 'Total Balance (USD)',
            data: [78000, 79000, 77000, 80000, 80500, 81500, 84431],
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

document.getElementById("tokens").innerHTML = `
  <div>BTC — 0.1749 — $11,000.00 (+0.0%)</div>
  <div>ETH — 5.01 — $20,000.00 (+0.0%)</div>
  <div>LDO — 4666.67 — $4,900.00 (+0.0%)</div>
  <div>SOL — 77.78 — $14,000.00 (+0.0%)</div>
`;

document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    if (!localStorage.getItem('isAuthenticated')) {
        window.location.href = 'index.html';
        return;
    }

    // Load user data
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        document.querySelector('.user-name').textContent = user.name;
        // Display user's avatar
        const avatarImg = document.querySelector('.user-profile img');
        if (user.avatar) {
            avatarImg.src = user.avatar;
        } else {
            // Fallback to default avatar if none selected
            avatarImg.src = 'assets/default-avatar.png';
        }
    }

    // Initialize portfolio chart
    initializePortfolioChart();

    // Initialize market table
    initializeMarketTable();

    // Setup event listeners
    setupEventListeners();
});

function initializePortfolioChart() {
    const ctx = document.getElementById('portfolioChart').getContext('2d');
    
    // Function to fetch historical exchange rate data
    async function fetchHistoricalData() {
        try {
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - 30); // Get last 30 days
            
            const response = await fetch(`https://api.exchangerate.host/timeseries?start_date=${startDate.toISOString().split('T')[0]}&end_date=${endDate.toISOString().split('T')[0]}&base=KES&symbols=USD`);
            const data = await response.json();
            
            // Process the data
            const dates = [];
            const rates = [];
            
            for (const [date, rate] of Object.entries(data.rates)) {
                dates.push(new Date(date).toLocaleDateString());
                rates.push(rate.USD);
            }
            
            return { dates, rates };
        } catch (error) {
            console.error('Error fetching historical data:', error);
            return null;
        }
    }
    
    // Create initial chart with loading state
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'KES to USD Exchange Rate',
                data: [],
                borderColor: '#0984E3',
                backgroundColor: 'rgba(9, 132, 227, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#0984E3'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 20
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: {
                            size: 14
                        }
                    }
                },
                tooltip: {
                    backgroundColor: '#ffffff',
                    titleColor: '#000000',
                    bodyColor: '#000000',
                    borderColor: '#000000',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            return `1 KES = ${context.parsed.y.toFixed(4)} USD`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        callback: function(value) {
                            return value.toFixed(4);
                        }
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45
                    }
                }
            }
        }
    });
    
    // Fetch and update data
    fetchHistoricalData().then(data => {
        if (data) {
            chart.data.labels = data.dates;
            chart.data.datasets[0].data = data.rates;
            chart.update();
            
            // Update the portfolio balance with current rate
            const currentRate = data.rates[data.rates.length - 1];
            document.querySelector('.portfolio-balance h3').textContent = `1 KES = ${currentRate.toFixed(4)} USD`;
        }
    });
    
    // Set up auto-refresh every hour
    setInterval(async () => {
        const data = await fetchHistoricalData();
        if (data) {
            chart.data.labels = data.dates;
            chart.data.datasets[0].data = data.rates;
            chart.update();
            
            const currentRate = data.rates[data.rates.length - 1];
            document.querySelector('.portfolio-balance h3').textContent = `1 KES = ${currentRate.toFixed(4)} USD`;
        }
    }, 3600000); // Update every hour
}

function initializeMarketTable() {
    const marketTable = document.getElementById('marketTable');
    
    // Sample market data - replace with real data from your API
    const marketData = [
        { name: 'Band Protocol', symbol: 'BAND', price: '$2.42', change: '+15.38%', marketCap: '$398.8M' },
        { name: 'VeChain', symbol: 'VET', price: '$7.48', change: '+11.91%', marketCap: '$152.5M' },
        { name: 'Aave', symbol: 'AAVE', price: '$50.084', change: '+7.57%', marketCap: '$1.2B' },
        { name: 'Waves', symbol: 'WAVES', price: '$30.68', change: '+6.80%', marketCap: '$398.8M' }
    ];

    const tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Change</th>
                    <th>Market Cap</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                ${marketData.map(coin => `
                    <tr>
                        <td>${coin.name}</td>
                        <td>${coin.price}</td>
                        <td class="positive">${coin.change}</td>
                        <td>${coin.marketCap}</td>
                        <td><button class="watch-btn">⭐</button></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    marketTable.innerHTML = tableHTML;
}

function setupEventListeners() {
    // Time filter change
    document.getElementById('timeFilter').addEventListener('change', (e) => {
        // Update chart based on selected time range
        console.log('Time filter changed:', e.target.value);
    });

    // Gainers filter change
    document.getElementById('gainersFilter').addEventListener('change', (e) => {
        // Update market table based on selected filter
        console.log('Gainers filter changed:', e.target.value);
    });

    // Watch button clicks
    document.querySelectorAll('.watch-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });
}

// Handle navigation
document.querySelectorAll('.nav-item').forEach(item => {
    if (!item.classList.contains('logout-btn')) {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const href = item.getAttribute('href');
            if (href) {
                window.location.href = href;
            }
        });
    }
});

// Function to get consistent avatar based on user's email
function getConsistentAvatar(email) {
    // Use the email to generate a consistent seed
    const seed = email.split('@')[0]; // Use the part before @ as seed
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
} 
document.addEventListener('DOMContentLoaded', async () => {
    // Check authentication
    if (!localStorage.getItem('isAuthenticated')) {
        window.location.href = 'index.html';
        return;
    }

    // Load user data
    const user = JSON.parse(localStorage.getItem('user'));
    document.querySelector('.user-name').textContent = user.name;
    document.querySelector('.user-profile img').src = user.avatar;

    // Sample assets data (in a real app, this would come from an API)
    const sampleAssets = [
        {
            name: 'Bitcoin',
            symbol: 'BTC',
            price: 45000.00,
            holdings: 0.5,
            change: 2.5,
            icon: 'assets/btc-icon.png'
        },
        {
            name: 'Ethereum',
            symbol: 'ETH',
            price: 3200.00,
            holdings: 2.0,
            change: -1.8,
            icon: 'assets/eth-icon.png'
        },
        // Add more sample assets as needed
    ];

    // Initialize variables
    let assets = [...sampleAssets];
    
    // Get DOM elements
    const searchInput = document.getElementById('searchAsset');
    const sortSelect = document.getElementById('sortAssets');
    const tableBody = document.getElementById('assetsTableBody');

    // Calculate and update portfolio value
    function updatePortfolioValue() {
        const totalValue = assets.reduce((sum, asset) => sum + (asset.price * asset.holdings), 0);
        const totalChange = assets.reduce((sum, asset) => sum + asset.change, 0) / assets.length;

        document.querySelector('.total-value .value').textContent = `$${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
        const changeElement = document.querySelector('.total-value .change');
        changeElement.textContent = `${totalChange > 0 ? '+' : ''}${totalChange.toFixed(2)}%`;
        changeElement.className = `change ${totalChange >= 0 ? 'positive' : 'negative'}`;
    }

    // Update assets table
    function updateAssetsTable() {
        tableBody.innerHTML = '';
        
        assets.forEach(asset => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="asset-info">
                        <img src="${asset.icon}" alt="${asset.name} icon">
                        <div>
                            <div>${asset.name}</div>
                            <div style="color: var(--text-secondary)">${asset.symbol}</div>
                        </div>
                    </div>
                </td>
                <td>$${asset.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                <td>${asset.holdings}</td>
                <td>$${(asset.price * asset.holdings).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                <td>
                    <span class="change ${asset.change >= 0 ? 'positive' : 'negative'}">
                        ${asset.change > 0 ? '+' : ''}${asset.change}%
                    </span>
                </td>
                <td>
                    <button class="action-btn buy-btn">Buy</button>
                    <button class="action-btn sell-btn">Sell</button>
                </td>
            `;

            // Add event listeners for buy/sell buttons
            const buyBtn = row.querySelector('.buy-btn');
            const sellBtn = row.querySelector('.sell-btn');

            buyBtn.addEventListener('click', () => handleBuy(asset));
            sellBtn.addEventListener('click', () => handleSell(asset));

            tableBody.appendChild(row);
        });
    }

    // Handle asset search
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        assets = sampleAssets.filter(asset => 
            asset.name.toLowerCase().includes(query) ||
            asset.symbol.toLowerCase().includes(query)
        );
        updateAssetsTable();
    });

    // Handle asset sorting
    sortSelect.addEventListener('change', () => {
        const sortBy = sortSelect.value;
        assets.sort((a, b) => {
            switch (sortBy) {
                case 'value':
                    return (b.price * b.holdings) - (a.price * a.holdings);
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'change':
                    return b.change - a.change;
                default:
                    return 0;
            }
        });
        updateAssetsTable();
    });

    // Handle buy action
    function handleBuy(asset) {
        const amount = prompt(`How many ${asset.symbol} would you like to buy?`);
        if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
            // In a real app, this would involve a transaction
            asset.holdings += parseFloat(amount);
            updateAssetsTable();
            updatePortfolioValue();
            alert(`Successfully bought ${amount} ${asset.symbol}`);
        }
    }

    // Handle sell action
    function handleSell(asset) {
        const amount = prompt(`How many ${asset.symbol} would you like to sell?`);
        if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
            if (parseFloat(amount) <= asset.holdings) {
                // In a real app, this would involve a transaction
                asset.holdings -= parseFloat(amount);
                updateAssetsTable();
                updatePortfolioValue();
                alert(`Successfully sold ${amount} ${asset.symbol}`);
            } else {
                alert(`You don't have enough ${asset.symbol} to sell`);
            }
        }
    }

    // Handle deposit button
    document.querySelector('.deposit-btn').addEventListener('click', () => {
        alert('Deposit functionality will be implemented in the future.');
    });

    // Initial updates
    updatePortfolioValue();
    updateAssetsTable();
}); 
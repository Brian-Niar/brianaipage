// Admin Dashboard JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is admin
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const isAdmin = localStorage.getItem('isAdmin');
    
    if (!isAuthenticated || !isAdmin) {
        window.location.href = 'index.html';
        return;
    }

    // Initialize the dashboard
    initializeDashboard();
});

function initializeDashboard() {
    // Load all users
    loadUsers();
    
    // Set up search functionality
    setupSearch();
    
    // Set up navigation
    setupNavigation();
}

function loadUsers() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const usersGrid = document.querySelector('.users-grid');
    
    if (users.length === 0) {
        usersGrid.innerHTML = '<p class="no-users">No users found</p>';
        return;
    }

    usersGrid.innerHTML = users.map(user => `
        <div class="user-card">
            <img src="${user.avatar || 'images/avatar1.png'}" alt="${user.name}" class="user-avatar">
            <div class="user-info">
                <h3 class="user-name">${user.name}</h3>
                <p class="user-email">${user.email}</p>
                <div class="user-details">
                    <span>Joined: ${new Date(user.createdAt).toLocaleDateString()}</span>
                    <span>Last Active: ${new Date(user.lastActive).toLocaleDateString()}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function setupSearch() {
    const searchInput = document.querySelector('.search-container input');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const filteredUsers = users.filter(user => 
            user.name.toLowerCase().includes(searchTerm) || 
            user.email.toLowerCase().includes(searchTerm)
        );
        
        const usersGrid = document.querySelector('.users-grid');
        if (filteredUsers.length === 0) {
            usersGrid.innerHTML = '<p class="no-users">No users found matching your search</p>';
            return;
        }

        usersGrid.innerHTML = filteredUsers.map(user => `
            <div class="user-card">
                <img src="${user.avatar || 'images/avatar1.png'}" alt="${user.name}" class="user-avatar">
                <div class="user-info">
                    <h3 class="user-name">${user.name}</h3>
                    <p class="user-email">${user.email}</p>
                    <div class="user-details">
                        <span>Joined: ${new Date(user.createdAt).toLocaleDateString()}</span>
                        <span>Last Active: ${new Date(user.lastActive).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        `).join('');
    });
}

function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const currentPath = window.location.pathname;
    
    navItems.forEach(item => {
        const href = item.getAttribute('href');
        if (currentPath.includes(href)) {
            item.classList.add('active');
        }
        
        item.addEventListener('click', (e) => {
            if (href === 'logout') {
                e.preventDefault();
                logout();
            }
        });
    });
}

function logout() {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
} 
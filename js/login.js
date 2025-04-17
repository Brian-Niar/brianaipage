document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const alertContainer = document.querySelector('.alert-container');
    const alertMessage = document.querySelector('.alert-message');
    const alertClose = document.querySelector('.alert-close');

    // Function to show alert
    function showAlert(message) {
        alertMessage.textContent = message;
        alertContainer.classList.add('show');
    }

    // Function to hide alert
    function hideAlert() {
        alertContainer.classList.remove('show');
    }

    // Close alert when clicking the close button
    alertClose.addEventListener('click', hideAlert);

    // Close alert when clicking outside
    alertContainer.addEventListener('click', (e) => {
        if (e.target === alertContainer) {
            hideAlert();
        }
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            // Check for admin credentials
            if (email === 'rubiniar888@gmail.com' && password === '12345678') {
                // Store admin authentication state
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('isAdmin', 'true');
                localStorage.setItem('user', JSON.stringify({
                    name: 'Admin',
                    email: email,
                    avatar: 'assets/avatar.jpg',
                    isAdmin: true
                }));

                // Redirect to admin dashboard
                window.location.href = 'admin.html';
                return;
            }

            // Get users from localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            
            // Find user by email
            const user = users.find(u => u.email === email);
            
            if (!user) {
                showAlert('User not found');
                return;
            }

            // Check password
            if (user.password !== password) {
                showAlert('Invalid password');
                return;
            }

            // Update last login time
            user.lastLogin = new Date().toISOString();
            
            // Store current user data
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('isAuthenticated', 'true');
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        } catch (error) {
            console.error('Login error:', error);
            showAlert('An error occurred during login. Please try again.');
        }
    });
}); 
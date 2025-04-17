document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    const profileImage = document.getElementById('profileImage');
    const imagePreview = document.getElementById('imagePreview');
    let selectedImage = null;

    // Handle image selection
    profileImage.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check if file is an image
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }

            // Check file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                alert('Image size should be less than 2MB');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.src = e.target.result;
                selectedImage = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Handle form submission
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            // Create user object with profile image
            const user = {
                name,
                email,
                password,
                avatar: selectedImage || 'assets/default-avatar.png',
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
                isAdmin: email === 'rubiniar888@gmail.com'
            };

            // Store user data in the database
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            
            // Check if user already exists
            if (users.some(u => u.email === email)) {
                alert('User with this email already exists');
                return;
            }

            // Add new user
            users.push(user);
            localStorage.setItem('users', JSON.stringify(users));

            // Store current user data
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('isAuthenticated', 'true');
            
            if (user.isAdmin) {
                localStorage.setItem('isAdmin', 'true');
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'dashboard.html';
            }
        } catch (error) {
            console.error('Error during signup:', error);
            alert('An error occurred during signup. Please try again.');
        }
    });

    // Add password validation feedback
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    function validatePasswords() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (confirmPassword && password !== confirmPassword) {
            confirmPasswordInput.setCustomValidity('Passwords do not match');
        } else {
            confirmPasswordInput.setCustomValidity('');
        }
    }

    passwordInput.addEventListener('input', validatePasswords);
    confirmPasswordInput.addEventListener('input', validatePasswords);
}); 
// Login Form Handler
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('errorMessage');
        const submitBtn = e.target.querySelector('button[type="submit"]');
        
        // Clear previous errors
        errorDiv.style.display = 'none';
        
        if (!username || !password) {
            errorDiv.textContent = 'Please enter both username and password';
            errorDiv.style.display = 'block';
            return;
        }
        
        // Disable submit button
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
        
        try {
            const response = await fetch('api/login.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            
            const data = await response.json();
            
            if (data.success) {
                if (data.role === 'admin') {
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = 'index.html';
                }
            } else {
                errorDiv.textContent = data.message || 'Invalid credentials';
                errorDiv.style.display = 'block';
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
            }
        } catch (error) {
            console.error('Login error:', error);
            errorDiv.textContent = 'An error occurred. Please try again.';
            errorDiv.style.display = 'block';
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
        }
    });
}

// Signup Form Handler
if (document.getElementById('signupForm')) {
    document.getElementById('signupForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const fullName = document.getElementById('fullName').value.trim();
        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const errorDiv = document.getElementById('errorMessage');
        const submitBtn = e.target.querySelector('button[type="submit"]');
        
        // Clear previous errors
        errorDiv.style.display = 'none';
        
        // Validation
        if (!fullName || !username || !email || !password || !confirmPassword) {
            errorDiv.textContent = 'All fields are required!';
            errorDiv.style.display = 'block';
            return;
        }
        
        if (password !== confirmPassword) {
            errorDiv.textContent = 'Passwords do not match!';
            errorDiv.style.display = 'block';
            return;
        }
        
        if (password.length < 6) {
            errorDiv.textContent = 'Password must be at least 6 characters!';
            errorDiv.style.display = 'block';
            return;
        }
        
        // Disable submit button
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
        
        try {
            const response = await fetch('api/signup.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullName, username, email, password })
            });
            
            const data = await response.json();
            
            if (data.success) {
                alert('Account created successfully! You can now login.');
                window.location.href = 'login.html';
            } else {
                errorDiv.textContent = data.message || 'An error occurred. Please try again.';
                errorDiv.style.display = 'block';
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-user-plus"></i> Create Account';
            }
        } catch (error) {
            console.error('Signup error:', error);
            errorDiv.textContent = 'An error occurred. Please try again.';
            errorDiv.style.display = 'block';
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-user-plus"></i> Create Account';
        }
    });
}




// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(inputId + '-icon');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

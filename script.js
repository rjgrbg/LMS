// Global variables
let allMaterials = [];
let currentFilter = 'all';
let isAuthenticated = false;

// Check authentication on page load
async function checkAuth() {
    try {
        const response = await fetch('api/check-auth.php');
        const data = await response.json();
        
        const userMenu = document.getElementById('userMenu');
        
        if (!data.authenticated) {
            // Show login button only
            userMenu.innerHTML = `
                <a href="login.html" class="btn btn-primary btn-small">
                    <i class="fas fa-sign-in-alt"></i> Login
                </a>
            `;
            return false;
        }
        
        // Show burger menu with user options
        if (data.role === 'admin') {
            userMenu.innerHTML = `
                <button class="burger-menu-btn" onclick="toggleBurgerMenu()">
                    <i class="fas fa-bars"></i>
                </button>
                <div class="burger-menu" id="burgerMenu">
                    <div class="burger-menu-header">
                        <i class="fas fa-user-circle"></i>
                        <span>${data.full_name}</span>
                    </div>
                    <a href="admin.html" class="burger-menu-item">
                        <i class="fas fa-user-shield"></i> Admin Panel
                    </a>
                    <button onclick="logout()" class="burger-menu-item logout-item">
                        <i class="fas fa-sign-out-alt"></i> Logout
                    </button>
                </div>
            `;
        } else {
            userMenu.innerHTML = `
                <button class="burger-menu-btn" onclick="toggleBurgerMenu()">
                    <i class="fas fa-bars"></i>
                </button>
                <div class="burger-menu" id="burgerMenu">
                    <div class="burger-menu-header">
                        <i class="fas fa-user-circle"></i>
                        <span>${data.full_name}</span>
                    </div>
                    <button onclick="logout()" class="burger-menu-item logout-item">
                        <i class="fas fa-sign-out-alt"></i> Logout
                    </button>
                </div>
            `;
        }
        
        // Show welcome toast notification
        showWelcomeToast(data.full_name);
        
        return true;
    } catch (error) {
        // Show login button on error
        const userMenu = document.getElementById('userMenu');
        userMenu.innerHTML = `
            <a href="login.html" class="btn btn-primary btn-small">
                <i class="fas fa-sign-in-alt"></i> Login
            </a>
        `;
        return false;
    }
}

// Toggle burger menu
function toggleBurgerMenu() {
    const menu = document.getElementById('burgerMenu');
    if (menu) {
        menu.classList.toggle('show');
    }
}

// Close burger menu when clicking outside
document.addEventListener('click', function(event) {
    const menu = document.getElementById('burgerMenu');
    const btn = document.querySelector('.burger-menu-btn');
    
    if (menu && btn && !menu.contains(event.target) && !btn.contains(event.target)) {
        menu.classList.remove('show');
    }
});

// Show welcome toast notification
function showWelcomeToast(name) {
    const toast = document.createElement('div');
    toast.className = 'welcome-toast';
    toast.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>Welcome, ${name}!</span>
    `;
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Hide and remove toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Logout function
async function logout() {
    try {
        await fetch('api/logout.php');
        window.location.href = 'index.html';
    } catch (error) {
        window.location.href = 'index.html';
    }
}

// Load materials on page load
document.addEventListener('DOMContentLoaded', async function() {
    isAuthenticated = await checkAuth();
    
    // Always load materials count for hero section
    loadMaterialsCount();
    
    if (!isAuthenticated) {
        // Show login required message
        showLoginRequired();
        // Show features, about, and footer for non-logged in users
        document.getElementById('featuresSection').style.display = 'block';
        document.getElementById('aboutSection').style.display = 'block';
        document.getElementById('footerSection').style.display = 'block';
    } else {
        // Load materials only if authenticated
        loadMaterials();
        setupFilterTabs();
        setupSearch();
        // Hide features, about, and footer for logged in users
        document.getElementById('featuresSection').style.display = 'none';
        document.getElementById('aboutSection').style.display = 'none';
        document.getElementById('footerSection').style.display = 'none';
    }
});

// Load materials count (public - for hero section)
function loadMaterialsCount() {
    fetch('api/get-materials.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                updateTotalMaterials(data.materials.length);
            }
        })
        .catch(error => {
            console.error('Error loading materials count:', error);
        });
}

// Setup search functionality
function setupSearch() {
    const searchBox = document.getElementById('searchBox');
    if (searchBox) {
        searchBox.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const filtered = allMaterials.filter(material => 
                material.title.toLowerCase().includes(searchTerm) ||
                material.description.toLowerCase().includes(searchTerm) ||
                material.type.toLowerCase().includes(searchTerm)
            );
            displayMaterials(filtered);
        });
    }
}

// Setup filter tabs
function setupFilterTabs() {
    const tabs = document.querySelectorAll('.filter-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            currentFilter = this.getAttribute('data-filter');
            filterMaterials(currentFilter);
        });
    });
}

// Function to load all materials
function loadMaterials() {
    const grid = document.getElementById('materials-grid');
    grid.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading materials...</p>
        </div>
    `;

    fetch('api/get-materials.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                allMaterials = data.materials;
                updateTotalMaterials(allMaterials.length);
                displayMaterials(allMaterials);
            } else {
                showEmptyState();
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showEmptyState();
        });
}

// Update total materials count
function updateTotalMaterials(count) {
    const totalElement = document.getElementById('totalMaterials');
    if (totalElement) {
        totalElement.textContent = count;
    }
}

// Filter materials
function filterMaterials(filter) {
    if (filter === 'all') {
        displayMaterials(allMaterials);
    } else {
        const filtered = allMaterials.filter(m => m.type === filter);
        displayMaterials(filtered);
    }
}

// Function to display materials in grid
function displayMaterials(materials) {
    const grid = document.getElementById('materials-grid');
    grid.innerHTML = '';

    if (materials.length === 0) {
        showEmptyState();
        return;
    }

    materials.forEach(material => {
        const card = createMaterialCard(material);
        grid.appendChild(card);
    });
}

// Show empty state
function showEmptyState() {
    const grid = document.getElementById('materials-grid');
    grid.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-folder-open"></i>
            <h3>No materials found</h3>
            <p>There are no materials available at the moment.</p>
        </div>
    `;
}

// Show login required message
function showLoginRequired() {
    const grid = document.getElementById('materials-grid');
    grid.innerHTML = '';
    
    // Hide filter tabs and download all button
    const filterSection = document.querySelector('.filter-section');
    if (filterSection) {
        filterSection.style.display = 'none';
    }
    
    const materialsSection = document.querySelector('.materials-section');
    if (materialsSection) {
        materialsSection.style.display = 'none';
    }
}

// Function to create material card
function createMaterialCard(material) {
    const card = document.createElement('div');
    card.className = 'material-card';

    const fileExt = material.file_name.split('.').pop().toLowerCase();
    let iconClass = 'fas fa-file';
    let iconType = '';
    
    if (fileExt === 'pdf') {
        iconClass = 'fas fa-file-pdf';
        iconType = 'pdf';
    } else if (['ppt', 'pptx'].includes(fileExt)) {
        iconClass = 'fas fa-file-powerpoint';
        iconType = 'ppt';
    } else if (['doc', 'docx'].includes(fileExt)) {
        iconClass = 'fas fa-file-word';
        iconType = 'doc';
    }

    const date = new Date(material.upload_date);
    const formattedDate = date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    });

    card.innerHTML = `
        <div class="material-header">
            <div class="material-icon ${iconType}">
                <i class="${iconClass}"></i>
            </div>
            <div class="material-info">
                <span class="material-type">${material.type}</span>
                <h4>${material.title}</h4>
            </div>
        </div>
        <p>${material.description}</p>
        <div class="material-meta">
            <span><i class="fas fa-calendar"></i> ${formattedDate}</span>
        </div>
        <div class="material-actions">
            <button class="btn btn-primary btn-small" onclick="downloadMaterial(${material.id})">
                <i class="fas fa-download"></i> Download
            </button>
        </div>
    `;

    return card;
}

// Function to download material
function downloadMaterial(id) {
    if (!isAuthenticated) {
        alert('Please login to download materials');
        window.location.href = 'login.html';
        return;
    }
    window.location.href = `api/download-material.php?id=${id}`;
}

// Download all materials
function downloadAll() {
    if (!isAuthenticated) {
        alert('Please login to download materials');
        window.location.href = 'login.html';
        return;
    }
    
    if (allMaterials.length === 0) {
        alert('No materials available to download.');
        return;
    }
    
    if (confirm(`Download all ${allMaterials.length} materials as a ZIP file?`)) {
        window.location.href = 'api/download-all.php';
    }
}
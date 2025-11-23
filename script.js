// Global variables
let allMaterials = [];
let currentFilter = 'all';

// Load materials on page load
document.addEventListener('DOMContentLoaded', function() {
    loadMaterials();
    setupFilterTabs();
    setupSearch();
});

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
    window.location.href = `api/download-material.php?id=${id}`;
}

// Download all materials
function downloadAll() {
    if (allMaterials.length === 0) {
        alert('No materials available to download.');
        return;
    }
    
    if (confirm(`Download all ${allMaterials.length} materials as a ZIP file?`)) {
        window.location.href = 'api/download-all.php';
    }
}
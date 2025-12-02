// Admin Dashboard Functions

function loadDashboard() {
    fetch('api/get-dashboard-stats.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                updateDashboardStats(data.stats);
                displayRecentMaterials(data.recent_materials);
            } else {
                console.error('Failed to load dashboard:', data.message);
            }
        })
        .catch(error => {
            console.error('Error loading dashboard:', error);
        });
    
    // Load statistics charts
    if (typeof loadStatistics === 'function') {
        loadStatistics();
    }
}

function updateDashboardStats(stats) {
    document.getElementById('dashTotalStudents').textContent = stats.total_students || 0;
    document.getElementById('dashTotalMaterials').textContent = stats.total_materials || 0;
    document.getElementById('dashRecentStudents').textContent = `+${stats.recent_students || 0} this week`;
    
    // Update chart with animation
    updateMaterialsChart(stats);
}

function updateMaterialsChart(stats) {
    const lectures = stats.lectures || 0;
    const pdfs = stats.pdfs || 0;
    const readings = stats.readings || 0;
    const assignments = stats.assignments || 0;
    
    // Find the maximum value for scaling
    const maxValue = Math.max(lectures, pdfs, readings, assignments, 1);
    
    // Get all chart bars
    const chartBars = document.querySelectorAll('.chart-bar');
    const values = [lectures, pdfs, readings, assignments];
    
    // Animate each bar
    chartBars.forEach((bar, index) => {
        const value = values[index];
        const percentage = (value / maxValue) * 100;
        
        // Update value display
        const valueSpan = bar.querySelector('.chart-value');
        if (valueSpan) {
            valueSpan.textContent = value;
        }
        
        // Animate height with a slight delay for each bar
        setTimeout(() => {
            bar.style.height = `${Math.max(percentage, 16)}%`; // Minimum 16% for visibility
            bar.setAttribute('data-value', value);
        }, index * 100);
    });
}

function displayRecentMaterials(materials) {
    const list = document.getElementById('recentMaterialsList');
    
    if (!materials || materials.length === 0) {
        list.innerHTML = `
            <div class="empty-state-small">
                <i class="fas fa-folder-open"></i>
                <p>No materials uploaded</p>
            </div>
        `;
        return;
    }
    
    list.innerHTML = '';
    materials.forEach(material => {
        const date = new Date(material.upload_date);
        const timeAgo = getTimeAgo(date);
        
        const fileExt = material.file_name.split('.').pop().toLowerCase();
        let iconClass = 'fa-file';
        let iconColor = 'info';
        
        if (fileExt === 'pdf') {
            iconClass = 'fa-file-pdf';
            iconColor = 'danger';
        } else if (['ppt', 'pptx'].includes(fileExt)) {
            iconClass = 'fa-file-powerpoint';
            iconColor = 'warning';
        } else if (['doc', 'docx'].includes(fileExt)) {
            iconClass = 'fa-file-word';
            iconColor = 'primary';
        }
        
        const item = document.createElement('div');
        item.className = 'dashboard-list-item';
        item.innerHTML = `
            <div class="list-item-icon ${iconColor}">
                <i class="fas ${iconClass}"></i>
            </div>
            <div class="list-item-content">
                <h4>${escapeHtml(material.title)}</h4>
                <p>${escapeHtml(material.type)}</p>
                <small>${timeAgo}</small>
            </div>
        `;
        list.appendChild(item);
    });
}

function getTimeAgo(date) {
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return date.toLocaleDateString();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Admin Dashboard Functions

function loadDashboard() {
    fetch('api/get-dashboard-stats.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                updateDashboardStats(data.stats);
                displayRecentSubmissions(data.recent_submissions);
                displayUpcomingDeadlines(data.upcoming_deadlines);
                displayRecentMaterials(data.recent_materials);
            } else {
                console.error('Failed to load dashboard:', data.message);
            }
        })
        .catch(error => {
            console.error('Error loading dashboard:', error);
        });
}

function updateDashboardStats(stats) {
    document.getElementById('dashTotalStudents').textContent = stats.total_students || 0;
    document.getElementById('dashTotalMaterials').textContent = stats.total_materials || 0;
    document.getElementById('dashTotalClassworks').textContent = stats.total_classworks || 0;
    document.getElementById('dashPendingGrading').textContent = stats.pending_grading || 0;
    document.getElementById('dashRecentStudents').textContent = `+${stats.recent_students || 0} this week`;
}

function displayRecentSubmissions(submissions) {
    const list = document.getElementById('recentSubmissionsList');
    
    if (!submissions || submissions.length === 0) {
        list.innerHTML = `
            <div class="empty-state-small">
                <i class="fas fa-inbox"></i>
                <p>No recent submissions</p>
            </div>
        `;
        return;
    }
    
    list.innerHTML = '';
    submissions.forEach(submission => {
        const date = new Date(submission.submitted_at);
        const timeAgo = getTimeAgo(date);
        
        const statusClass = submission.status === 'graded' ? 'success' : 'warning';
        const statusText = submission.status === 'graded' ? 'Graded' : 'Pending';
        
        const item = document.createElement('div');
        item.className = 'dashboard-list-item';
        item.innerHTML = `
            <div class="list-item-icon ${statusClass}">
                <i class="fas fa-${submission.status === 'graded' ? 'check-circle' : 'clock'}"></i>
            </div>
            <div class="list-item-content">
                <h4>${escapeHtml(submission.full_name)}</h4>
                <p>${escapeHtml(submission.classwork_title)}</p>
                <small>${timeAgo}</small>
            </div>
            <span class="badge badge-${statusClass}">${statusText}</span>
        `;
        list.appendChild(item);
    });
}

function displayUpcomingDeadlines(deadlines) {
    const list = document.getElementById('upcomingDeadlinesList');
    
    if (!deadlines || deadlines.length === 0) {
        list.innerHTML = `
            <div class="empty-state-small">
                <i class="fas fa-calendar-check"></i>
                <p>No upcoming deadlines</p>
            </div>
        `;
        return;
    }
    
    list.innerHTML = '';
    deadlines.forEach(deadline => {
        const dueDate = new Date(deadline.due_date);
        const now = new Date();
        const daysUntil = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
        
        const urgencyClass = daysUntil <= 2 ? 'danger' : daysUntil <= 5 ? 'warning' : 'info';
        
        const item = document.createElement('div');
        item.className = 'dashboard-list-item';
        item.innerHTML = `
            <div class="list-item-icon ${urgencyClass}">
                <i class="fas fa-calendar-alt"></i>
            </div>
            <div class="list-item-content">
                <h4>${escapeHtml(deadline.title)}</h4>
                <p>${dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                <small>${daysUntil} day${daysUntil !== 1 ? 's' : ''} remaining</small>
            </div>
            <span class="badge badge-${urgencyClass}">${deadline.max_score} pts</span>
        `;
        list.appendChild(item);
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

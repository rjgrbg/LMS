// Global variables
let allClassworks = [];
let currentFilter = 'all';

// Toggle burger menu
function toggleBurgerMenu() {
    const menu = document.getElementById('burgerMenu');
    if (menu) {
        menu.classList.toggle('show');
    }
}

// Close burger menu
function closeBurgerMenu() {
    const menu = document.getElementById('burgerMenu');
    if (menu) {
        menu.classList.remove('show');
    }
}

// Close burger menu when clicking outside
document.addEventListener('click', function(event) {
    const menu = document.getElementById('burgerMenu');
    const btn = document.querySelector('.burger-menu-btn');
    
    if (menu && btn && !menu.contains(event.target) && !btn.contains(event.target)) {
        closeBurgerMenu();
    }
});

// Logout function
async function logout() {
    try {
        await fetch('api/logout.php');
        window.location.href = 'index.html';
    } catch (error) {
        window.location.href = 'index.html';
    }
}

// Load classwork on page load
document.addEventListener('DOMContentLoaded', function() {
    loadClassworks();
    setupFilterTabs();
    setupSearch();
    setupSubmitForm();
    setupFileInput();
});

// Setup file input display
function setupFileInput() {
    const fileInput = document.getElementById('submissionFile');
    if (fileInput) {
        fileInput.addEventListener('change', function() {
            const fileName = this.files[0]?.name;
            const fileNameDisplay = document.getElementById('submitFileName');
            if (fileName && fileNameDisplay) {
                fileNameDisplay.textContent = `📎 Selected: ${fileName}`;
                fileNameDisplay.classList.add('show');
            }
        });
    }
}

// Setup search functionality
function setupSearch() {
    const searchBox = document.getElementById('searchBox');
    if (searchBox) {
        searchBox.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const filtered = allClassworks.filter(classwork => 
                classwork.title.toLowerCase().includes(searchTerm) ||
                classwork.description.toLowerCase().includes(searchTerm)
            );
            displayClassworks(filtered);
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
            filterClassworks(currentFilter);
        });
    });
}

// Load classworks
function loadClassworks() {
    const grid = document.getElementById('classwork-grid');
    grid.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading classwork...</p>
        </div>
    `;

    fetch('api/get-classworks.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                allClassworks = data.classworks;
                updateStats(data.stats);
                displayClassworks(allClassworks);
            } else {
                showEmptyState();
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showEmptyState();
        });
}

// Update statistics
function updateStats(stats) {
    document.getElementById('totalClassworks').textContent = stats.total || 0;
    document.getElementById('submittedCount').textContent = stats.submitted || 0;
    document.getElementById('averageScore').textContent = stats.average_score || '-';
}

// Filter classworks
function filterClassworks(filter) {
    if (filter === 'all') {
        displayClassworks(allClassworks);
    } else {
        const filtered = allClassworks.filter(c => c.submission_status === filter);
        displayClassworks(filtered);
    }
}

// Display classworks
function displayClassworks(classworks) {
    const grid = document.getElementById('classwork-grid');
    grid.innerHTML = '';

    if (classworks.length === 0) {
        showEmptyState();
        return;
    }

    classworks.forEach(classwork => {
        const card = createClassworkCard(classwork);
        grid.appendChild(card);
    });
}

// Create classwork card
function createClassworkCard(classwork) {
    const card = document.createElement('div');
    card.className = 'material-card classwork-card';

    const dueDate = new Date(classwork.due_date);
    const now = new Date();
    const isOverdue = dueDate < now && classwork.submission_status === 'pending';
    
    const formattedDueDate = dueDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    let statusBadge = '';
    let actionButton = '';
    
    if (classwork.submission_status === 'pending') {
        statusBadge = `<span class="status-badge pending">${isOverdue ? 'Overdue' : 'Pending'}</span>`;
        actionButton = `
            <button class="btn btn-primary btn-small" onclick="openSubmitModal(${classwork.id}, '${escapeHtml(classwork.title)}')">
                <i class="fas fa-upload"></i> Submit Work
            </button>
        `;
    } else if (classwork.submission_status === 'submitted') {
        statusBadge = `<span class="status-badge submitted">Submitted</span>`;
        actionButton = `
            <button class="btn btn-secondary btn-small" disabled>
                <i class="fas fa-check"></i> Submitted
            </button>
        `;
    } else if (classwork.submission_status === 'graded') {
        statusBadge = `<span class="status-badge graded">Graded: ${classwork.score}/${classwork.max_score}</span>`;
        actionButton = `
            <button class="btn btn-view btn-small" onclick="viewFeedback(${classwork.id})">
                <i class="fas fa-eye"></i> View Feedback
            </button>
        `;
    }

    card.innerHTML = `
        <div class="material-header">
            <div class="material-icon ${isOverdue ? 'overdue' : ''}">
                <i class="fas fa-clipboard-list"></i>
            </div>
            <div class="material-info">
                <span class="material-type">CLASSWORK</span>
                <h4>${escapeHtml(classwork.title)}</h4>
            </div>
        </div>
        <p>${escapeHtml(classwork.description)}</p>
        <div class="material-meta">
            <span><i class="fas fa-calendar"></i> Due: ${formattedDueDate}</span>
            <span><i class="fas fa-star"></i> ${classwork.max_score} points</span>
        </div>
        <div class="classwork-status">
            ${statusBadge}
        </div>
        <div class="material-actions">
            ${actionButton}
        </div>
    `;

    return card;
}

// Helper function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show empty state
function showEmptyState() {
    const grid = document.getElementById('classwork-grid');
    grid.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-clipboard"></i>
            <h3>No classwork available</h3>
            <p>Check back later for new assignments.</p>
        </div>
    `;
}

// Open submit modal
function openSubmitModal(classworkId, title) {
    document.getElementById('classworkId').value = classworkId;
    document.getElementById('modalClassworkTitle').textContent = title;
    document.getElementById('submitModal').classList.add('show');
    document.getElementById('submitForm').reset();
    const fileNameDisplay = document.getElementById('submitFileName');
    if (fileNameDisplay) {
        fileNameDisplay.classList.remove('show');
    }
}

// Close submit modal
function closeSubmitModal() {
    document.getElementById('submitModal').classList.remove('show');
    document.getElementById('submitForm').reset();
}

// Setup submit form
function setupSubmitForm() {
    const form = document.getElementById('submitForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            submitClasswork();
        });
    }
}

// Submit classwork
function submitClasswork() {
    const form = document.getElementById('submitForm');
    const statusDiv = document.getElementById('submitStatus');
    const submitBtn = form.querySelector('button[type="submit"]');
    const fileInput = document.getElementById('submissionFile');

    if (!fileInput.files || fileInput.files.length === 0) {
        showError(statusDiv, 'Please select a file to upload');
        return;
    }

    const file = fileInput.files[0];
    const maxSize = 50 * 1024 * 1024; // 50MB
    
    if (file.size > maxSize) {
        showError(statusDiv, `File size exceeds 50MB limit`);
        return;
    }

    const formData = new FormData(form);
    formData.append('classwork_id', document.getElementById('classworkId').value);

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

    statusDiv.className = 'upload-status show';
    statusDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading submission...';

    fetch('api/submit-classwork.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            statusDiv.className = 'upload-status success show';
            statusDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${data.message}`;
            
            setTimeout(() => {
                closeSubmitModal();
                loadClassworks();
            }, 1500);
        } else {
            showError(statusDiv, data.message || 'Submission failed');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showError(statusDiv, 'Network error. Please try again.');
    })
    .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Work';
    });
}

// Show error
function showError(statusDiv, message) {
    statusDiv.className = 'upload-status error show';
    statusDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
}

// View feedback
function viewFeedback(classworkId) {
    fetch(`api/get-submission-feedback.php?classwork_id=${classworkId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(`Score: ${data.submission.score}/${data.submission.max_score}\n\nFeedback: ${data.submission.feedback || 'No feedback provided yet.'}`);
            } else {
                alert('Unable to load feedback');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error loading feedback');
        });
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('submitModal');
    if (event.target === modal) {
        closeSubmitModal();
    }
}

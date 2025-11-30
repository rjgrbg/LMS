// Admin Classwork Management

let allAdminClassworks = [];
let currentClassworkSubmissions = [];

// Load admin classworks on section show
function loadAdminClassworks() {
    const list = document.getElementById('adminClassworkList');
    list.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading classwork...</p>
        </div>
    `;

    fetch('api/get-admin-classworks.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                allAdminClassworks = data.classworks;
                displayAdminClassworks(allAdminClassworks);
            } else {
                showClassworkEmptyState();
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showClassworkEmptyState();
        });
}

// Display admin classworks
function displayAdminClassworks(classworks) {
    const list = document.getElementById('adminClassworkList');
    list.innerHTML = '';

    if (classworks.length === 0) {
        showClassworkEmptyState();
        return;
    }

    classworks.forEach(classwork => {
        const card = createAdminClassworkCard(classwork);
        list.appendChild(card);
    });
}

// Create admin classwork card
function createAdminClassworkCard(classwork) {
    const card = document.createElement('div');
    card.className = 'admin-material-card';

    const dueDate = new Date(classwork.due_date);
    const formattedDueDate = dueDate.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const submissionRate = classwork.total_students > 0 
        ? Math.round((classwork.total_submissions / classwork.total_students) * 100)
        : 0;

    card.innerHTML = `
        <div class="admin-material-content">
            <div class="material-icon">
                <i class="fas fa-clipboard-list"></i>
            </div>
            <div class="admin-material-details">
                <h4>${escapeHtml(classwork.title)}</h4>
                <p>${escapeHtml(classwork.description)}</p>
                <small>
                    <span><i class="fas fa-calendar"></i> Due: ${formattedDueDate}</span>
                    <span><i class="fas fa-star"></i> ${classwork.max_score} points</span>
                    <span><i class="fas fa-paper-plane"></i> ${classwork.total_submissions}/${classwork.total_students} submitted (${submissionRate}%)</span>
                    <span><i class="fas fa-check-circle"></i> ${classwork.graded_count} graded</span>
                </small>
            </div>
        </div>
        <div class="admin-material-actions">
            <button class="btn btn-primary btn-small" onclick="viewSubmissions(${classwork.id}, '${escapeHtml(classwork.title)}')">
                <i class="fas fa-eye"></i> View Submissions
            </button>
            <button class="btn btn-delete btn-small" onclick="deleteClasswork(${classwork.id}, '${escapeHtml(classwork.title)}')">
                <i class="fas fa-trash"></i> Delete
            </button>
        </div>
    `;

    return card;
}

// Show empty state
function showClassworkEmptyState() {
    const list = document.getElementById('adminClassworkList');
    list.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-clipboard"></i>
            <h3>No classwork created yet</h3>
            <p>Create your first assignment above!</p>
        </div>
    `;
}

// Setup create classwork form
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('createClassworkForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            createClasswork();
        });
    }

    const gradeForm = document.getElementById('gradeForm');
    if (gradeForm) {
        gradeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitGrade();
        });
    }
});

// Create classwork
function createClasswork() {
    const form = document.getElementById('createClassworkForm');
    const statusDiv = document.getElementById('createClassworkStatus');
    const submitBtn = form.querySelector('button[type="submit"]');

    const title = document.getElementById('classworkTitle').value.trim();
    const description = document.getElementById('classworkDescription').value.trim();
    const due_date = document.getElementById('classworkDueDate').value;
    const max_score = parseInt(document.getElementById('classworkMaxScore').value);

    if (!title || !description || !due_date) {
        showError(statusDiv, 'All fields are required');
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating...';

    statusDiv.className = 'upload-status show';
    statusDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating classwork...';

    fetch('api/create-classwork.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, due_date, max_score })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            statusDiv.className = 'upload-status success show';
            statusDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${data.message}`;
            
            form.reset();
            loadAdminClassworks();
            
            setTimeout(() => {
                statusDiv.classList.remove('show');
            }, 3000);
        } else {
            showError(statusDiv, data.message || 'Failed to create classwork');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showError(statusDiv, 'Network error. Please try again.');
    })
    .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-plus"></i> Create Classwork';
    });
}

// View submissions
function viewSubmissions(classworkId, title) {
    document.getElementById('submissionsModalTitle').textContent = title;
    document.getElementById('submissionsModalSubtitle').textContent = 'Student Submissions';
    document.getElementById('submissionsModal').classList.add('show');
    
    const list = document.getElementById('submissionsList');
    list.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading submissions...</p>
        </div>
    `;

    fetch(`api/get-classwork-submissions.php?classwork_id=${classworkId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                currentClassworkSubmissions = data.submissions;
                displaySubmissions(data.submissions, data.classwork);
            } else {
                list.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-inbox"></i>
                        <h3>No submissions yet</h3>
                        <p>Students haven't submitted their work yet.</p>
                    </div>
                `;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            list.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-exclamation-circle"></i>
                    <h3>Error loading submissions</h3>
                    <p>Please try again.</p>
                </div>
            `;
        });
}

// Display submissions
function displaySubmissions(submissions, classwork) {
    const list = document.getElementById('submissionsList');
    
    if (submissions.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <h3>No submissions yet</h3>
                <p>Students haven't submitted their work yet.</p>
            </div>
        `;
        return;
    }

    list.innerHTML = '';
    
    submissions.forEach(submission => {
        const submittedDate = new Date(submission.submitted_at);
        const formattedDate = submittedDate.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const statusBadge = submission.status === 'graded' 
            ? `<span class="status-badge graded">Graded: ${submission.score}/${classwork.max_score}</span>`
            : submission.status === 'late'
            ? `<span class="status-badge pending">Late Submission</span>`
            : `<span class="status-badge submitted">Submitted</span>`;

        const gradeButton = submission.status === 'graded'
            ? `<button class="btn btn-secondary btn-small" onclick="openGradeModal(${submission.id}, '${escapeHtml(submission.full_name)}', ${classwork.max_score}, ${submission.score}, '${escapeHtml(submission.feedback || '')}')">
                <i class="fas fa-edit"></i> Edit Grade
            </button>`
            : `<button class="btn btn-primary btn-small" onclick="openGradeModal(${submission.id}, '${escapeHtml(submission.full_name)}', ${classwork.max_score})">
                <i class="fas fa-star"></i> Grade
            </button>`;

        const submissionCard = document.createElement('div');
        submissionCard.className = 'submission-card';
        submissionCard.innerHTML = `
            <div class="submission-header">
                <div>
                    <h4><i class="fas fa-user"></i> ${escapeHtml(submission.full_name)}</h4>
                    <p>${escapeHtml(submission.email)}</p>
                </div>
                ${statusBadge}
            </div>
            <div class="submission-details">
                <span><i class="fas fa-file"></i> ${escapeHtml(submission.file_name)}</span>
                <span><i class="fas fa-clock"></i> ${formattedDate}</span>
            </div>
            ${submission.feedback ? `<div class="submission-feedback"><strong>Feedback:</strong> ${escapeHtml(submission.feedback)}</div>` : ''}
            <div class="submission-actions">
                <a href="api/download-submission.php?id=${submission.id}" class="btn btn-view btn-small" target="_blank">
                    <i class="fas fa-download"></i> Download
                </a>
                ${gradeButton}
            </div>
        `;
        
        list.appendChild(submissionCard);
    });
}

// Close submissions modal
function closeSubmissionsModal() {
    document.getElementById('submissionsModal').classList.remove('show');
}

// Open grade modal
function openGradeModal(submissionId, studentName, maxScore, currentScore = null, currentFeedback = '') {
    document.getElementById('gradeSubmissionId').value = submissionId;
    document.getElementById('gradeMaxScore').value = maxScore;
    document.getElementById('gradeModalStudent').textContent = studentName;
    document.getElementById('gradeScore').max = maxScore;
    document.getElementById('gradeScoreHint').textContent = `Out of ${maxScore} points`;
    
    if (currentScore !== null) {
        document.getElementById('gradeScore').value = currentScore;
        document.getElementById('gradeFeedback').value = currentFeedback;
    } else {
        document.getElementById('gradeForm').reset();
        document.getElementById('gradeScore').max = maxScore;
    }
    
    document.getElementById('gradeModal').classList.add('show');
}

// Close grade modal
function closeGradeModal() {
    document.getElementById('gradeModal').classList.remove('show');
    document.getElementById('gradeForm').reset();
}

// Submit grade
function submitGrade() {
    const form = document.getElementById('gradeForm');
    const statusDiv = document.getElementById('gradeStatus');
    const submitBtn = form.querySelector('button[type="submit"]');

    const submission_id = parseInt(document.getElementById('gradeSubmissionId').value);
    const score = parseInt(document.getElementById('gradeScore').value);
    const max_score = parseInt(document.getElementById('gradeMaxScore').value);
    const feedback = document.getElementById('gradeFeedback').value.trim();

    if (score < 0 || score > max_score) {
        showError(statusDiv, `Score must be between 0 and ${max_score}`);
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

    statusDiv.className = 'upload-status show';
    statusDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting grade...';

    fetch('api/grade-submission.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ submission_id, score, feedback })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            statusDiv.className = 'upload-status success show';
            statusDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${data.message}`;
            
            setTimeout(() => {
                closeGradeModal();
                // Reload the submissions in the current modal
                const classworkId = currentClassworkSubmissions[0]?.classwork_id;
                if (classworkId) {
                    const classwork = allAdminClassworks.find(c => c.id === classworkId);
                    if (classwork) {
                        viewSubmissions(classworkId, classwork.title);
                    }
                }
                loadAdminClassworks();
            }, 1000);
        } else {
            showError(statusDiv, data.message || 'Failed to submit grade');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showError(statusDiv, 'Network error. Please try again.');
    })
    .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Submit Grade';
    });
}

// Delete classwork
function deleteClasswork(id, title) {
    if (confirm(`Are you sure you want to delete "${title}"?\n\nThis will also delete all student submissions. This action cannot be undone.`)) {
        fetch('api/delete-classwork.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification('Classwork deleted successfully!', 'success');
                loadAdminClassworks();
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            alert('Error deleting classwork. Please try again.');
            console.error('Error:', error);
        });
    }
}

// Helper function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show error
function showError(statusDiv, message) {
    statusDiv.className = 'upload-status error show';
    statusDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
}

// Show notification
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `upload-status ${type} show`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        ${message}
    `;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '10000';
    notification.style.minWidth = '300px';
    notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

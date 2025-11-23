// Global variables
let allAdminMaterials = [];
let currentAdminFilter = 'all';

// Load materials on page load
document.addEventListener('DOMContentLoaded', function() {
    loadAdminMaterials();
    setupUploadForm();
    setupFileInput();
    setupAdminFilterTabs();
    setupAdminSearch();
    setupEditForm();
});

// Setup file input display
function setupFileInput() {
    const fileInput = document.getElementById('materialFile');
    if (fileInput) {
        fileInput.addEventListener('change', function() {
            const fileName = this.files[0]?.name;
            const fileNameDisplay = document.getElementById('fileName');
            if (fileName && fileNameDisplay) {
                fileNameDisplay.textContent = `📎 Selected: ${fileName}`;
                fileNameDisplay.classList.add('show');
            }
        });
    }
}

// Setup upload form
function setupUploadForm() {
    const form = document.getElementById('uploadForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            uploadMaterial();
        });
    }
}

// Setup edit form
function setupEditForm() {
    const form = document.getElementById('editForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            updateMaterial();
        });
    }
}

// Setup admin search functionality
function setupAdminSearch() {
    const searchBox = document.getElementById('adminSearchBox');
    if (searchBox) {
        searchBox.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            let filtered = allAdminMaterials;
            
            // Apply current filter first
            if (currentAdminFilter !== 'all') {
                filtered = filtered.filter(m => m.type === currentAdminFilter);
            }
            
            // Then apply search
            filtered = filtered.filter(material => 
                material.title.toLowerCase().includes(searchTerm) ||
                material.description.toLowerCase().includes(searchTerm) ||
                material.file_name.toLowerCase().includes(searchTerm)
            );
            
            displayAdminMaterials(filtered);
        });
    }
}

// Setup filter tabs for admin
function setupAdminFilterTabs() {
    const tabs = document.querySelectorAll('.filter-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            currentAdminFilter = this.getAttribute('data-filter');
            filterAdminMaterials(currentAdminFilter);
        });
    });
}

// Filter admin materials
function filterAdminMaterials(filter) {
    const searchBox = document.getElementById('adminSearchBox');
    if (searchBox) {
        searchBox.value = ''; // Clear search when filtering
    }
    
    if (filter === 'all') {
        displayAdminMaterials(allAdminMaterials);
    } else {
        const filtered = allAdminMaterials.filter(m => m.type === filter);
        displayAdminMaterials(filtered);
    }
}

// Update material counts
function updateMaterialCounts(filtered, total) {
    const filteredCountEl = document.getElementById('filteredCount');
    const totalCountEl = document.getElementById('totalCount');
    
    if (filteredCountEl) filteredCountEl.textContent = filtered;
    if (totalCountEl) totalCountEl.textContent = total;
}

// Function to upload material
function uploadMaterial() {
    const form = document.getElementById('uploadForm');
    const statusDiv = document.getElementById('uploadStatus');
    const submitBtn = form.querySelector('button[type="submit"]');

    // Validate form fields before submission
    const title = document.getElementById('materialTitle').value.trim();
    const type = document.getElementById('materialType').value;
    const description = document.getElementById('materialDescription').value.trim();
    const fileInput = document.getElementById('materialFile');

    // Clear previous status
    statusDiv.classList.remove('show');

    // Client-side validation
    if (!title) {
        showError(statusDiv, 'Please enter a material title');
        return;
    }

    if (!type) {
        showError(statusDiv, 'Please select a material type');
        return;
    }

    if (!description) {
        showError(statusDiv, 'Please enter a description');
        return;
    }

    if (!fileInput.files || fileInput.files.length === 0) {
        showError(statusDiv, 'Please select a file to upload');
        return;
    }

    // Check file size (100MB)
    const file = fileInput.files[0];
    const maxSize = 100 * 1024 * 1024; // 100MB in bytes
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    
    console.log(`File size: ${fileSizeMB}MB (${file.size} bytes)`);
    console.log(`Max allowed: 100MB (${maxSize} bytes)`);
    
    if (file.size > maxSize) {
        showError(statusDiv, `File size (${fileSizeMB}MB) exceeds 100MB limit`);
        return;
    }

    // Check file extension
    const allowedExtensions = ['pdf', 'ppt', 'pptx', 'doc', 'docx'];
    const fileExt = file.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(fileExt)) {
        showError(statusDiv, `Invalid file type. Only PDF, PPT, PPTX, DOC, and DOCX files are allowed`);
        return;
    }

    // Create FormData
    const formData = new FormData(form);

    // Disable submit button and show loading
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';

    // Show loading state
    statusDiv.className = 'upload-status show';
    statusDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading material...';

    // Log for debugging
    console.log('Uploading file:', file.name, 'Size:', file.size, 'Type:', fileExt);

    fetch('api/upload-material.php', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        console.log('Response status:', response.status);
        return response.text();
    })
    .then(text => {
        console.log('Response text:', text);
        try {
            const data = JSON.parse(text);
            if (data.success) {
                statusDiv.className = 'upload-status success show';
                statusDiv.innerHTML = `
                    <i class="fas fa-check-circle"></i> ${data.message}
                `;
                
                // Reset form
                form.reset();
                const fileNameDisplay = document.getElementById('fileName');
                if (fileNameDisplay) {
                    fileNameDisplay.classList.remove('show');
                }
                
                // Reload materials list
                setTimeout(() => {
                    loadAdminMaterials();
                }, 500);
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    statusDiv.classList.remove('show');
                }, 5000);
            } else {
                showError(statusDiv, data.message || 'Unknown error occurred');
            }
        } catch (e) {
            console.error('JSON parse error:', e);
            showError(statusDiv, 'Server response error. Check console for details.');
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
        showError(statusDiv, 'Network error. Please check your connection and try again.');
    })
    .finally(() => {
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-upload"></i> Upload Material';
    });
}

// Helper function to show errors
function showError(statusDiv, message) {
    statusDiv.className = 'upload-status error show';
    statusDiv.innerHTML = `
        <i class="fas fa-exclamation-circle"></i> ${message}
    `;
    
    // Scroll to error message
    statusDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Function to load admin materials list
function loadAdminMaterials() {
    const list = document.getElementById('adminMaterialsList');
    list.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading materials...</p>
        </div>
    `;

    fetch('api/get-materials.php')
        .then(response => response.json())
        .then(data => {
            console.log('Materials loaded:', data);
            if (data.success) {
                allAdminMaterials = data.materials;
                updateMaterialCounts(data.materials.length, data.materials.length);
                
                if (data.materials.length > 0) {
                    // Apply current filter
                    filterAdminMaterials(currentAdminFilter);
                } else {
                    showEmptyState();
                }
            } else {
                showEmptyState();
            }
        })
        .catch(error => {
            console.error('Error loading materials:', error);
            showEmptyState();
        });
}

// Show empty state
function showEmptyState() {
    const list = document.getElementById('adminMaterialsList');
    list.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-folder-open"></i>
            <h3>No materials uploaded yet</h3>
            <p>Upload your first material to get started!</p>
        </div>
    `;
    updateMaterialCounts(0, 0);
}

// Function to display materials in admin list
function displayAdminMaterials(materials) {
    const list = document.getElementById('adminMaterialsList');
    list.innerHTML = '';

    if (materials.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>No materials found</h3>
                <p>Try adjusting your search or filter.</p>
            </div>
        `;
        updateMaterialCounts(0, allAdminMaterials.length);
        return;
    }

    updateMaterialCounts(materials.length, allAdminMaterials.length);

    materials.forEach(material => {
        const card = createAdminMaterialCard(material);
        list.appendChild(card);
    });
}

// Function to create admin material card
function createAdminMaterialCard(material) {
    const card = document.createElement('div');
    card.className = 'admin-material-card';

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
        month: 'long', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    card.innerHTML = `
        <div class="admin-material-content">
            <div class="material-icon ${iconType}">
                <i class="${iconClass}"></i>
            </div>
            <div class="admin-material-details">
                <h4>${escapeHtml(material.title)}</h4>
                <p>${escapeHtml(material.description)}</p>
                <small>
                    <span><i class="fas fa-tag"></i> ${escapeHtml(material.type)}</span>
                    <span><i class="fas fa-file"></i> ${escapeHtml(material.file_name)}</span>
                    <span><i class="fas fa-calendar"></i> ${formattedDate}</span>
                </small>
            </div>
        </div>
        <div class="admin-material-actions">
            <button class="btn btn-edit btn-small" onclick='editMaterial(${JSON.stringify(material).replace(/'/g, "&#39;")})'>
                <i class="fas fa-edit"></i> Edit
            </button>
            <button class="btn btn-delete btn-small" onclick="deleteMaterial(${material.id}, '${escapeHtml(material.title).replace(/'/g, "\\'")}')">
                <i class="fas fa-trash"></i> Delete
            </button>
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

// Function to open edit modal
function editMaterial(material) {
    console.log('Opening edit modal for material:', material);
    
    document.getElementById('editMaterialId').value = material.id;
    document.getElementById('editTitle').value = material.title;
    document.getElementById('editType').value = material.type;
    document.getElementById('editDescription').value = material.description;
    
    document.getElementById('editModal').classList.add('show');
    console.log('Modal should be visible now');
}

// Function to close edit modal
function closeEditModal() {
    document.getElementById('editModal').classList.remove('show');
    document.getElementById('editForm').reset();
}

// Function to update material
function updateMaterial() {
    const id = document.getElementById('editMaterialId').value;
    const title = document.getElementById('editTitle').value.trim();
    const type = document.getElementById('editType').value;
    const description = document.getElementById('editDescription').value.trim();

    if (!title || !type || !description) {
        alert('All fields are required');
        return;
    }

    const submitBtn = document.querySelector('#editForm button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

    fetch('api/update-material.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, title, type, description })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('Material updated successfully!', 'success');
            closeEditModal();
            loadAdminMaterials();
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => {
        alert('Error updating material. Please try again.');
        console.error('Error:', error);
    })
    .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
    });
}

// Function to delete material
function deleteMaterial(id, title) {
    if (confirm(`Are you sure you want to delete "${title}"?\n\nThis action cannot be undone.`)) {
        const card = event.target.closest('.admin-material-card');
        card.style.opacity = '0.5';
        card.style.pointerEvents = 'none';

        fetch('api/delete-material.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                card.style.transform = 'translateX(-100%)';
                setTimeout(() => {
                    loadAdminMaterials();
                }, 300);
                
                showNotification('Material deleted successfully!', 'success');
            } else {
                alert('Error: ' + data.message);
                card.style.opacity = '1';
                card.style.pointerEvents = 'auto';
            }
        })
        .catch(error => {
            alert('Error deleting material. Please try again.');
            console.error('Error:', error);
            card.style.opacity = '1';
            card.style.pointerEvents = 'auto';
        });
    }
}

// Function to show notification
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

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('editModal');
    if (event.target === modal) {
        closeEditModal();
    }
}
// Admin Statistics Charts

let activeStudentsChart = null;
let downloadsChart = null;
let registrationsChart = null;

// Current filter value
let currentStatsFilter = 'all'; // Default to all time

// Change statistics filter
function changeStatsFilter(days) {
    currentStatsFilter = days;
    
    // Update active tab
    document.querySelectorAll('.filter-btn-simple').forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('data-days') == days) {
            tab.classList.add('active');
        }
    });
    
    // Load statistics with new filter
    loadStatistics();
}

// Load statistics based on selected time filter
async function loadStatistics() {
    const days = currentStatsFilter;
    
    try {
        const response = await fetch(`api/get-statistics.php?days=${days}`);
        const data = await response.json();
        
        if (data.success) {
            updateStatistics(data.stats);
        } else {
            console.error('Failed to load statistics:', data.message);
        }
    } catch (error) {
        console.error('Error loading statistics:', error);
    }
}

// Update all statistics and charts
function updateStatistics(stats) {
    // Update charts only
    updateActiveStudentsChart(stats.active_students_timeline);
    updateDownloadsChart(stats.downloads_by_material);
    updateRegistrationsChart(stats.registrations);
}

// Active Students Chart (Line Chart)
function updateActiveStudentsChart(data) {
    const ctx = document.getElementById('activeStudentsChart');
    if (!ctx) return;
    
    // Destroy existing chart
    if (activeStudentsChart) {
        activeStudentsChart.destroy();
    }
    
    const labels = data.map(item => formatDate(item.date));
    const values = data.map(item => item.count);
    
    activeStudentsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Active Students',
                data: values,
                borderColor: '#2196F3',
                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

// Downloads Chart (Pie Chart - by Material)
function updateDownloadsChart(data) {
    const ctx = document.getElementById('downloadsChart');
    if (!ctx) return;
    
    if (downloadsChart) {
        downloadsChart.destroy();
    }
    
    if (!data || data.length === 0) {
        // Show empty state
        downloadsChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['No downloads yet'],
                datasets: [{
                    data: [1],
                    backgroundColor: ['#E0E0E0']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
        return;
    }
    
    const labels = data.map(item => item.title);
    const values = data.map(item => item.download_count);
    
    // Generate distinct colors for each material
    const distinctColors = [
        '#4CAF50', // Green
        '#2196F3', // Blue
        '#FF9800', // Orange
        '#9C27B0', // Purple
        '#F44336', // Red
        '#00BCD4', // Cyan
        '#FFEB3B', // Yellow
        '#795548', // Brown
        '#607D8B', // Blue Grey
        '#E91E63'  // Pink
    ];
    
    downloadsChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: distinctColors.slice(0, data.length),
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 10,
                        font: {
                            size: 11
                        },
                        generateLabels: function(chart) {
                            const data = chart.data;
                            if (data.labels.length && data.datasets.length) {
                                return data.labels.map((label, i) => {
                                    const value = data.datasets[0].data[i];
                                    return {
                                        text: `${label}: ${value}`,
                                        fillStyle: data.datasets[0].backgroundColor[i],
                                        hidden: false,
                                        index: i
                                    };
                                });
                            }
                            return [];
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ${value} downloads (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Registrations Chart (Area Chart)
function updateRegistrationsChart(data) {
    const ctx = document.getElementById('registrationsChart');
    if (!ctx) return;
    
    if (registrationsChart) {
        registrationsChart.destroy();
    }
    
    const labels = data.map(item => formatDate(item.date));
    const values = data.map(item => item.count);
    
    registrationsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'New Registrations',
                data: values,
                borderColor: '#FF9800',
                backgroundColor: 'rgba(255, 152, 0, 0.2)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}



// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Initialize statistics on dashboard load
document.addEventListener('DOMContentLoaded', function() {
    // Load statistics when dashboard is shown
    const dashboardSection = document.getElementById('dashboardSection');
    if (dashboardSection && dashboardSection.style.display !== 'none') {
        loadStatistics();
    }
});

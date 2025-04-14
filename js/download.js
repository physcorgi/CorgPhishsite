document.addEventListener('DOMContentLoaded', function() {
    // Fetch version information
    fetchVersionInfo();
    
    // Animation for elements on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.classList.add('animated');
            }
        });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on page load
    
    // Tab functionality for installation guides
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-tab');
            
            // Hide all tab contents
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // Deactivate all tab links
            tabLinks.forEach(link => {
                link.classList.remove('active');
            });
            
            // Activate the current tab and content
            this.classList.add('active');
            document.getElementById(targetId).classList.add('active');
        });
    });
    
    // FAQ accordion functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isOpen = item.classList.contains('open');
            
            // Close all items
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('open');
            });
            
            // Open clicked item if it wasn't open before
            if (!isOpen) {
                item.classList.add('open');
            }
        });
    });
    
    // Download button handlers
    const downloadButtons = document.querySelectorAll('.download-btn');
    
    downloadButtons.forEach(button => {
        button.addEventListener('click', function() {
            const platform = this.getAttribute('data-platform');
            const fileName = this.getAttribute('data-file');
            simulateDownload(platform, fileName);
        });
    });
    
    // Copy command functionality
    const copyButtons = document.querySelectorAll('.copy-command');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const command = this.getAttribute('data-command');
            navigator.clipboard.writeText(command)
                .then(() => {
                    showNotification('Command copied to clipboard!', 'success');
                })
                .catch(err => {
                    showNotification('Failed to copy command.', 'error');
                    console.error('Failed to copy: ', err);
                });
        });
    });
});

// Function to fetch version information
function fetchVersionInfo() {
    fetch('downloads/version.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            updateVersionInfo(data);
            updateReleaseNotes(data.releaseNotes);
        })
        .catch(error => {
            console.error('Error fetching version information:', error);
            // Show error message in version timeline
            const versionTimeline = document.getElementById('version-timeline');
            if (versionTimeline) {
                versionTimeline.innerHTML = `<div class="version-error">Error loading version information. Please try again later.</div>`;
            }
        });
}

// Function to update version information on the page
function updateVersionInfo(versionData) {
    // Update version badges and download buttons
    if (versionData.platforms) {
        // Windows version
        if (versionData.platforms.windows) {
            const winVersion = versionData.platforms.windows;
            updatePlatformVersion('windows', winVersion);
        }
        
        // macOS version
        if (versionData.platforms.macos) {
            const macVersion = versionData.platforms.macos;
            updatePlatformVersion('macos', macVersion);
        }
        
        // Linux version
        if (versionData.platforms.linux) {
            if (versionData.platforms.linux.deb) {
                const debVersion = versionData.platforms.linux.deb;
                updatePlatformVersion('linux', debVersion);
            }
        }
        
        // Extension version
        if (versionData.platforms.extension) {
            const extVersion = versionData.platforms.extension;
            updatePlatformVersion('extension', extVersion);
        }
    }
}

// Function to update platform version information
function updatePlatformVersion(platform, versionInfo) {
    // Find download button for this platform
    const downloadBtn = document.querySelector(`.download-btn[data-platform="${platform}"]`);
    if (downloadBtn) {
        // Update data-file attribute
        downloadBtn.setAttribute('data-file', versionInfo.filename);
        
        // Find and update version span if it exists
        const versionSpan = downloadBtn.closest('.download-card-body').querySelector('.download-version');
        if (versionSpan) {
            versionSpan.textContent = `Version ${versionInfo.version} (${versionInfo.size})`;
        }
    }
}

// Function to update release notes section
function updateReleaseNotes(releaseNotes) {
    const versionTimeline = document.getElementById('version-timeline');
    
    if (!versionTimeline || !releaseNotes || !releaseNotes.length) {
        return;
    }
    
    // Clear loading message
    versionTimeline.innerHTML = '';
    
    // Add each version to the timeline
    releaseNotes.forEach((release, index) => {
        const isLatest = index === 0;
        const versionItem = document.createElement('div');
        versionItem.className = 'version-item';
        
        // Create version badge
        const versionBadge = document.createElement('div');
        versionBadge.className = `version-badge ${isLatest ? 'current' : ''}`;
        
        // Create version header with information
        const versionHeader = document.createElement('div');
        versionHeader.className = 'version-header';
        
        const versionNumber = document.createElement('div');
        versionNumber.className = 'version-number';
        versionNumber.innerHTML = `v${release.version} ${isLatest ? '<span class="version-label">Latest</span>' : ''}`;
        
        const versionDate = document.createElement('div');
        versionDate.className = 'version-date';
        versionDate.textContent = formatDate(release.date);
        
        versionHeader.appendChild(versionNumber);
        versionHeader.appendChild(versionDate);
        
        // Create change log content
        const versionContent = document.createElement('div');
        versionContent.className = 'version-content';
        
        // Group changes by type
        const features = release.changes.filter(change => change.type === 'feature');
        const improvements = release.changes.filter(change => change.type === 'improvement');
        const fixes = release.changes.filter(change => change.type === 'fix');
        
        // Build the change log HTML
        let changelogHTML = '<div class="changelog">';
        
        // Add features
        if (features.length) {
            changelogHTML += '<h4>New Features</h4><ul>';
            features.forEach(feature => {
                changelogHTML += `<li><span class="tag tag-feature">Feature</span>${feature.description}</li>`;
            });
            changelogHTML += '</ul>';
        }
        
        // Add improvements
        if (improvements.length) {
            changelogHTML += '<h4>Improvements</h4><ul>';
            improvements.forEach(improvement => {
                changelogHTML += `<li><span class="tag tag-improvement">Improve</span>${improvement.description}</li>`;
            });
            changelogHTML += '</ul>';
        }
        
        // Add fixes
        if (fixes.length) {
            changelogHTML += '<h4>Bug Fixes</h4><ul>';
            fixes.forEach(fix => {
                changelogHTML += `<li><span class="tag tag-fix">Fix</span>${fix.description}</li>`;
            });
            changelogHTML += '</ul>';
        }
        
        changelogHTML += '</div>';
        versionContent.innerHTML = changelogHTML;
        
        // Add to version item
        versionItem.appendChild(versionBadge);
        versionItem.appendChild(versionHeader);
        versionItem.appendChild(versionContent);
        
        // Add to timeline
        versionTimeline.appendChild(versionItem);
    });
}

// Helper function to format dates
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
}

// Function to simulate download
function simulateDownload(platform, fileName) {
    showNotification(`Starting download for ${platform}...`, 'info');
    
    // Log download attempt
    console.log(`Download initiated for ${platform}: ${fileName}`);
    
    // Track download event (for analytics integration)
    if (typeof gtag === 'function') {
        gtag('event', 'download', {
            'event_category': 'downloads',
            'event_label': platform,
            'value': fileName
        });
    }
    
    // Simulate download with a link
    setTimeout(() => {
        const link = document.createElement('a');
        link.href = `downloads/${fileName}`;
        link.download = fileName;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification(`Download started for ${platform}!`, 'success');
    }, 500);
}

// Function to show notifications
function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add to the DOM
    const notificationContainer = document.querySelector('.notification-container') || createNotificationContainer();
    notificationContainer.appendChild(notification);
    
    // Add close button functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', function() {
        notification.classList.add('hiding');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        notification.classList.add('hiding');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Function to create notification container if it doesn't exist
function createNotificationContainer() {
    const container = document.createElement('div');
    container.className = 'notification-container';
    document.body.appendChild(container);
    return container;
} 
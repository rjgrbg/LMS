// Avatar Utility Functions

// Generate initials from full name
function getInitials(fullName) {
    if (!fullName) return '?';
    
    const names = fullName.trim().split(' ');
    if (names.length === 1) {
        return names[0].charAt(0).toUpperCase();
    }
    
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
}

// Generate consistent color based on name
function getAvatarColor(fullName) {
    const colors = [
        '#7C9473', // Green
        '#4299e1', // Blue
        '#ed8936', // Orange
        '#48bb78', // Teal
        '#9f7aea', // Purple
        '#f56565', // Red
        '#38b2ac', // Cyan
        '#ed64a6', // Pink
    ];
    
    if (!fullName) return colors[0];
    
    // Generate consistent index based on name
    let hash = 0;
    for (let i = 0; i < fullName.length; i++) {
        hash = fullName.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
}

// Create avatar element with initials
function createInitialsAvatar(fullName, size = 70) {
    const initials = getInitials(fullName);
    const color = getAvatarColor(fullName);
    
    return `
        <div class="initials-avatar" style="
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: ${size * 0.4}px;
            font-weight: 700;
            font-family: 'Calibri', 'Inter', sans-serif;
        ">
            ${initials}
        </div>
    `;
}

// Update avatar display (for use in admin panel and other pages)
function updateAvatarDisplay(elementId, profilePicture, fullName, size = 85) {
    const avatarElement = document.getElementById(elementId);
    if (!avatarElement) {
        console.warn('Avatar element not found:', elementId);
        return;
    }
    
    // Try to find image and icon elements - check multiple possible IDs
    let avatarImage = avatarElement.querySelector('img');
    let avatarIcon = avatarElement.querySelector('i');
    
    // Fallback to specific IDs if querySelector doesn't work
    if (!avatarImage) {
        avatarImage = document.getElementById('avatarImage') || document.getElementById('profileAvatarImage');
    }
    if (!avatarIcon) {
        avatarIcon = document.getElementById('avatarIcon') || document.getElementById('profileAvatarIcon');
    }
    
    console.log('updateAvatarDisplay called:', {
        elementId,
        profilePicture,
        fullName,
        hasImage: !!avatarImage,
        hasIcon: !!avatarIcon
    });
    
    if (profilePicture) {
        // Show profile picture
        if (avatarImage) {
            avatarImage.src = profilePicture;
            avatarImage.style.display = 'block';
            console.log('Profile picture set to:', profilePicture);
        } else {
            console.warn('Avatar image element not found');
        }
        if (avatarIcon) {
            avatarIcon.style.display = 'none';
        }
        
        // Remove any initials overlay
        const existingInitials = avatarElement.querySelector('.initials-overlay');
        if (existingInitials) {
            existingInitials.remove();
        }
    } else {
        console.log('No profile picture, showing initials for:', fullName);
        // Show initials
        if (avatarImage) {
            avatarImage.style.display = 'none';
        }
        if (avatarIcon) {
            avatarIcon.style.display = 'none';
        }
        
        // Create initials overlay
        const existingInitials = avatarElement.querySelector('.initials-overlay');
        if (existingInitials) {
            existingInitials.remove();
        }
        
        const initials = getInitials(fullName);
        const color = getAvatarColor(fullName);
        
        const initialsDiv = document.createElement('div');
        initialsDiv.className = 'initials-overlay';
        initialsDiv.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: ${color};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: ${size * 0.35}px;
            font-weight: 700;
            font-family: 'Calibri', 'Inter', sans-serif;
            z-index: 1;
        `;
        initialsDiv.textContent = initials;
        
        avatarElement.appendChild(initialsDiv);
    }
}

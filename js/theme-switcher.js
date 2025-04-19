/**
 * Theme Switcher Functionality
 * Handles dark/light mode toggling with local storage persistence
 * and system preference detection
 */
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    // Exit if theme toggle element doesn't exist
    if (!themeToggle) {
        console.error('Theme toggle element not found in the DOM');
        return;
    }
    
    // Check for saved theme preference or use device preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Function to apply theme
    function applyTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);
        themeToggle.checked = theme === 'dark';
        
        // Update other UI elements that might depend on the theme
        document.body.classList.remove('theme-transition');
        // Force a repaint before adding the transition class
        void document.body.offsetWidth;
        document.body.classList.add('theme-transition');
        
        // Remove transition class after animation completes
        setTimeout(() => {
            document.body.classList.remove('theme-transition');
        }, 500);
    }
    
    // Set initial theme
    try {
        if (savedTheme) {
            applyTheme(savedTheme);
        } else {
            // If no saved preference, use system preference
            const initialTheme = prefersDarkScheme.matches ? 'dark' : 'light';
            applyTheme(initialTheme);
        }
    } catch (error) {
        console.error('Error setting initial theme:', error);
        // Fall back to light theme if there's an error
        applyTheme('light');
    }
    
    // Add theme toggle functionality with error handling
    themeToggle.addEventListener('change', function() {
        try {
            const newTheme = this.checked ? 'dark' : 'light';
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Dispatch a custom event that other components can listen for
            const themeChangeEvent = new CustomEvent('themeChanged', { 
                detail: { theme: newTheme } 
            });
            document.dispatchEvent(themeChangeEvent);
        } catch (error) {
            console.error('Error changing theme:', error);
        }
    });
    
    // Listen for system theme changes
    prefersDarkScheme.addEventListener('change', (e) => {
        try {
            // Only update if user hasn't set a preference
            if (!localStorage.getItem('theme')) {
                const newTheme = e.matches ? 'dark' : 'light';
                applyTheme(newTheme);
            }
        } catch (error) {
            console.error('Error handling system theme change:', error);
        }
    });
    
    // Make the theme toggle accessible via keyboard
    themeToggle.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.checked = !this.checked;
            this.dispatchEvent(new Event('change'));
        }
    });
    
    // Add a global theme toggle function that can be called from anywhere
    window.toggleTheme = function() {
        themeToggle.checked = !themeToggle.checked;
        themeToggle.dispatchEvent(new Event('change'));
    };
    
    // Log initial theme for debugging
    console.log('Theme initialized:', htmlElement.getAttribute('data-theme'));
}); 
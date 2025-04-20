document.addEventListener('DOMContentLoaded', function() {
    // Installation Guide Tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-tab');
            
            // Hide all tab contents
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // Deactivate all tab buttons
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Activate the current tab and content
            this.classList.add('active');
            document.getElementById(targetId).classList.add('active');
        });
    });
    
    // FAQ Accordion functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            item.classList.toggle('open');
        });
    });
    
    // Copy command functionality
    const copyButtons = document.querySelectorAll('.copy-command');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const command = this.getAttribute('data-command');
            navigator.clipboard.writeText(command)
                .then(() => {
                    // Create a temporary notification
                    showNotification('Команда скопирована!');
                })
                .catch(err => {
                    console.error('Ошибка копирования:', err);
                });
        });
    });
    
    // Simple notification function
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'copy-notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Trigger animation by adding active class
        setTimeout(() => {
            notification.classList.add('active');
        }, 10);
        
        // Remove notification after animation ends
        setTimeout(() => {
            notification.classList.remove('active');
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 2000);
    }
}); 
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Counter animation for stats
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    // Function to start counter animation when element is in viewport
    function startCounterWhenVisible() {
        counters.forEach(counter => {
            const position = counter.getBoundingClientRect();
            
            // Check if element is in viewport
            if(position.top < window.innerHeight && position.bottom >= 0 && !counter.classList.contains('counted')) {
                counter.classList.add('counted');
                
                const target = parseFloat(counter.getAttribute('data-target'));
                const isDecimal = target % 1 !== 0;
                const decimalPlaces = isDecimal ? (target.toString().split('.')[1] || '').length : 0;
                const increment = target / speed;
                
                let count = 0;
                
                const updateCount = () => {
                    if (count < target) {
                        count += increment;
                        if (count > target) count = target;
                        
                        // Format the number with the correct number of decimal places
                        counter.innerText = isDecimal 
                            ? count.toFixed(decimalPlaces) 
                            : Math.floor(count);
                        
                        requestAnimationFrame(updateCount);
                    }
                };
                
                updateCount();
            }
        });
    }

    // Check on load and scroll
    window.addEventListener('scroll', startCounterWhenVisible);
    startCounterWhenVisible();

    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('nav');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
}); 
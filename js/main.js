document.addEventListener('DOMContentLoaded', function() {
    // Мобильное меню
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu') || document.createElement('div');
    const body = document.body;
    
    if (hamburger) {
        // Если мобильное меню не существует, создаем его
        if (!document.querySelector('.mobile-menu')) {
            mobileMenu.className = 'mobile-menu';
            
            // Клонируем навигационные ссылки
            const navLinks = document.querySelector('.nav-links');
            if (navLinks) {
                const links = navLinks.querySelectorAll('a');
                links.forEach(link => {
                    const newLink = link.cloneNode(true);
                    mobileMenu.appendChild(newLink);
                });
            }
            
            // Добавляем CTA кнопки
            const ctaButtons = document.querySelector('.cta-buttons');
            if (ctaButtons) {
                const mobileCta = document.createElement('div');
                mobileCta.className = 'mobile-cta';
                
                const buttons = ctaButtons.querySelectorAll('a');
                buttons.forEach(button => {
                    const newButton = button.cloneNode(true);
                    mobileCta.appendChild(newButton);
                });
                
                mobileMenu.appendChild(mobileCta);
            }
            
            // Добавляем меню в DOM
            body.appendChild(mobileMenu);
        }
        
        // Обработчик клика по гамбургеру
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event bubbling
            mobileMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            
            // Toggle body scroll
            if (mobileMenu.classList.contains('active')) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = '';
            }
        });
        
        // Закрытие мобильного меню при клике по ссылке
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                hamburger.classList.remove('active');
                body.style.overflow = '';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (mobileMenu.classList.contains('active') && 
                !mobileMenu.contains(e.target) && 
                e.target !== hamburger &&
                !hamburger.contains(e.target)) {
                mobileMenu.classList.remove('active');
                hamburger.classList.remove('active');
                body.style.overflow = '';
            }
        });
    }
    
    // Слайдер скриншотов
    const slider = document.querySelector('.screenshots-slider');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    
    if (slider && dots.length && prevBtn && nextBtn) {
        let currentSlide = 0;
        const slides = slider.querySelectorAll('.screenshot');
        const slideCount = slides.length;
        
        // Инициализация слайдера
        updateSlider();
        
        // Обработчики для кнопок навигации
        prevBtn.addEventListener('click', function() {
            currentSlide = (currentSlide - 1 + slideCount) % slideCount;
            updateSlider();
        });
        
        nextBtn.addEventListener('click', function() {
            currentSlide = (currentSlide + 1) % slideCount;
            updateSlider();
        });
        
        // Обработчики для точек
        dots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                currentSlide = index;
                updateSlider();
            });
        });
        
        function updateSlider() {
            // Обновление положения слайдов
            slides.forEach((slide, index) => {
                if (index === currentSlide) {
                    slide.style.display = 'block';
                } else {
                    slide.style.display = 'none';
                }
            });
            
            // Обновление активной точки
            dots.forEach((dot, index) => {
                if (index === currentSlide) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
    }
    
    // Плавная прокрутка для якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Анимация появления элементов при прокрутке
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.feature-card, .stat-card, .workflow-step, .screenshot, .download-option, .doc-card, .timeline-section');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Инициализация стилей для анимации
    const elementsToAnimate = document.querySelectorAll('.feature-card, .stat-card, .workflow-step, .screenshot, .download-option, .doc-card, .timeline-section');
    elementsToAnimate.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Запуск анимации при загрузке и прокрутке
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);
    
    // Активация ссылок навигации при прокрутке
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Фиксированная навигация при прокрутке
    const header = document.querySelector('header');
    let lastScrollPosition = 0;
    
    window.addEventListener('scroll', function() {
        const currentScrollPosition = window.pageYOffset;
        
        if (currentScrollPosition > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollPosition = currentScrollPosition;
    });
    
    // Fix for iOS Safari viewport height issue
    function setDocHeight() {
        document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    }
    
    // Set the --vh variable on page load and resize
    setDocHeight();
    window.addEventListener('resize', setDocHeight);
    window.addEventListener('orientationchange', setDocHeight);

    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            try {
                const response = await fetch('server-test.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    alert('Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.');
                    contactForm.reset();
                } else {
                    throw new Error(result.error || 'Произошла ошибка при отправке формы');
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                alert(error.message || 'Произошла ошибка при отправке формы. Пожалуйста, попробуйте позже.');
            }
        });
    }
}); 
document.addEventListener('DOMContentLoaded', function() {
    // Обработка формы контактов
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Получаем данные формы
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Имитация отправки данных (в реальном проекте здесь будет AJAX запрос)
            const formData = {
                name: name,
                email: email,
                subject: subject,
                message: message
            };
            
            console.log('Отправка формы:', formData);
            
            // Показываем сообщение об успешной отправке
            const formContainer = contactForm.parentElement;
            
            formContainer.innerHTML = `
                <div class="success-message">
                    <div class="success-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h3>Сообщение отправлено!</h3>
                    <p>Спасибо, ${name}! Ваше сообщение успешно отправлено. Мы свяжемся с вами в ближайшее время.</p>
                    <button class="btn btn-primary" id="new-message-btn">Отправить еще сообщение</button>
                </div>
            `;
            
            // Обработчик для кнопки "Отправить еще сообщение"
            document.getElementById('new-message-btn').addEventListener('click', function() {
                window.location.reload();
            });
        });
    }
    
    // Анимация элементов при прокрутке
    const animateElements = function() {
        const elements = document.querySelectorAll('.team-member, .value-card, .partner-logo, .timeline-item');
        
        elements.forEach(element => {
            const position = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (position < windowHeight - 100) {
                element.classList.add('animated');
            }
        });
    };
    
    // Инициализация стилей для анимации
    const elementsToAnimate = document.querySelectorAll('.team-member, .value-card, .partner-logo, .timeline-item');
    elementsToAnimate.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Добавляем класс при анимации
    document.addEventListener('scroll', function() {
        animateElements();
    });
    
    // Запускаем анимацию при загрузке страницы
    animateElements();
    
    // Отображаем CSS класс для анимированных элементов
    document.head.insertAdjacentHTML('beforeend', `
        <style>
            .animated {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
            
            .success-message {
                text-align: center;
                padding: 30px 0;
            }
            
            .success-icon {
                font-size: 60px;
                color: var(--success-color);
                margin-bottom: 20px;
            }
            
            .success-message h3 {
                margin-bottom: 15px;
            }
            
            .success-message p {
                margin-bottom: 30px;
            }
        </style>
    `);
}); 
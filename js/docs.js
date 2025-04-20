document.addEventListener('DOMContentLoaded', function() {
    // Подсвечивание активного пункта меню боковой панели при прокрутке
    const sections = document.querySelectorAll('.docs-content h2[id]');
    const sidebarLinks = document.querySelectorAll('.docs-sidebar a');
    
    function highlightActiveSectionInSidebar() {
        let currentSectionId = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop - 100) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        sidebarLinks.forEach(link => {
            link.parentElement.classList.remove('active');
            
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.parentElement.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', highlightActiveSectionInSidebar);
    
    // Плавная прокрутка для якорных ссылок в документации
    document.querySelectorAll('.docs-sidebar a, .footer-section a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Обновление URL без перезагрузки страницы
                history.pushState(null, null, targetId);
                
                // Обновление активного элемента в боковой панели
                sidebarLinks.forEach(link => {
                    link.parentElement.classList.remove('active');
                });
                this.parentElement.classList.add('active');
            }
        });
    });
    
    // Обработка клика по кнопкам документации
    document.querySelectorAll('.doc-button').forEach(button => {
        button.addEventListener('click', function(e) {
            // Если ссылка ведет на Markdown файл, открываем в новой вкладке
            if (this.getAttribute('href').endsWith('.md')) {
                e.preventDefault();
                window.open(this.getAttribute('href'), '_blank');
            }
        });
    });
    
    // Инициализация подсветки синтаксиса в блоках кода
    document.querySelectorAll('pre code').forEach(block => {
        // Простая подсветка синтаксиса без зависимостей
        // Подсветка ключевых слов
        let html = block.innerHTML;
        const keywords = ['import', 'from', 'def', 'class', 'return', 'if', 'else', 'for', 'while', 'try', 'except', 'with', 'as', 'in', 'not', 'and', 'or', 'true', 'false', 'null'];
        
        keywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'g');
            html = html.replace(regex, `<span class="keyword">${keyword}</span>`);
        });
        
        // Подсветка строк
        html = html.replace(/(["'])(.*?)\1/g, '<span class="string">$&</span>');
        
        // Подсветка чисел
        html = html.replace(/\b(\d+)\b/g, '<span class="number">$&</span>');
        
        // Подсветка комментариев
        html = html.replace(/(\/\/.*)/g, '<span class="comment">$&</span>');
        
        block.innerHTML = html;
    });
    
    // Сделать боковую панель фиксированной при прокрутке
    const sidebar = document.querySelector('.docs-sidebar');
    const mainContent = document.querySelector('.docs-content');
    
    if (sidebar && mainContent && window.innerWidth > 768) {
        const sidebarTop = sidebar.offsetTop;
        
        window.addEventListener('scroll', function() {
            if (window.scrollY > sidebarTop - 20) {
                sidebar.style.position = 'sticky';
                sidebar.style.top = '20px';
            } else {
                sidebar.style.position = 'static';
            }
        });
    }
    
    // Проверка URL при загрузке страницы для активации правильного раздела
    function setInitialActiveSection() {
        const hash = window.location.hash;
        
        if (hash) {
            sidebarLinks.forEach(link => {
                link.parentElement.classList.remove('active');
                
                if (link.getAttribute('href') === hash) {
                    link.parentElement.classList.add('active');
                    
                    // Прокрутка к нужному разделу с небольшой задержкой
                    setTimeout(() => {
                        const targetElement = document.querySelector(hash);
                        if (targetElement) {
                            window.scrollTo({
                                top: targetElement.offsetTop - 80,
                                behavior: 'smooth'
                            });
                        }
                    }, 200);
                }
            });
        }
    }
    
    setInitialActiveSection();
}); 
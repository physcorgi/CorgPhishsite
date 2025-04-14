document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const urlInput = document.getElementById('url-input');
    const analyzeBtn = document.getElementById('analyze-btn');
    const demoResults = document.getElementById('demo-results');
    const resultDetails = document.getElementById('result-details');
    const riskPercent = document.getElementById('risk-percent');
    const riskLevel = document.getElementById('risk-level');
    const resultDomain = document.getElementById('result-domain');
    const resultUrl = document.getElementById('result-url');
    const resultSummary = document.getElementById('result-summary');
    const detailsList = document.getElementById('details-list');
    const recommendationsList = document.getElementById('recommendations-list');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const exampleUrlBtns = document.querySelectorAll('.example-url-btn');
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    // Пример данных для URL-адресов
    const exampleUrls = {
        'bank-secure-login.example.com': {
            riskScore: 98.7,
            domain: 'bank-secure-login.example.com',
            url: 'https://bank-secure-login.example.com',
            summary: 'Этот сайт с высокой вероятностью является фишинговым. Обнаружено несколько серьезных признаков мошенничества, в том числе несоответствие домена и контента, подозрительные формы авторизации и редиректы на подозрительные домены.',
            details: [
                {
                    name: 'Домен с ключевыми словами',
                    description: 'Домен содержит ключевые слова "bank" и "secure", что типично для фишинговых сайтов',
                    status: 'danger'
                },
                {
                    name: 'Возраст домена',
                    description: 'Домен был зарегистрирован менее 30 дней назад',
                    status: 'danger'
                },
                {
                    name: 'HTTPS/SSL',
                    description: 'Сайт не использует безопасное соединение HTTPS',
                    status: 'danger'
                },
                {
                    name: 'Формы для ввода данных',
                    description: 'Сайт запрашивает конфиденциальные данные: номер карты, CVV, пароль',
                    status: 'danger'
                },
                {
                    name: 'Имитация интерфейса',
                    description: 'Сайт имитирует дизайн известного банка',
                    status: 'danger'
                },
                {
                    name: 'Перенаправления',
                    description: 'Обнаружены подозрительные перенаправления на сторонний домен',
                    status: 'warning'
                },
                {
                    name: 'JavaScript',
                    description: 'Обнаружен обфусцированный JavaScript, потенциально собирающий данные',
                    status: 'danger'
                },
                {
                    name: 'Репутация домена',
                    description: 'Домен не имеет положительной истории',
                    status: 'warning'
                }
            ],
            recommendations: [
                'Немедленно покиньте этот сайт',
                'Не вводите никакие личные или финансовые данные',
                'Проверьте SSL-сертификат перед вводом данных на финансовых сайтах',
                'Для доступа к банку всегда используйте официальное приложение или вводите URL напрямую',
                'Если вы уже ввели данные на этом сайте, немедленно смените пароли и свяжитесь с банком'
            ]
        },
        'faceb00k-security.example.org': {
            riskScore: 96.3,
            domain: 'faceb00k-security.example.org',
            url: 'https://faceb00k-security.example.org/login',
            summary: 'Этот сайт является фишинговым. Обнаружены явные признаки фишинга, включая опечатки в домене (использование цифр вместо букв), имитацию известного бренда и сбор чувствительных данных.',
            details: [
                {
                    name: 'Typosquatting (опечатки)',
                    description: 'Домен содержит цифры вместо букв: "faceb00k" вместо "facebook"',
                    status: 'danger'
                },
                {
                    name: 'Несоответствие домена',
                    description: 'Использование домена .org для имитации коммерческого сервиса',
                    status: 'warning'
                },
                {
                    name: 'Ключевые слова',
                    description: 'Использование слова "security" для создания ложного доверия',
                    status: 'danger'
                },
                {
                    name: 'HTTPS/SSL',
                    description: 'Сайт использует самоподписанный SSL-сертификат',
                    status: 'warning'
                },
                {
                    name: 'Формы для ввода данных',
                    description: 'Сайт запрашивает учетные данные аккаунта Facebook',
                    status: 'danger'
                },
                {
                    name: 'Внешние скрипты',
                    description: 'Обнаружены подозрительные внешние скрипты для сбора данных',
                    status: 'danger'
                },
                {
                    name: 'Копирование бренда',
                    description: 'Нелегитимное использование названия и логотипа Facebook',
                    status: 'danger'
                }
            ],
            recommendations: [
                'Покиньте этот сайт немедленно',
                'Обратите внимание на опечатки в доменных именах известных сервисов',
                'Всегда проверяйте URL-адрес в адресной строке перед вводом данных',
                'Используйте официальные приложения вместо перехода по ссылкам',
                'Если вы ввели данные, смените пароль в настоящем сервисе Facebook'
            ]
        },
        'google.com': {
            riskScore: 1.2,
            domain: 'google.com',
            url: 'https://google.com',
            summary: 'Этот сайт безопасен. Это официальный домен компании Google с проверенной историей и всеми необходимыми элементами безопасности.',
            details: [
                {
                    name: 'Возраст домена',
                    description: 'Домен существует более 20 лет',
                    status: 'safe'
                },
                {
                    name: 'HTTPS/SSL',
                    description: 'Сайт использует действительный SSL-сертификат от надежного центра сертификации',
                    status: 'safe'
                },
                {
                    name: 'Репутация домена',
                    description: 'Домен имеет отличную репутацию и не фигурирует в черных списках',
                    status: 'safe'
                },
                {
                    name: 'Структура URL',
                    description: 'URL имеет простую и понятную структуру без подозрительных параметров',
                    status: 'safe'
                },
                {
                    name: 'Инфраструктура',
                    description: 'Сайт размещен на официальных серверах Google',
                    status: 'safe'
                },
                {
                    name: 'Оригинальный контент',
                    description: 'Контент соответствует ожиданиям для официального сайта',
                    status: 'safe'
                }
            ],
            recommendations: [
                'Этот сайт безопасен для использования',
                'Всегда проверяйте URL перед вводом конфиденциальных данных',
                'Используйте надежные пароли и двухфакторную аутентификацию',
                'Регулярно обновляйте ваш браузер для максимальной защиты'
            ]
        }
    };
    
    // Демо-анализатор фишинга: имитирует проверку URL
    function analyzePhishing(url) {
        return new Promise((resolve) => {
            // Имитация асинхронной операции
            setTimeout(() => {
                // Преобразуем URL к нижнему регистру и удаляем протокол
                const cleanUrl = url.toLowerCase().replace(/^https?:\/\//, '');
                
                // Проверяем, соответствует ли URL одному из заготовленных примеров
                if (exampleUrls[cleanUrl]) {
                    resolve(exampleUrls[cleanUrl]);
                } else {
                    // Создаем случайный результат для демонстрационных целей
                    const isSuspicious = /bank|secure|account|login|confirm|verify|paypal|apple|microsoft|facebook|fb|amazon/i.test(cleanUrl);
                    const hasTypo = /[0-9]/.test(cleanUrl) || cleanUrl.includes('0') || cleanUrl.includes('l1');
                    
                    let riskScore;
                    let summary;
                    let details = [];
                    let recommendations = [];
                    
                    if (isSuspicious && hasTypo) {
                        riskScore = 85 + Math.random() * 10;
                        summary = 'Этот сайт, вероятно, является фишинговым. Обнаружены подозрительные признаки, включая опечатки в домене и ключевые слова, характерные для фишинговых атак.';
                        
                        details = [
                            {
                                name: 'Подозрительное имя домена',
                                description: 'Домен содержит ключевые слова, часто используемые в фишинговых атаках',
                                status: 'danger'
                            },
                            {
                                name: 'Возможный typosquatting',
                                description: 'Обнаружено использование цифр вместо букв или похожих символов',
                                status: 'danger'
                            }
                        ];
                        
                        recommendations = [
                            'Не вводите личные или финансовые данные на этом сайте',
                            'Убедитесь, что вы находитесь на официальном сайте, проверив URL',
                            'Если вы уже ввели данные, смените пароли в соответствующих сервисах'
                        ];
                    } else if (isSuspicious) {
                        riskScore = 50 + Math.random() * 20;
                        summary = 'Этот сайт вызывает подозрения. Обнаружены некоторые признаки, которые могут указывать на фишинг, но требуется дополнительный анализ.';
                        
                        details = [
                            {
                                name: 'Подозрительное имя домена',
                                description: 'Домен содержит ключевые слова, часто используемые в фишинговых атаках',
                                status: 'warning'
                            }
                        ];
                        
                        recommendations = [
                            'Будьте осторожны при вводе личных данных на этом сайте',
                            'Проверьте URL и убедитесь, что вы на официальном сайте',
                            'Используйте официальные приложения вместо веб-версий, когда это возможно'
                        ];
                    } else {
                        riskScore = Math.random() * 10;
                        summary = 'Этот сайт, вероятно, безопасен. Не обнаружено явных признаков фишинга.';
                        
                        details = [
                            {
                                name: 'Имя домена',
                                description: 'Домен не содержит подозрительных ключевых слов или паттернов',
                                status: 'safe'
                            }
                        ];
                        
                        recommendations = [
                            'Этот сайт выглядит безопасным, но всегда будьте бдительны',
                            'Используйте надежные пароли и двухфакторную аутентификацию',
                            'Регулярно проверяйте свои учетные записи на подозрительную активность'
                        ];
                    }
                    
                    resolve({
                        riskScore: parseFloat(riskScore.toFixed(1)),
                        domain: cleanUrl,
                        url: `https://${cleanUrl}`,
                        summary,
                        details,
                        recommendations
                    });
                }
            }, 1500); // Имитация задержки анализа
        });
    }
    
    // Функция для отображения результатов анализа
    function displayResults(results) {
        // Заполняем данными основную информацию
        resultDomain.textContent = results.domain;
        resultUrl.textContent = results.url;
        resultSummary.textContent = results.summary;
        
        // Настраиваем индикатор риска
        riskPercent.textContent = `${results.riskScore}%`;
        riskLevel.style.width = `${results.riskScore}%`;
        
        if (results.riskScore < 20) {
            riskLevel.className = 'risk-level risk-safe';
        } else if (results.riskScore < 70) {
            riskLevel.className = 'risk-level risk-warning';
        } else {
            riskLevel.className = 'risk-level risk-danger';
        }
        
        // Заполняем вкладку с деталями
        detailsList.innerHTML = '';
        results.details.forEach(detail => {
            const detailItem = document.createElement('div');
            detailItem.className = 'detail-item';
            detailItem.innerHTML = `
                <div class="detail-icon ${detail.status}">
                    <i class="fas fa-${detail.status === 'safe' ? 'check' : detail.status === 'warning' ? 'exclamation' : 'times'}"></i>
                </div>
                <div class="detail-content">
                    <h4>${detail.name}</h4>
                    <p>${detail.description}</p>
                </div>
            `;
            detailsList.appendChild(detailItem);
        });
        
        // Заполняем вкладку с рекомендациями
        recommendationsList.innerHTML = '';
        results.recommendations.forEach(recommendation => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fas fa-check-circle"></i> <span>${recommendation}</span>`;
            recommendationsList.appendChild(li);
        });
        
        // Отображаем детали результата
        resultDetails.style.display = 'block';
        
        // Активируем первую вкладку
        tabBtns.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.style.display = 'none');
        tabBtns[0].classList.add('active');
        document.getElementById('overview').style.display = 'block';
    }
    
    // Обработчик для кнопки анализа
    analyzeBtn.addEventListener('click', function() {
        const url = urlInput.value.trim();
        
        if (!url) {
            alert('Пожалуйста, введите URL для анализа');
            return;
        }
        
        // Показываем анимацию загрузки
        demoResults.innerHTML = `
            <div class="loading-animation">
                <i class="fas fa-circle-notch"></i>
                <p>Анализ URL... Пожалуйста, подождите</p>
            </div>
        `;
        
        resultDetails.style.display = 'none';
        
        // Запускаем анализ
        analyzePhishing(url)
            .then(results => {
                // Очищаем предыдущие результаты
                demoResults.innerHTML = '';
                
                // Отображаем результаты
                displayResults(results);
            })
            .catch(error => {
                demoResults.innerHTML = `
                    <div class="results-placeholder">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Произошла ошибка при анализе: ${error.message}</p>
                    </div>
                `;
            });
    });
    
    // Обработчики для примеров URL
    exampleUrlBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            urlInput.value = btn.getAttribute('data-url');
            analyzeBtn.click();
        });
    });
    
    // Обработчики для вкладок
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Убираем активные классы с кнопок
            tabBtns.forEach(b => b.classList.remove('active'));
            // Добавляем активный класс текущей кнопке
            btn.classList.add('active');
            
            // Скрываем все вкладки
            tabContents.forEach(content => content.style.display = 'none');
            
            // Отображаем выбранную вкладку
            const tabId = btn.getAttribute('data-tab');
            document.getElementById(tabId).style.display = 'block';
        });
    });
    
    // Обработчики для FAQ
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            question.classList.toggle('active');
        });
    });
    
    // Инициализация формы ввода
    urlInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            analyzeBtn.click();
        }
    });
}); 
# Полная документация проекта CorgPhish

## Содержание
- [Введение](#введение)
- [Архитектура](#архитектура)
- [Компоненты системы](#компоненты-системы)
- [Алгоритмы обнаружения](#алгоритмы-обнаружения)
- [База данных](#база-данных)
- [API Reference](#api-reference)
- [Пользовательские интерфейсы](#пользовательские-интерфейсы)
- [Процесс разработки](#процесс-разработки)
- [Безопасность](#безопасность)
- [Масштабирование](#масштабирование)
- [Мониторинг и логирование](#мониторинг-и-логирование)

## Введение

CorgPhish — это интеллектуальная система для обнаружения и блокирования фишинговых веб-сайтов. Данный документ содержит подробную техническую информацию о проекте, его архитектуре и реализации.

### Цели проекта

1. Эффективное обнаружение фишинговых веб-сайтов с минимальным количеством ложных срабатываний
2. Обеспечение защиты пользователей от кражи конфиденциальных данных
3. Создание удобного инструмента с различными интерфейсами (браузерное расширение, API, десктопное приложение)
4. Сбор и анализ данных о фишинговых угрозах для улучшения методов обнаружения

### История проекта

Проект CorgPhish был начат в 2023 году как ответ на растущую проблему фишинговых атак. Имя CorgPhish происходит от сочетания слов "Corgi" (порода собак, известная своей наблюдательностью) и "Phishing" (фишинг).

## Архитектура

CorgPhish построен на модульной архитектуре, обеспечивающей гибкость, масштабируемость и удобство сопровождения.

### Высокоуровневая архитектура

```
+----------------------------------+
|                                  |
|         Interfaces               |
|  (Browser Extension, Desktop)    |
|                                  |
+----------------+----------------+
                |
                v
+----------------+----------------+
|                                  |
|              API                 |
|                                  |
+----------------+----------------+
                |
                v
+----------------+----------------+
|                                  |
|          Core Engine            |
|                                  |
+----------------+----------------+
        |                 |
        v                 v
+----------------+  +----------------+
|                |  |                |
|   Detectors    |  |   Database     |
|                |  |                |
+----------------+  +----------------+
```

### Принципы дизайна

- **Модульность**: Каждый компонент имеет четко определенные интерфейсы и может быть заменен или обновлен независимо
- **Расширяемость**: Система легко расширяется новыми детекторами или функциональностью
- **Производительность**: Оптимизация для быстрой проверки URL и минимального потребления ресурсов
- **Безопасность**: Защита данных пользователей и безопасные коммуникации между компонентами

## Компоненты системы

### Ядро (Core Engine)

Ядро системы отвечает за координацию работы всех компонентов. Оно получает URL или HTML-контент для анализа, передает данные детекторам, агрегирует результаты и принимает решение о классификации.

#### Основные функции ядра:

1. **URL Normalization** — нормализация URL для стандартизации входных данных
2. **Orchestration** — управление потоком выполнения детекторов
3. **Result Aggregation** — агрегация результатов от различных детекторов
4. **Decision Making** — принятие решения о классификации сайта на основе агрегированных результатов

#### Реализация:

```python
class Engine:
    def __init__(self, config=None):
        self.config = config or {}
        self.detectors = self._initialize_detectors()
        
    def _initialize_detectors(self):
        # Load and initialize all enabled detectors
        return [detector(self.config) for detector in AVAILABLE_DETECTORS 
                if self.config.get(detector.name, {}).get('enabled', True)]
        
    def check_url(self, url, fetch_content=True):
        """
        Check if a URL is a phishing site.
        
        Args:
            url (str): URL to check
            fetch_content (bool): Whether to fetch and analyze the page content
            
        Returns:
            dict: Analysis results
        """
        normalized_url = self._normalize_url(url)
        
        # Initialize results
        results = {
            'url': normalized_url,
            'is_phishing': False,
            'confidence': 0.0,
            'analysis': {}
        }
        
        # Run each detector
        detector_results = []
        for detector in self.detectors:
            try:
                result = detector.analyze(normalized_url)
                detector_results.append(result)
            except Exception as e:
                logger.error(f"Detector {detector.__class__.__name__} failed: {e}")
        
        # Aggregate results
        results.update(self._aggregate_results(detector_results))
        
        return results
```

### Детекторы (Detectors)

Детекторы — это специализированные модули для анализа URL и содержимого веб-страниц с целью обнаружения признаков фишинга.

#### Основные типы детекторов:

1. **URL Analyzer** — анализирует URL на наличие подозрительных признаков (опечатки в доменах, перенаправления и т.д.)
2. **Content Analyzer** — анализирует HTML-контент страницы (формы для ввода учетных данных, имитация дизайна известных сайтов)
3. **SSL Checker** — проверяет SSL-сертификат сайта
4. **Machine Learning Detector** — использует модели машинного обучения для классификации

#### Пример детектора URL:

```python
class URLAnalyzer(Detector):
    """Detector that analyzes URL for suspicious patterns."""
    
    def __init__(self, config=None):
        super().__init__(config)
        self.suspicious_tlds = self.config.get('suspicious_tlds', ['.tk', '.ml', '.ga', '.cf', '.gq'])
        self.brand_domains = self._load_brand_domains()
        
    def analyze(self, url, html_content=None):
        """Analyze URL for phishing indicators."""
        parsed_url = urlparse(url)
        domain = parsed_url.netloc
        
        # Initialize results
        result = {
            'score': 0.0,
            'features': {
                'suspicious_tld': False,
                'long_domain': False,
                'ip_domain': False,
                'typosquatting': False,
                'suspicious_keywords': False
            },
            'details': {}
        }
        
        # Check TLD
        tld = self._extract_tld(domain)
        if tld in self.suspicious_tlds:
            result['features']['suspicious_tld'] = True
            result['details']['suspicious_tld'] = f"Suspicious TLD: {tld}"
            result['score'] += 0.3
        
        # Domain length check
        if len(domain) > 30:
            result['features']['long_domain'] = True
            result['details']['long_domain'] = f"Long domain name: {len(domain)} characters"
            result['score'] += 0.2
        
        # IP address in domain
        if self._is_ip_domain(domain):
            result['features']['ip_domain'] = True
            result['details']['ip_domain'] = "Domain contains IP address"
            result['score'] += 0.4
        
        # Check for typosquatting
        typosquatting = self._check_typosquatting(domain)
        if typosquatting:
            result['features']['typosquatting'] = True
            result['details']['typosquatting'] = f"Possible typosquatting of: {typosquatting}"
            result['score'] += 0.5
        
        # Normalize score to be between 0 and 1
        result['score'] = min(1.0, result['score'])
        
        return result
        
    def _extract_tld(self, domain):
        # Implementation of TLD extraction
        
    def _is_ip_domain(self, domain):
        # Check if domain is an IP address
        
    def _check_typosquatting(self, domain):
        # Check if domain is typosquatting a known brand
        
    def _load_brand_domains(self):
        # Load list of brand domains to check against
```

### База данных (Database)

База данных хранит информацию о проверенных URL, результатах анализа и известных фишинговых сайтах.

#### Основные типы данных:

1. **URL Records** — информация о проверенных URL и результатах анализа
2. **Known Phishing Sites** — база данных известных фишинговых сайтов
3. **Brands Data** — информация о брендах и их доменах для выявления тайпосквоттинга
4. **User Reports** — пользовательские отчеты о фишинговых сайтах

#### Схема базы данных:

```
URLs:
- id (PK)
- url (string, indexed)
- normalized_url (string, indexed)
- is_phishing (boolean)
- confidence (float)
- first_seen (timestamp)
- last_checked (timestamp)
- check_count (integer)

AnalysisResults:
- id (PK)
- url_id (FK to URLs)
- detector_name (string)
- score (float)
- features (json)
- details (json)
- timestamp (timestamp)

BrandDomains:
- id (PK)
- brand_name (string)
- domain (string, indexed)
- tld (string)
- is_primary (boolean)

UserReports:
- id (PK)
- url_id (FK to URLs)
- user_id (string, optional)
- reported_as_phishing (boolean)
- notes (text)
- timestamp (timestamp)
```

## Алгоритмы обнаружения

### URL Analysis

Анализ URL включает следующие проверки:

1. **Доменный анализ**:
   - Проверка на использование подозрительных TLD
   - Проверка на наличие IP-адреса в домене
   - Анализ длины домена и наличия избыточных поддоменов
   - Обнаружение необычных комбинаций символов

2. **Тайпосквоттинг-детектор**:
   - Расчет редакционного расстояния (Левенштейна) между доменом и известными брендами
   - Обнаружение замены визуально похожих символов (например, "0" вместо "o")
   - Проверка на перестановку букв и добавление/удаление символов

3. **Анализ пути URL**:
   - Поиск подозрительных ключевых слов (login, account, secure, verify и т.д.)
   - Обнаружение скрытых перенаправлений
   - Анализ параметров URL

### Content Analysis

Анализ содержимого страницы включает:

1. **Проверка форм**:
   - Обнаружение форм для ввода паролей и других конфиденциальных данных
   - Анализ целевых URL форм и методов отправки данных

2. **Сравнение шаблонов**:
   - Сравнение HTML-структуры с известными шаблонами фишинговых страниц
   - Обнаружение имитации дизайна известных сайтов

3. **Анализ текста**:
   - Обнаружение подозрительных фраз и призывов к действию
   - Языковой анализ на предмет мошеннических формулировок

### Machine Learning Models

CorgPhish использует несколько моделей машинного обучения:

1. **URL Feature Extraction**:
   - Преобразование URL в числовые признаки
   - Выделение n-грамм и специализированных признаков

2. **HTML Content Vectorization**:
   - TF-IDF векторизация текстового содержимого
   - Извлечение структурных признаков из DOM

3. **Classification Models**:
   - Градиентный бустинг (XGBoost) для классификации на основе URL-признаков
   - Сверточные нейронные сети для анализа скриншотов страниц
   - Ансамблевые методы для комбинирования результатов различных детекторов

## API Reference

### Endpoints

#### URL Check

```
POST /api/v1/check
```

Проверка URL на фишинг.

**Request**:
```json
{
  "url": "https://example.com",
  "fetch_content": true,
  "client_info": {
    "client_id": "browser-extension",
    "version": "1.0.0",
    "platform": "chrome"
  }
}
```

**Response (200 OK)**:
```json
{
  "url": "https://example.com",
  "is_phishing": false,
  "confidence": 0.98,
  "analysis": {
    "url_analyzer": {
      "score": 0.05,
      "features": {
        "suspicious_tld": false,
        "long_domain": false,
        "ip_domain": false,
        "typosquatting": false
      }
    },
    "content_analyzer": {
      "score": 0.02,
      "features": {
        "login_form": true,
        "suspicious_content": false,
        "brand_imitation": false
      }
    },
    "ssl_checker": {
      "score": 0.0,
      "features": {
        "valid_certificate": true,
        "domain_match": true,
        "expired": false
      }
    }
  },
  "timestamp": "2023-10-15T14:22:31Z"
}
```

#### Batch Check

```
POST /api/v1/batch-check
```

Массовая проверка нескольких URL.

**Request**:
```json
{
  "urls": [
    "https://example.com",
    "https://suspicious-site.tk"
  ],
  "fetch_content": true
}
```

**Response (200 OK)**:
```json
{
  "results": [
    {
      "url": "https://example.com",
      "is_phishing": false,
      "confidence": 0.98
    },
    {
      "url": "https://suspicious-site.tk",
      "is_phishing": true,
      "confidence": 0.89
    }
  ],
  "timestamp": "2023-10-15T14:23:45Z"
}
```

#### Report URL

```
POST /api/v1/report
```

Отправка пользовательского отчета о URL.

**Request**:
```json
{
  "url": "https://suspicious-site.tk",
  "is_phishing": true,
  "notes": "This site asked for my bank credentials",
  "client_info": {
    "client_id": "browser-extension",
    "user_id": "anonymous",
    "version": "1.0.0"
  }
}
```

**Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Report received. Thank you for your contribution!",
  "report_id": "12345678"
}
```

### Authentication

API поддерживает два метода аутентификации:

1. **API Key** — для серверных интеграций
   ```
   Authorization: Bearer <api_key>
   ```

2. **Client ID** — для клиентских приложений
   ```json
   {
     "client_info": {
       "client_id": "browser-extension",
       "version": "1.0.0"
     }
   }
   ```

### Rate Limiting

API имеет следующие ограничения запросов:

- Без аутентификации: 10 запросов в час
- С аутентификацией Client ID: 100 запросов в час
- С аутентификацией API Key: зависит от тарифного плана

## Пользовательские интерфейсы

### Браузерное расширение

Браузерное расширение CorgPhish предоставляет защиту в реальном времени при просмотре веб-страниц.

#### Архитектура расширения:

1. **Background Script** — отвечает за взаимодействие с API и мониторинг навигации
2. **Content Script** — анализирует содержимое страницы и отображает предупреждения
3. **Popup UI** — пользовательский интерфейс для настройки расширения

#### Основные функции:

- Автоматическая проверка каждой посещаемой страницы
- Блокирование доступа к опасным сайтам
- Отображение предупреждений о подозрительных сайтах
- Возможность ручной проверки URL
- Отправка пользовательских отчетов о фишинговых сайтах

### Десктопное приложение

Десктопное приложение предоставляет расширенные возможности для анализа и управления.

#### Основные функции:

- Массовая проверка списков URL
- Подробная статистика и аналитика
- Интеграция с другими инструментами безопасности
- Оффлайн-режим работы с локальной базой данных

## Процесс разработки

### Методология

Разработка CorgPhish ведется с использованием гибких методологий (Agile) с двухнедельными спринтами.

### Процесс выпуска версий

1. **Alpha** — внутреннее тестирование
2. **Beta** — ограниченное внешнее тестирование
3. **Release Candidate** — окончательное тестирование перед релизом
4. **Production Release** — публичный релиз

### Контроль качества

- Автоматическое тестирование (unit, integration, end-to-end)
- Ручное тестирование
- Fuzzing для обнаружения ошибок и уязвимостей
- Тестирование производительности

## Безопасность

### Защита пользовательских данных

- Минимизация собираемых данных
- Шифрование всех коммуникаций (TLS)
- Анонимизация пользовательских данных
- Политика хранения данных с автоматическим удалением

### Безопасность приложения

- Регулярные обзоры кода
- Сканирование зависимостей на уязвимости
- Защита от инъекций и других атак
- Аудиты безопасности

## Масштабирование

### Горизонтальное масштабирование

- Распределенная архитектура API
- Кластеризация детекторов
- Шардирование базы данных

### Оптимизация производительности

- Кэширование результатов проверки
- Параллельное выполнение детекторов
- Приоритизация проверок на основе вероятности угрозы

## Мониторинг и логирование

### Система мониторинга

- Мониторинг доступности и производительности API
- Отслеживание количества обнаруженных угроз
- Мониторинг качества детекции (ложные срабатывания, пропущенные угрозы)

### Логирование

- Структурированные логи в формате JSON
- Централизованное хранение логов
- Система оповещений о критических событиях

---

## Приложения

### Глоссарий

- **Фишинг** — вид интернет-мошенничества, целью которого является получение доступа к конфиденциальным данным пользователей
- **Тайпосквоттинг** — регистрация доменных имен, близких по написанию к адресам популярных сайтов
- **TLD (Top-Level Domain)** — домен верхнего уровня, например, .com, .org, .ru
- **False Positive** — ложное срабатывание (легитимный сайт определен как фишинговый)
- **False Negative** — пропуск угрозы (фишинговый сайт определен как безопасный)

### Список используемых технологий

- **Языки программирования**: Python, JavaScript, TypeScript
- **Фреймворки**: FastAPI, React, Electron
- **Базы данных**: PostgreSQL, Redis
- **Машинное обучение**: scikit-learn, TensorFlow, XGBoost
- **Инфраструктура**: Docker, Kubernetes, AWS/GCP 
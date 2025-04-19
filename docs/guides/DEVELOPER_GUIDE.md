# Руководство разработчика CorgPhish

## Содержание
- [Введение](#введение)
- [Архитектура проекта](#архитектура-проекта)
- [Настройка среды разработки](#настройка-среды-разработки)
- [Структура кода](#структура-кода)
- [API](#api)
- [Разработка детекторов фишинга](#разработка-детекторов-фишинга)
- [Тестирование](#тестирование)
- [Внесение изменений](#внесение-изменений)
- [Выпуск релизов](#выпуск-релизов)

## Введение

Данное руководство содержит информацию, необходимую для разработчиков, желающих внести вклад в проект CorgPhish или расширить его функциональность. CorgPhish — это система обнаружения фишинговых сайтов, использующая различные техники анализа.

## Архитектура проекта

CorgPhish имеет модульную архитектуру, состоящую из следующих основных компонентов:

1. **Ядро (Core)** — центральный компонент, координирующий работу всех модулей
2. **Детекторы (Detectors)** — модули, реализующие различные алгоритмы обнаружения фишинга
3. **API** — REST API для интеграции с другими приложениями
4. **Интерфейсы (Interfaces)** — пользовательские интерфейсы (десктопное приложение, браузерное расширение)
5. **База данных (Database)** — хранилище данных о фишинговых сайтах и результатах анализа

### Схема компонентов

```
+----------------+     +----------------+     +----------------+
|                |     |                |     |                |
|  UI / Browser  |<--->|      API      |<--->|      Core      |
|   Extension    |     |                |     |                |
|                |     |                |     |                |
+----------------+     +----------------+     +------+---------+
                                                     |
                                                     v
                       +----------------+     +------+---------+
                       |                |     |                |
                       |    Database    |<--->|   Detectors    |
                       |                |     |                |
                       |                |     |                |
                       +----------------+     +----------------+
```

## Настройка среды разработки

### Требования
- Python 3.8+
- pip (менеджер пакетов Python)
- Git
- Node.js и npm (для разработки браузерных расширений)
- Docker (опционально, для контейнеризации)

### Шаги по настройке

1. Клонировать репозиторий:
   ```bash
   git clone https://github.com/physcorgi/CorgPhish.git
   cd CorgPhish
   ```

2. Создать и активировать виртуальное окружение:
   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # macOS/Linux
   source venv/bin/activate
   ```

3. Установить зависимости для разработки:
   ```bash
   pip install -r requirements-dev.txt
   ```

4. Настроить pre-commit хуки:
   ```bash
   pre-commit install
   ```

5. Для разработки браузерного расширения:
   ```bash
   cd browser-extension
   npm install
   ```

## Структура кода

```
CorgPhish/
├── corgphish/              # Основной пакет
│   ├── __init__.py
│   ├── core/               # Ядро системы
│   │   ├── __init__.py
│   │   ├── engine.py       # Основной движок анализа
│   │   └── config.py       # Конфигурация
│   ├── detectors/          # Модули обнаружения
│   │   ├── __init__.py
│   │   ├── url_analyzer.py # Анализатор URL
│   │   ├── content_analyzer.py # Анализатор содержимого
│   │   ├── ssl_checker.py  # Проверка SSL
│   │   └── ml_detector.py  # Детектор на основе ML
│   ├── api/                # API интерфейс
│   │   ├── __init__.py
│   │   ├── routes.py       # Маршруты API
│   │   └── models.py       # Модели данных API
│   ├── db/                 # Работа с базой данных
│   │   ├── __init__.py
│   │   ├── models.py       # Модели базы данных
│   │   └── operations.py   # Операции с базой данных
│   └── ui/                 # Пользовательский интерфейс
│       ├── __init__.py
│       ├── app.py          # Основное приложение
│       └── views/          # Представления
├── browser-extension/      # Браузерное расширение
│   ├── src/
│   ├── manifest.json
│   └── package.json
├── tests/                  # Тесты
│   ├── unit/
│   └── integration/
├── docs/                   # Документация
├── scripts/                # Вспомогательные скрипты
├── requirements.txt        # Основные зависимости
├── requirements-dev.txt    # Зависимости для разработки
└── setup.py                # Скрипт установки
```

## API

### Основные эндпоинты

1. **URL Check** - `/api/v1/check`
   - **Метод**: POST
   - **Параметры**: `url` (строка)
   - **Ответ**: результаты проверки в формате JSON

2. **Batch Check** - `/api/v1/batch-check`
   - **Метод**: POST
   - **Параметры**: `urls` (массив строк)
   - **Ответ**: массив результатов проверки в формате JSON

3. **Report** - `/api/v1/report`
   - **Метод**: POST
   - **Параметры**: `url` (строка), `is_phishing` (булево), `notes` (строка)
   - **Ответ**: статус отчета

### Пример использования API

```python
import requests

api_url = "https://api.corgphish.example.com/v1/check"
data = {"url": "https://example.com"}

response = requests.post(api_url, json=data)
result = response.json()

print(f"Is phishing: {result['is_phishing']}")
print(f"Confidence: {result['confidence']}")
print(f"Analysis: {result['analysis']}")
```

## Разработка детекторов фишинга

### Создание нового детектора

1. Создайте новый файл в директории `corgphish/detectors/`
2. Реализуйте класс детектора, наследующий от базового класса `Detector`:

```python
from corgphish.detectors.base import Detector

class MyCustomDetector(Detector):
    """Custom phishing detector implementation."""
    
    def __init__(self, config=None):
        super().__init__(config)
        # Initialize your detector
        
    def analyze(self, url, html_content=None):
        """
        Analyze URL and content for phishing patterns.
        
        Args:
            url (str): URL to analyze
            html_content (str, optional): HTML content of the page
            
        Returns:
            dict: Analysis results
        """
        # Implement your detection algorithm
        
        # Return results
        return {
            "score": 0.75,  # Score between 0 and 1
            "features": {
                "feature1": True,
                "feature2": False
            },
            "details": "Detailed explanation of findings"
        }
```

3. Зарегистрируйте детектор в `corgphish/detectors/__init__.py`:

```python
from corgphish.detectors.my_custom_detector import MyCustomDetector

# Register your detector
AVAILABLE_DETECTORS = {
    # ... existing detectors
    "my_custom": MyCustomDetector,
}
```

### Советы по разработке детекторов

- Разделяйте логику и используйте небольшие специализированные функции
- Документируйте признаки, которые ищет ваш детектор
- Включайте уровень достоверности для каждого обнаруженного признака
- Уделяйте внимание производительности, особенно для операций, которые могут выполняться часто

## Тестирование

### Запуск тестов

```bash
# Запуск всех тестов
pytest

# Запуск конкретного теста
pytest tests/unit/test_url_analyzer.py

# Запуск с отчетом о покрытии
pytest --cov=corgphish tests/
```

### Написание тестов

1. Создайте новый тестовый файл в соответствующей директории (`tests/unit/` или `tests/integration/`)
2. Используйте pytest для написания тестов:

```python
import pytest
from corgphish.detectors.url_analyzer import URLAnalyzer

def test_url_analyzer_suspicious_domain():
    analyzer = URLAnalyzer()
    result = analyzer.analyze("http://paypa1.com/login")
    
    assert result["score"] > 0.7
    assert "typosquatting" in result["features"]
    assert result["features"]["typosquatting"] is True
```

## Внесение изменений

### Процесс разработки

1. Создайте ветку для своей функциональности:
   ```bash
   git checkout -b feature/my-new-feature
   ```

2. Внесите необходимые изменения

3. Убедитесь, что тесты проходят:
   ```bash
   pytest
   ```

4. Отформатируйте код:
   ```bash
   black corgphish tests
   isort corgphish tests
   ```

5. Зафиксируйте изменения:
   ```bash
   git add .
   git commit -m "Add my new feature"
   ```

6. Создайте Pull Request

### Руководство по стилю кода

- Следуйте PEP 8 для Python-кода
- Используйте Google Style для документации функций и классов
- Ограничивайте длину строки до 88 символов (рекомендация black)
- Используйте говорящие имена переменных и функций

## Выпуск релизов

### Процесс создания релиза

1. Обновите версию в `setup.py` и `corgphish/__init__.py`

2. Обновите CHANGELOG.md

3. Создайте тег для новой версии:
   ```bash
   git tag -a v1.0.0 -m "Release v1.0.0"
   git push origin v1.0.0
   ```

4. Соберите пакет:
   ```bash
   python setup.py sdist bdist_wheel
   ```

5. Опубликуйте на PyPI (если применимо):
   ```bash
   twine upload dist/*
   ```

6. Для браузерного расширения:
   ```bash
   cd browser-extension
   npm run build
   ```

---

## Дополнительные ресурсы

- [Полная API документация](../PROJECT_DOCUMENTATION.md#api-reference)
- [Руководство по внесению вклада](../CONTRIBUTING.md)
- [Кодекс поведения](../CODE_OF_CONDUCT.md)

Если у вас есть вопросы или предложения по улучшению данного руководства, пожалуйста, [создайте Issue](https://github.com/physcorgi/CorgPhish/issues) на GitHub. 
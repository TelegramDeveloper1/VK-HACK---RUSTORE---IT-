

## Описание проекта

Проект представляет собой full-stack приложение для рекомендации мобильных приложений и игр на основе текстовых запросов пользователя. Система анализирует запрос через Mistral AI, извлекает характеристики (категория, теги, возраст) и возвращает наиболее подходящие приложения из базы данных PostgreSQL.

[Смотреть скринкаст](./screencast.mp4)

## Технологический стек

### Backend
FastAPI — асинхронный веб-фреймворк
SQLAlchemy 2.0 — ORM с поддержкой async
PostgreSQL — основная база данных
asyncpg — асинхронный драйвер для PostgreSQL
Mistral AI — языковая модель для анализа запросов
Pydantic — валидация данных и настройки
uvicorn — ASGI сервер

### Frontend
React — UI библиотека
Create React App — инструмент сборки

### Установка и запуск

#### Предварительные требования
Python 3.10+
PostgreSQL 14+
Node.js 16+ (для фронтенда)
API ключ Mistral AI

#### 1. Установка зависимостей Backend
Создайте виртуальное окружение и установите зависимости:
```bash
# Создание виртуального окружения
python -m venv venv

# Активация (Windows)
venv\Scripts\activate

# Активация (Linux/Mac)
source venv/bin/activate

# Установка зависимостей
pip install fastapi uvicorn sqlalchemy asyncpg python-dotenv pydantic pydantic-settings mistralai


**Полный список зависимостей:**

fastapi==0.108.0
uvicorn[standard]==0.25.0
sqlalchemy==2.0.25
asyncpg==0.29.0
python-dotenv==1.0.0
pydantic==2.5.3
pydantic-settings==2.1.0
mistralai==0.1.0
```

#### 2. Настройка базы данных
Создайте PostgreSQL базу данных:
```sql
CREATE DATABASE appstore_db;
CREATE USER appstore_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE appstore_db TO appstore_user;
```

#### 3. Конфигурация окружения
Создайте файл server/.env:

```env
# Mistral AI
API_KEY=your_mistral_api_key_here

# PostgreSQL
user=appstore_user
password=your_password
db_name=appstore_db
host=localhost
port=5432
```
Пример с заданными значениями можно найти в файле /server/.env.example

#### 4. Запуск Backend

```bash
cd server
python main.py
```

#### 5. Установка зависимостей Frontend
```bash
cd frontend
npm install
```

#### 6. Запуск Frontend
```bash
npm start
```

### API Endpoints

GET /ai/ask
Получение рекомендаций приложений на основе текстового запроса.
Параметры:
message (query string) — текстовый запрос пользователя

Пример запроса:
```bash
curl "http://localhost:8000/ai/ask?message=игра для детей с головоломками"
```
Пример ответа:
```json
[
  {
    "id": 1,
    "name": "Pixel Painter",
    "picture": "http://localhost:3000/apps/icons/app3.png",
    "category": "Полезные инструменты",
    "age_rating": "0+",
    "tags": ["Гиперказуальная игра"],
    "relevance_score": 2,
    "match_percentage": 66.67
  }
]
```

### Алгоритм подбора приложений
```python
pythonrelevance_score = len(set(app_tags) & set(search_tags))
match_percentage = (relevance_score / len(search_tags)) * 100
```

### Функционал, который возможно добавить в будущем
1. Docker контейнеризация дл быстрого деплоя прилжения
2. Аутентификация через OAuth
3. Кэширование запросов (Redis)
4. Аналитика запросов
5. Разделение БД — отдельные таблицы для игр и обычных приложений для оптимизации
6. Клипы приложений — короткие видео-превью функционала
7. Мини-опросники — персонализированные рекомендации на основе ответов пользователя

from mistralai import Mistral
import json
import re

# import sys
# from pathlib import Path
# sys.path.append(str(Path(__file__).parent.parent.parent))

from server.config import config
from server.DB import *

Api_Key=config.API_KEY.get_secret_value()
model = "mistral-small-latest"
client = Mistral(api_key=Api_Key)

zaglushka_games = ["Экшен",
"Головоломки",
"Шутеры",
"Симуляторы",
"Стратегии",
"Ролевые",
"Аркады",
"Приключения",
"Настольные и карточные",
"Казуальные",
"Детские",
"Гоночные",
"Словесные",
"Викторины",
"Спортивные",
"Утилиты",
"Платные",
"Казино",
"Музыкальные",
"Игры с AR",
"Инди",
"Карточные",
"Настольные игры",
"Семейные"]

zaglushka = []

def AI_request(message: str): #async 
    prompt = message
    client = Mistral(api_key=Api_Key)
    chat_response = client.chat.complete(
    model = model,
    messages = [
        {
            "role": "system",
            "content": prompt,
        },
        {
            "role": "user",
            "content": f'''Ты — AI-ассистент для анализа мобильных приложений. Твоя задача — анализировать текстовый запрос пользователя и возвращать структурированный JSON-профиль с характеристиками подходящего приложения.

# ИНСТРУКЦИИ:
1. Проанализируй запрос пользователя и определи:
   - Тип приложения (игра или обычное приложение: game / app)
   - Жанр и поджанр из списка: если игра: {zaglushka_games}/ если обычное приложение: {zaglushka}
   - Ключевые теги с релевантностью из списка: {zaglushka}
   - Возрастной рейтинг из списка: {zaglushka}
   - Основные функции, особенно AI-фичи если есть, из списка: {zaglushka}

2. ВСЕГДА возвращай ТОЛЬКО валидный JSON в следующем формате(json):

 "type": "game/app",
 "category": "",
 "tags": "['shoter', 'strategy']",
 "age": "0+",

''',
        },
        ]
    )
    print(chat_response.choices[0].message.content)
    return chat_response.choices[0].message.content

def clean_ai_response(ai_response: str) -> dict:
    try:
        # Удаляем markdown код (```json и ```)
        cleaned = re.sub(r'```json\s*|\s*```', '', ai_response).strip()
        
        # Парсим JSON
        data = json.loads(cleaned)
        
        # Извлекаем только нужные поля для поиска в БД
        search_params = {
            'category': data.get('type', ''),
            'tags': data.get('tags', []),
            'age_rating': data.get('age', '')
        }
        
        return search_params
        
    except json.JSONDecodeError as e:
        print(f"❌ Ошибка парсинга JSON: {e}")
        # Если не удалось распарсить, возвращаем значения по умолчанию
        return {
            'category': '',
            'tags': [],
            'age_rating': ''
        }

async def done_func(message: str):
    test = AI_request(message)
    data = clean_ai_response(test)
    # arr_data = data.keys()
    # print(arr_data)
    # return await get_recommended_apps1(test)
    print("Ok", data["tags"], data["age_rating"])
    return await get_recommended_apps1("Транспорт и навигация", data["tags"], data["age_rating"], 1)

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy import Table, Column, Integer, String, MetaData, ARRAY, text, select, update, delete, BigInteger
from sqlalchemy.orm import sessionmaker


from sqlalchemy import select, func, and_, case
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional


import os
from dotenv import load_dotenv

load_dotenv()

# Конфигурация базы данных
user = os.getenv("user")
password = os.getenv("password")
db_name = os.getenv("db_name")
host = os.getenv("host")
port = int(os.getenv("port"))

db_url = f"postgresql+asyncpg://{user}:{password}@{host}:{port}/{db_name}"

# Создание движка и сессии
engine = create_async_engine(
    url=db_url,
    echo=True,  # Логи в консоль
)

AsyncSessionLocal = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False
)

metadata_obj = MetaData()

apps_table = Table(
    "Apps",
    metadata_obj,
    Column("id", Integer, primary_key=True),
    Column("name", String, unique=True),
    Column("picture", String),
    Column("category", String),
    Column("tags", ARRAY(String)),
    Column("age", String)
)


class AppsDatabase:
    async def test_connection():
        try:
            async with engine.connect() as conn:
                result = await conn.execute(text("SELECT VERSION()"))
                version = result.scalar()
                print(f"✅ Success! Database version: {version}")
                return True
        except Exception as e:
            print(f"❌ Connection failed: {e}")
            return False

    async def create_tables():
        """Создание таблиц"""
        try:
            async with engine.begin() as conn:
                await conn.run_sync(metadata_obj.create_all)
            print("✅ Tables created successfully")
            return True
        except Exception as e:
            print(f"❌ Error creating tables: {e}")
            return False

    async def app_add(name: str, picture: str, category: str, tags: list, age: str):
        try:
            async with AsyncSessionLocal() as session:
                adding = apps_table.insert().values(
                    name=name,
                    picture=picture,
                    category=category,
                    tags=tags,
                    age=age
                )
                result = await session.execute(adding)
                await session.commit()
                
                app_id = result.inserted_primary_key[0]
                print(f"✅ User added with ID: {app_id}")
                return app_id
        except Exception as e:
            print(f"❌ Error: {e}")
            return None
        

    async def get_app_id(name: str):
        try:
            async with AsyncSessionLocal() as session:
                app = select(apps_table).where(apps_table.c.name == name)
                result = await session.execute(app)
                app = result.fetchone()
                # print(user["id"])
                # return user["id"]
                return app[0]
        except Exception as e:
            print(f"❌ Error getting user: {e}")
            return None


    # async def get_recommended_apps(
    #     category: Optional[str] = None,
    #     tags: Optional[List[str]] = None,
    #     age_rating: Optional[str] = None,
    #     limit: int = 10
    # ) -> List[dict]:
    #     try:
    #         async with AsyncSessionLocal() as session:
    #             # Базовые условия WHERE
    #             conditions = []
    #             # if category:
    #             #     conditions.append(apps_table.c.category == category)
    #             # if age_rating:
    #             #     conditions.append(apps_table.c.age == age_rating)
                
    #             if tags:
    #                 tag_match_conditions = []
    #                 for tag in tags:
    #                     tag_match_conditions.append(
    #                         func.array_position(apps_table.c.tags, tag).isnot(None)
    #                     )
                    
    #                 match_count = func.coalesce(
    #                     func.greatest(
    #                         *[func.cast(func.array_position(apps_table.c.tags, tag), Integer) 
    #                         for tag in tags]
    #                     ), 
    #                     0
    #                 )
                    
    #                 query = (
    #                     select(
    #                         apps_table,
    #                         func.coalesce(
    #                             func.array_length(
    #                                 func.array(
    #                                     *[func.array_position(apps_table.c.tags, tag) 
    #                                     for tag in tags if func.array_position(apps_table.c.tags, tag).isnot(None)]
    #                                 ), 
    #                                 1
    #                             ), 
    #                             0
    #                         ).label('relevance_score')
    #                     )
    #                     .where(and_(*conditions) if conditions else True)
    #                     .order_by(
    #                         func.coalesce(
    #                             func.array_length(
    #                                 func.array(
    #                                     *[func.array_position(apps_table.c.tags, tag) 
    #                                     for tag in tags if func.array_position(apps_table.c.tags, tag).isnot(None)]
    #                                 ), 
    #                                 1
    #                             ), 
    #                             0
    #                         ).desc(),
    #                         apps_table.c.name.asc()
    #                     )
    #                     .limit(limit)
    #                 )
                    
    #             else:
    #                 query = (
    #                     select(apps_table)
    #                     .where(and_(*conditions) if conditions else True)
    #                     .order_by(apps_table.c.name.asc())
    #                     .limit(limit)
    #                 )
                
    #             result = await session.execute(query)
    #             apps_data = result.fetchall()
                
    #             apps_list = []
    #             for app_row in apps_data:
    #                 app_dict = {
    #                     'id': app_row.id,
    #                     'name': app_row.name,
    #                     'picture': app_row.picture,
    #                     # 'category': app_row.category,
    #                     'age_rating': app_row.age,
    #                     'tags': app_row.tags or [],
    #                 }
    #                 if tags:
    #                     app_tags = app_row.tags or []
    #                     relevance_score = len(set(app_tags) & set(tags))
    #                     app_dict['relevance_score'] = relevance_score
    #                     app_dict['match_percentage'] = min(100, (relevance_score / len(tags)) * 100)
    #                 else:
    #                     app_dict['relevance_score'] = 0
    #                     app_dict['match_percentage'] = 0
                    
    #                 apps_list.append(app_dict)
                
    #             if tags:
    #                 apps_list.sort(key=lambda x: x['relevance_score'], reverse=True)
                
    #             return apps_list
                
    #     except Exception as e:
    #         print(f"❌ Error getting recommended apps: {e}")
    #         return []










    async def get_recommended_apps(
        category: Optional[str] = None,
        tags: Optional[List[str]] = None,
        age_rating: Optional[str] = None,
        limit: int = 10
    ) -> List[dict]:
        try:
            async with AsyncSessionLocal() as session:
                query = select(apps_table)
                result = await session.execute(query)
                all_apps = result.fetchall()
                
                print(f"🔍 Всего приложений в БД: {len(all_apps)}")
                print(f"🎯 Ищем по тегам: {tags}")
                
                filtered_apps = []
                
                for app_row in all_apps:
                    app_tags = app_row.tags or []
                    print(f"📱 {app_row.name}: теги {app_tags}")
                    
                    relevance_score = 0
                    if tags:
                        relevance_score = len(set(app_tags) & set(tags))
                        print(f"   ➡ Совпадений: {relevance_score}")
                    
                    filtered_apps.append({
                        'app': app_row,
                        'relevance_score': relevance_score
                    })
                
                filtered_apps.sort(key=lambda x: x['relevance_score'], reverse=True)
                
                top_apps = filtered_apps[:limit]
                
                apps_list = []
                for item in top_apps:
                    app_row = item['app']
                    app_dict = {
                        'id': app_row.id,
                        'name': app_row.name,
                        'picture': app_row.picture,
                        'category': app_row.category,
                        'age_rating': app_row.age,
                        'tags': app_row.tags or [],
                        'relevance_score': item['relevance_score'],
                        'match_percentage': min(100, (item['relevance_score'] / len(tags)) * 100) if tags and len(tags) > 0 else 0
                    }
                    apps_list.append(app_dict)
                    print(f"✅ Добавлено: {app_row.name} - {item['relevance_score']} совпадений")
                
                print(f"🎯 Итог: найдено {len(apps_list)} приложений")
                return apps_list
                
        except Exception as e:
            print(f"❌ Error getting recommended apps: {e}")
            import traceback
            traceback.print_exc()
            return []














async def initialize_database_apps():
    """Инициализация БД"""
    print("🚀 Initializing database...")

    if not await AppsDatabase.test_connection():
        return False
    
    if not await AppsDatabase.create_tables():
        return False
    
    print("✅ Database initialized successfully")
    return True


async def add_app(name: str, picture: str, category: str, tags: list, age: str):
    try:
        res = await AppsDatabase.app_add(name, picture, category, tags, age)
        return res
    except Exception as e:
        print(f"Ошибка: {e}")
        return False





async def get_recommended_apps1(category: Optional[str] = None,
        tags: Optional[List[str]] = None,
        age_rating: Optional[str] = None,
        limit: int = 10):
    try:
        res = await AppsDatabase.get_recommended_apps(category, tags, age_rating)
        print(res)
        return res
    except Exception as e:
        print(f"[INFO] ERROR {e}")


    
async def drop_all_async():
    async with engine.begin() as conn:
            await conn.run_sync(apps_table.metadata.drop_all)
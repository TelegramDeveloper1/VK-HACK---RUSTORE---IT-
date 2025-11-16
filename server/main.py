import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))
from fastapi import Body, Depends, FastAPI, HTTPException, Response, UploadFile, File, Request, status
from fastapi.responses import StreamingResponse, FileResponse, HTMLResponse, JSONResponse
import uvicorn
# from typing import Annotated, AsyncGenerator
from fastapi.middleware.cors import CORSMiddleware
# from authx.exceptions import JWTDecodeError

from server.config import config
from server.AI import *
from server.DB import *
# from server.OAuth.router import router
# from server.skills.api import api
# from server.admin import *
# from server.urls_work.use_url import urouter
# from server.OAuth import *
# from server.database import *

async def lifespan(app: FastAPI):
    try:
        print("🚀 Start...")
        await drop_all_async()
        await initialize_database_apps()

        await add_app("TaskFlow Pro", "http://localhost:3000/apps/icons/app2.png", "Полезные инструменты", ["Календарь","Личные помощники","События"], "0+")
        await add_app("Pixel Painter", "http://localhost:3000/apps/icons/app3.png", "Полезные инструменты", ["Гиперказуальная игра"], "0+")
        await add_app("MapRun", "http://localhost:3000/apps/icons/app4.png", "Транспорт и навигация", ["Транспорт и навигация", "фитнес", "карты"], "0+")

        yield

    except Exception as e:
        print(f"[INFO] ERROR {e}")
        raise
    finally:
        # await db.close()
        print("Stop...")


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[config.WEBAPP_URL], #"http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(airouter)
# app.include_router(api)
# app.include_router(arouter)
# app.include_router(urouter)

# @app.get("/api")
# async def get_python():
#     try:
#         with open(f"server/skills.txt") as file:
#             lines = file.readlines()
#         return JSONResponse(status_code=200, content={"answer": lines})
#     except Exception:
#         return JSONResponse(status_code=401, content="ERROR")


#____________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
if __name__ == "__main__":
    # asyncio.run(dp.start_polling(bot))
    uvicorn.run(app, host=config.APP_HOST, port=config.APP_PORT)
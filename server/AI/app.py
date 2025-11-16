from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse

from server.AI.ai_req import AI_request, done_func

airouter = APIRouter(prefix='/ai')

@airouter.get('/ask')
async def ai_ask(message: str):
    try:
        # ans = AI_request(message)
        ans = await done_func(message)

        return JSONResponse(status_code=200, content=ans)
    except Exception:
        return JSONResponse(status_code=401, content="ERROR with AI connection")
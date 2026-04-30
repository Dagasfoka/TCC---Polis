from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from backend.app.api.routes.routes import router as api_router
from backend.app.api.routes.websocket import router as websocket_router

app = FastAPI()

app.mount('/static', StaticFiles(directory='static'), name='static')

app.include_router(api_router)
app.include_router(websocket_router)

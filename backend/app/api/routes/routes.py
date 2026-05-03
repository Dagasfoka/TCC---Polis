from fastapi import APIRouter, Request
from fastapi.templating import Jinja2Templates
from backend.app.api.routes.match import router_match
router = APIRouter()
templates = Jinja2Templates(directory='templates')


@router.get('/')
async def get_index(request: Request):
    return templates.TemplateResponse('index.html', {'request': request})

router.include_router(router_match)
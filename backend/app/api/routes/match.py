# Rotas HTTP auxiliares da partida.
from fastapi import APIRouter
from fastapi.templating import Jinja2Templates
from backend.app.services.match_service import create_match
from fastapi import Depends
from sqlalchemy.orm import Session
from backend.app.api.deps import get_db

router_match = APIRouter()
templates = Jinja2Templates(directory='templates')

@router_match.post("/matches")
async def post_match(db: Session = Depends(get_db)):
    return create_match(db)
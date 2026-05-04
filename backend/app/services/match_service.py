# Ataque, defesa, turno, vitória, mapa.
from backend.app.repositories.match_repo import get_match_state, save_match_state
from backend.app.repositories.room_repo import get_room_repo
from backend.app.services.factories.match_factory import (
    build_initial_match_state,
)


def create_match(db,room_id):
    room=get_room_repo(room_id)
    
    if room is None:
        raise ValueError("Sala não encontrada")
    
    match_state=build_initial_match_state(db,room)
    match_state_dict = match_state.to_dict()
    save_match_state(match_state_dict)
    return match_state_dict

def get_match(match_id):
    return get_match_state(match_id)
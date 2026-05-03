# Ataque, defesa, turno, vitória, mapa.
from backend.app.services.factories.match_territory_factory import build_initial_match_state,convert_match_state_to_dict
from backend.app.repositories.match_repo import save_match_state

def create_match(db):
    match_state=build_initial_match_state(db)
    match_state_dict = convert_match_state_to_dict(match_state)
    save_match_state(match_state_dict)
    return match_state_dict
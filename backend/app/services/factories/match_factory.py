from backend.app.models.match import Match
from backend.app.models.match_territory import MatchTerritory
from backend.app.repositories.match_repo import generate_match_id
from backend.app.repositories.territory_repo import get_all_territories


def build_initial_match_state(db,room_dict) -> Match:

    territories= get_all_territories(db)
    match_territories=[]
    match_id=generate_match_id()
    round = 1
    
    for territory_data in territories:
        match_territory = MatchTerritory(
            match_id=match_id,
            territory_id=territory_data.id,
            base_influence=territory_data.base_influence,
            name=territory_data.name,
            region=territory_data.region)
        match_territories.append(match_territory)
        
    match_state=Match(
        match_id,
        match_territories,
        room_dict["room_code"],
        room_dict["players"],
        round
    )
    return match_state
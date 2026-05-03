from backend.app.repositories.match_repo import generate_match_id
from backend.app.repositories.territory_repo import get_all_territories
from backend.app.models.match_territory import MatchTerritory
def build_initial_match_state(db) -> dict:

    territories= get_all_territories(db)
    match_territories=[]
    match_id=generate_match_id()
    for territory_data in territories:
        match_territory = MatchTerritory(
            match_id=match_id,
            territory_id=territory_data.id,
            base_influence=territory_data.base_influence,
            name=territory_data.name,
            region=territory_data.region)
        match_territories.append(match_territory)
    match_state={'match_id': match_id,
        'territories':match_territories}
    return match_state
def convert_match_state_to_dict(match_state) -> dict:
    territories_dict=[]
    for territory_data in match_state['territories']:
        territories_dict.append(territory_data.to_dict())
    new_match_state={
        'match_id':match_state['match_id'],
        'territories':territories_dict
    }
    return  new_match_state
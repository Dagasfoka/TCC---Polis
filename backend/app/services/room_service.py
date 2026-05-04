# Criar sala, entrar, sair, iniciar partida.]
from backend.app.repositories.player_repo import get_player_repo
from backend.app.repositories.room_repo import get_room_repo, save_room
from backend.app.services.factories.room_factory import build_room
from backend.app.services.match_service import create_match


def create_room(host_player_id:str) -> dict:
    room = build_room(host_player_id)
    room_dict = room.to_dict()
    save_room(room_dict)
    return room_dict

def join_room(player_id, room_code):
    room_dict = get_room(room_code)

    if room_dict is None:
        raise Exception("Room não existe")

    player = get_player_repo(player_id)

    if player is None:
        raise Exception("Player não existe")

    # evitar duplicado
    if any(p["player_id"] == player["player_id"] for p in room_dict["players"]):
        return room_dict

    room_dict["players"].append(player)

    save_room(room_dict)

    return room_dict

def get_room(room_code):
    return get_room_repo(room_code)

def start_room(room_code, player_id):
    room = get_room(room_code)

    if player_id != room["host_id"]:
        raise Exception("Apenas o host pode iniciar")

    match = create_match(room_code)

    room["status"] = "in_game"
    save_room(room_code, room)

    return match
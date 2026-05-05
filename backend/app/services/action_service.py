import random

from backend.app.repositories.action_option_repo import (
    get_option_by_id,
    list_options_by_action,
)
from backend.app.repositories.match_repo import (
    get_match_state,
    save_match_state,
)
from backend.app.services.match_mission_service import (
    final_round_verify,
    start_round_verify,
)


def get_attack_options():
    return list_options_by_action("attack")


def resolve_attack_option(
    match_id,
    player_id: str,
    target_territory_id: str,
    option_id: str,
):
    match = get_match_state(match_id)

    if match is None:
        raise ValueError("Partida não encontrada")

    if match["status"] != "running":
        raise ValueError("Partida não está em andamento")

    if match["current_turn_player_id"] != player_id:
        raise ValueError("Não é o turno desse jogador")

    option = get_option_by_id(option_id)

    if option is None:
        raise ValueError("Opção inválida")

    target = find_territory(match, target_territory_id)

    if target is None:
        raise ValueError("Território não encontrado")

    if target["owner_id"] == player_id:
        raise ValueError("Você já controla esse território")

    roll = random.randint(1, 100)
    success = roll >= 100 - option["success_chance"]

    influence_generated = 0
    conquered = False
    leftover = 0

    old_owner_id = target["owner_id"]
    old_current_influence = target["current_influence"]

    if success:
        influence_generated = option["influence_generated"]

        current_influence = target["current_influence"]
        base_influence = target["base_influence"]

        if influence_generated > current_influence:
            conquered = True
            leftover = influence_generated - current_influence

            target["owner_id"] = player_id
            target["current_influence"] = base_influence + leftover
        else:
            target["current_influence"] = current_influence - influence_generated

    action_result = {
        "success": success,
        "roll": roll,
        "option": option,
        "option_id": option["option_id"],
        "title": option["title"],
        "description": option["description"],
        "risk_level": option["risk_level"],
        "cost_money": option["cost_money"],
        "success_chance": option["success_chance"],
        "target_territory_id": target_territory_id,
        "territory_id": target_territory_id,
        "territory_name": target["name"],
        "old_owner_id": old_owner_id,
        "new_owner_id": target["owner_id"],
        "previous_owner_id": old_owner_id,
        "old_current_influence": old_current_influence,
        "new_current_influence": target["current_influence"],
        "previous_influence": old_current_influence,
        "new_influence": target["current_influence"],
        "influence_generated": influence_generated,
        "conquered": conquered,
        "leftover": leftover,
    }

    match["last_action_result"] = action_result

    save_match_state(match)

    won = final_round_verify(match_id, player_id)

    if won:
        match = get_match_state(match_id)
        match["status"] = "finished"
        match["winner_id"] = player_id
        match["last_action_result"] = action_result
        save_match_state(match)

        return {
            "match": match,
            "result": {
                **action_result,
                "next_turn_player_id": match["current_turn_player_id"],
                "round": match["round"],
                "winner_id": player_id,
                "status": "finished",
            },
        }

    match = get_match_state(match_id)

    advance_turn(match)

    save_match_state(match)

    start_round_verify(match_id, match["current_turn_player_id"])

    match = get_match_state(match_id)
    match["last_action_result"] = action_result

    save_match_state(match)

    return {
        "match": match,
        "result": {
            **action_result,
            "next_turn_player_id": match["current_turn_player_id"],
            "round": match["round"],
            "winner_id": match.get("winner_id"),
            "status": match["status"],
        },
    }


def find_territory(match: dict, territory_id: str):
    for territory in match["territories"]:
        if territory["territory_id"] == territory_id:
            return territory

    return None


def advance_turn(match: dict):
    players = match["players"]
    current_player_id = match["current_turn_player_id"]

    current_index = 0

    for index, player in enumerate(players):
        if player["player_id"] == current_player_id:
            current_index = index
            break

    next_index = (current_index + 1) % len(players)

    if next_index == 0:
        match["round"] += 1

    match["current_turn_player_id"] = players[next_index]["player_id"]
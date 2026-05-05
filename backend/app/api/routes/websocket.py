# Endpoint WebSocket da partida.
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from backend.app.repositories.match_repo import get_match_state
from backend.app.websocket.events import build_error, build_personal_match_state
from backend.app.websocket.handlers import handle_match_message
from backend.app.websocket.manager import manager

router_websocket = APIRouter()


@router_websocket.websocket("/ws/match/{match_id}/{player_id}")
async def match_websocket(websocket: WebSocket, match_id: int, player_id: str):
    await manager.connect(match_id, player_id, websocket)

    try:
        match_dict = get_match_state(match_id)

        if match_dict is None:
            await websocket.send_json(build_error("Partida não encontrada."))
            return

        await websocket.send_json(
            build_personal_match_state(match_dict, player_id)
        )

        while True:
            data = await websocket.receive_json()

            try:
                updated_match = await handle_match_message(
                    match_id=match_id,
                    player_id=player_id,
                    data=data,
                )

                await manager.broadcast_match(
                    match_id,
                    lambda target_player_id: build_personal_match_state(
                        updated_match,
                        target_player_id,
                    ),
                )

            except ValueError as error:
                await websocket.send_json(build_error(str(error)))

    except WebSocketDisconnect:
        manager.disconnect(match_id, player_id)
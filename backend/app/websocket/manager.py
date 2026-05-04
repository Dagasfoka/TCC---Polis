# Guarda conexões ativas e faz broadcast por sala.
from fastapi import WebSocket


#esse codigo tem que ser mudado para funcionar com redis e db
class ConnectionManager:
    def __init__(self):
        self.connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.connections:
            self.connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.connections.copy():
            await connection.send_text(message)


manager = ConnectionManager()

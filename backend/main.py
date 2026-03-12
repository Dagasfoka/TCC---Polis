from fastapi import FastAPI, WebSocket
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from pathlib import Path

app = FastAPI()

# servir arquivos estáticos
app.mount("/static", StaticFiles(directory="static"), name="static")

players = []

@app.get("/")
async def get_index():
    return HTMLResponse(Path("static/index.html").read_text())


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):

    print("Novo jogador tentando conectar")

    await websocket.accept()
    players.append(websocket)

    print("Jogador conectado. Total:", len(players))

    try:
        while True:
            data = await websocket.receive_text()

            print("Mensagem recebida:", data)

            for player in players.copy():
                try:
                    await player.send_text(data)
                except:
                    players.remove(player)

    except:
        players.remove(websocket)
        print("Jogador desconectado")

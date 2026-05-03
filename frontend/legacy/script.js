const socket = new WebSocket(
  (location.protocol === "https:" ? "wss://" : "ws://") +
  location.host +
  "/ws"
)

// quando conecta
socket.onopen = function() {
    alert("Conectado ao servidor")
}

// quando recebe mensagem
socket.onmessage = function(event) {
    console.log("Mensagem recebida:", event.data)
    alert(event.data + " mandou um olá")
}

// quando desconecta
socket.onclose = function() {
    console.log("Conexão fechada")
}

// botão enviar


function enviar() {
    const name = document.getElementById("playerName").value
    socket.send(name)
}

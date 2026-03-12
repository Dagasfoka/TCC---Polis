const socket = new WebSocket(
  (location.protocol === "https:" ? "wss://" : "ws://") +
  location.host +
  "/ws"
)

// quando conecta
socket.onopen = function() {
    console.log("Conectado ao servidor")
    alert("Conectado ao servidor")
}

// quando recebe mensagem
socket.onmessage = function(event) {
    console.log("Mensagem recebida:", event.data)
    alert("Mensagem recebida: " + event.data)
}

// quando desconecta
socket.onclose = function() {
    console.log("Conexão fechada")
}

// botão enviar
function enviar() {
    console.log("Enviando mensagem")
    socket.send("Jogador clicou")
}

import { useState, useEffect } from 'react';
import { AVATARS } from './polis/Data';

function LobbyScreen({ player, room_code, room_id, onBack, flash }) {
  const [players, setPlayers] = useState([]);

  
  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8000/ws/lobby/${room_id}`);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setPlayers(data.players);
    };

    return () => socket.close();
  }, [room_id]);

  
  const startGame = async () => {
    await fetch(`http://localhost:8000/rooms/${room_id}/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ player_id: player.id })
    });
  };

  return (
    <div className="htbg lobby-wrap">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', maxWidth: 560 }}>
        <button className="btn btn-dark" onClick={onBack}>← Voltar</button>
        <div className="logo">Polis<em style={{ color: 'var(--gold)' }}>.</em></div>
      </div>

      <div className="card-dark lobby-card anim-up">
        <span className="lbl lbl-light">Código da sala</span>

        <div className="code-box">
          <span>{room_code}</span>
          <button onClick={() => {
            navigator.clipboard.writeText(room_code);
            flash('Código copiado!');
          }}>
            Copiar
          </button>
        </div>

        {/* CONTADOR */}
        <div className="players-header">
          <span>Jogadores</span>
          <span>{players.length}/4</span>
        </div>

        {/* BARRA */}
        <div className="prog-wrap">
          <div
            className="prog-fill"
            style={{ width: `${(players.length / 4) * 100}%` }}
          />
        </div>

        {/* JOGADORES REAIS */}
        <div className="players-grid">
          {players.map((p, i) => (
            <div key={i} className="p-slot">
              <div className={`p-av ${p.id === player.id ? 'host' : ''}`}>
                {AVATARS[p.avatar]}
              </div>

              <div>
                <div>
                  {p.username} {p.id === player.id ? '(você)' : ''}
                </div>

                {p.is_host ? (
                  <span className="badge bg-gold">Anfitrião</span>
                ) : (
                  <span className="badge bg-teal">Conectado</span>
                )}
              </div>
            </div>
          ))}

          {/* Slots vazios */}
          {[...Array(4 - players.length)].map((_, i) => (
            <div key={`empty-${i}`} className="p-slot empty">
              <div className="p-av">+</div>
              <span>Aguardando jogador</span>
            </div>
          ))}
        </div>

        {/* INFO */}
        <div className="info-box">
          <strong>◆ Missão secreta</strong> será distribuída ao iniciar.
        </div>

        {/* BOTÕES */}
        <div className="btn-row">
          <button className="btn btn-dark" onClick={onBack}>Sair</button>

          <button
            className="btn btn-gold"
            onClick={startGame}
            disabled={players.length < 2}
          >
            Iniciar Partida ▶
          </button>
        </div>
      </div>
    </div>
  );
}

export default LobbyScreen;
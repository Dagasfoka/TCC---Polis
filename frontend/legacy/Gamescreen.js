import { useState, useMemo, useEffect } from 'react';

import GameTopHud from '../components/game/GameHudTop';
import GameMap from '../components/game/GameMap';
import GameSidebar from '../components/game/GameSidebar';
import GameBottomHud from '../components/game/GameBottomHud';
import GameOverlays from './components/game/GameOverlays';

import { COLORS } from './Data';

export default function GameScreen({ player, match_id, onMenu, flash }) {

  const [gs, setGs] = useState(null);

  const [overlay, setOverlay] = useState(null);
  const [qCtx, setQCtx] = useState(null);
  const [diceCtx, setDiceCtx] = useState(null);
  const [resCtx, setResCtx] = useState(null);

  
  useEffect(() => {
    fetch(`http://localhost:8000/matches/${match_id}`)
      .then(res => res.json())
      .then(data => setGs(data));
  }, [match_id]);

  
  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8000/ws/${match_id}`);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setGs(data);
    };

    return () => socket.close();
  }, [match_id]);

  if (!gs) return <div>Carregando jogo...</div>;

  const myStates = Object.entries(gs.t)
    .filter(([, v]) => v === player.id)
    .map(([k]) => k);

  const isMyTurn = gs.turn === player.id;

  const ownerColor = pid => COLORS[pid] || '#2a2624';

  const stateCount = pid =>
    Object.values(gs.t).filter(v => v === pid).length;

  const winner = useMemo(() => {
    if (!gs.won) return null;

    return gs.winner;
  }, [gs.won]);

  
  const selectState = sid => {
    if (!isMyTurn) {
      flash('Aguarde seu turno.');
      return;
    }

    if (gs.t[sid] !== player.id) {
      flash('Selecione um de seus territórios.');
      return;
    }

    setGs(g => ({ ...g, sel: sid }));
  };

  const doAction = action => {
    if (!gs.sel) {
      flash('Selecione um território primeiro.');
      return;
    }

    setQCtx({
      action,
      stateId: gs.sel
    });

    setOverlay('question');
  };

  const handleAnswer = (correct, exp) => {
    const bonus = correct ? 25 : -15;

    setDiceCtx({
      correct,
      action: qCtx.action,
      stateId: qCtx.stateId,
      bonus,
      exp
    });

    setOverlay('dice');
  };

  
  const handleDiceRoll = async (roll) => {
    const res = await fetch('http://localhost:8000/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        player_id: player.id,
        match_id,
        action: diceCtx.action,
        state_id: diceCtx.stateId,
        roll,
        bonus: diceCtx.bonus
      })
    });

    const data = await res.json();

    setResCtx(data);
    setOverlay('result');
  };


  const applyResult = () => {
    setOverlay(null);
  };

  
  const endTurn = async () => {
    await fetch('http://localhost:8000/end-turn', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        player_id: player.id,
        match_id
      })
    });
  };

  const ACTIONS = [
    { id: 'attack', icon: '⚔', label: 'Atacar vizinho' },
    { id: 'reinforce', icon: '◆', label: 'Reforçar influência' },
    { id: 'collect', icon: '$', label: 'Coletar recursos' },
    { id: 'political', icon: '~', label: 'Ação política' }
  ];

  return (
    <div className="game-wrap" style={{ height: '100%' }}>

      <GameTopHud
        gs={gs}
        player={player}
        isMyTurn={isMyTurn}
        onMenu={onMenu}
      />

      <div className="game-map-area">

        <GameMap
          gs={gs}
          selectState={selectState}
          isMyTurn={isMyTurn}
          ownerColor={ownerColor}
        />

        <GameSidebar
          gs={gs}
          COLORS={COLORS}
          isMyTurn={isMyTurn}
          ACTIONS={ACTIONS}
          doAction={doAction}
          stateCount={stateCount}
        />

      </div>

      <GameBottomHud
        gs={gs}
        isMyTurn={isMyTurn}
        endTurn={endTurn}
        flash={flash}
        setOverlay={setOverlay}
      />

      <GameOverlays
        overlay={overlay}
        gs={gs}
        myStates={myStates}
        qCtx={qCtx}
        diceCtx={diceCtx}
        resCtx={resCtx}
        winner={winner}
        setOverlay={setOverlay}
        handleAnswer={handleAnswer}
        handleDiceRoll={handleDiceRoll}
        applyResult={applyResult}
        onMenu={onMenu}
        flash={flash}
      />

    </div>
  );
}
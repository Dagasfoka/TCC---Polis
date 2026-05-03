import { useState, useMemo } from 'react';

import GameTopHud from '../components/game/GameHudTop';
import GameMap from '../components/game/GameMap';
import GameSidebar from '../components/game/GameSidebar';
import GameBottomHud from '../components/game/GameBottomHud';
import GameOverlays from './components/game/GameOverlays';

import { STATES, AVATARS, COLORS, MISSIONS, shuffle } from './Data';
export default function GameScreen({ player, onMenu, flash }) {

  const initState = () => {
    const ids = STATES.map(s => s.id);
    const sh = shuffle(ids);

    const t = {};
    ids.forEach(id => t[id] = null);

    for (let i = 0; i < 5; i++) t[sh[i]] = 0;
    for (let i = 5; i < 10; i++) t[sh[i]] = 1;
    for (let i = 10; i < 15; i++) t[sh[i]] = 2;
    for (let i = 15; i < 20; i++) t[sh[i]] = 3;

    const players = [
      { name: player.username, av: AVATARS[player.avatar], color: COLORS[0] },
      { name: 'Marina_K', av: AVATARS[1], color: COLORS[1] },
      { name: 'Rodolfo99', av: AVATARS[2], color: COLORS[2] },
      { name: 'Guilherme_L', av: AVATARS[3], color: COLORS[3] },
    ];

    return {
      t,
      players,
      res: {
        dinheiro: 500,
        influencia: 30,
        corrupcao: 0
      },
      round: 1,
      turn: 0,
      sel: null,
      missions: MISSIONS.slice(0, 4),
      won: false
    };
  };

  const [gs, setGs] = useState(initState);

  const [overlay, setOverlay] = useState('dist');
  const [qCtx, setQCtx] = useState(null);
  const [diceCtx, setDiceCtx] = useState(null);
  const [resCtx, setResCtx] = useState(null);

  const myStates = Object.entries(gs.t)
    .filter(([, v]) => v === 0)
    .map(([k]) => k);

  const isMyTurn = gs.turn === 0;

  const ownerColor = pid => COLORS[pid] || '#2a2624';

  const stateCount = pid =>
    Object.values(gs.t).filter(v => v === pid).length;

  const winner = useMemo(() => {
    if (!gs.won) return null;

    return gs.missions[0].check(gs.t, 0)
      ? 0
      : [1, 2, 3].reduce((b, i) =>
          stateCount(i) > stateCount(b) ? i : b
        , 0);
  }, [gs.won]);

  const selectState = sid => {
    if (!isMyTurn) {
      flash('Aguarde seu turno.');
      return;
    }

    if (gs.t[sid] !== 0) {
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

  const handleDiceRoll = roll => {
    const { correct, action, stateId, bonus } = diceCtx;

    const base = 50;
    const final = Math.max(5, Math.min(95, base + bonus));
    const success = roll <= final;

    setResCtx({
      correct,
      action,
      stateId,
      success,
      base,
      bonus,
      final,
      roll
    });

    setOverlay('result');
  };

  const applyResult = () => {
    const { action, success } = resCtx;

    setGs(g => {
      const t = { ...g.t };
      const r = { ...g.res };

      if (action === 'attack' && success) {
        const enemies = Object.entries(t)
          .filter(([, v]) => v !== 0 && v !== null);

        if (enemies.length > 0) {
          const [eid] = enemies[Math.floor(Math.random() * enemies.length)];
          t[eid] = 0;
        }
      }

      r.dinheiro = Math.max(0, r.dinheiro - 80);
      r.corrupcao = Math.min(
        100,
        r.corrupcao + (action === 'political' ? 5 : 2)
      );

      if (action === 'collect')
        r.dinheiro += success ? 150 : 60;

      if (action === 'reinforce' || action === 'political')
        r.influencia += success ? 12 : 4;

      const won = g.missions[0].check(t, 0);

      return {
        ...g,
        t,
        res: r,
        sel: null,
        won
      };
    });

    setOverlay(null);
  };

  const endTurn = () => {
    setGs(g => {
      const next = (g.turn + 1) % 4;
      const nextRound = next === 0 ? g.round + 1 : g.round;
      const won = g.missions[0].check(g.t, 0) || nextRound > 5;

      return {
        ...g,
        turn: next,
        round: nextRound,
        sel: null,
        won
      };
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
          setGs={setGs}
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
        setGs={setGs}
        initState={initState}
        onMenu={onMenu}
        flash={flash}
      />

    </div>
  );
}
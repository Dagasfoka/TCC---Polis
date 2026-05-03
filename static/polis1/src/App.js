import React, { useState, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom/client';

import HomeScreen from './HomeScreen';
import LobbyScreen from './LobbyScreen';
import GameScreen from './Gamescreen';

import './Style.css';

function useToast(){
  const [t,setT]=useState({txt:'',on:false});
  const ref=useRef();

  const flash=useCallback((txt)=>{
    clearTimeout(ref.current);
    setT({ txt, on: true });
    ref.current=setTimeout(()=>setT(x=>({...x,on:false})),2500);
  },[]);

  return [t,flash];
}

function App(){
  const [screen,setScreen]=useState('home');
  const [player,setPlayer]=useState({username:'',avatar:0});
  const [toast,flash]=useToast();

  const goLobby=info=>{setPlayer(info);setScreen('lobby');};
  const goGame=()=>setScreen('game');
  const goHome=()=>setScreen('home');

  return(
    <>
      {screen==='home'&&<HomeScreen onEnterLobby={goLobby} onCreateLobby={goLobby} flash={flash}/>}
      {screen==='lobby'&&<LobbyScreen player={player} onStartGame={goGame} onBack={goHome} flash={flash}/>}
      {screen==='game'&&<GameScreen player={player} onMenu={goHome} flash={flash}/>}
      <Toast txt={toast.txt} on={toast.on}/>
    </>
  );
}

function Toast({txt,on}){
  return <div className={`toast${on?' on':''}`}>{txt}</div>;
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
import { useState } from 'react';
import { AVATARS } from './polis/Data';

function LobbyScreen({player,onStartGame,onBack,flash}){
  const [code]=useState(()=>Math.random().toString(36).slice(2,5).toUpperCase()+' '+Math.random().toString(36).slice(2,5).toUpperCase());
  const bots=[{name:'Marina_K',av:1,ready:true},{name:'Rodolfo99',av:2,ready:false}];
  const slots=[{name:player.username,av:player.avatar,host:true,ready:true},...bots,{name:null}];
  const readyAll=slots.filter(p=>p.name).every(p=>p.ready);

  return(
    <div className="htbg lobby-wrap">
      <div style={{display:'flex',alignItems:'center',gap:12,width:'100%',maxWidth:560}}>
        <button className="btn btn-dark" style={{padding:'6px 12px',fontSize:'.78rem'}} onClick={onBack}>← Voltar</button>
        <div className="logo" style={{fontSize:'1.6rem'}}>Polis<em style={{color:'var(--gold)'}}>.</em></div>
      </div>

      <div className="card-dark lobby-card anim-up">
        <span className="lbl lbl-light" style={{marginBottom:10}}>Código da sala — compartilhe com amigos</span>
        <div style={{background:'var(--bg3)',borderRadius:12,padding:'11px 16px',display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16,border:'1px solid #2d4550'}}>
          <span style={{fontFamily:'Space Mono, monospace',fontSize:'1.5rem',letterSpacing:'.4em',color:'var(--tx)',fontWeight:700}}>{code}</span>
          <button className="btn btn-gold" style={{padding:'5px 13px',fontSize:'.72rem'}} onClick={()=>flash('Código copiado!')}>Copiar</button>
        </div>

        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
          <span className="lbl lbl-light" style={{margin:0}}>Jogadores</span>
          <span style={{fontSize:'.62rem',color:'#5a5550',fontFamily:'Space Mono, monospace'}}>{slots.filter(p=>p.name).length}/4</span>
        </div>
        <div className="prog-wrap" style={{marginBottom:14}}>
          <div className="prog-fill" style={{width:`${(slots.filter(p=>p.name).length/4)*100}%`}}/>
        </div>

        <div className="players-grid">
          {slots.map((p,i)=>p.name?(
            <div key={i} className="p-slot">
              <div className={`p-av${p.host?' host':''}`}>{AVATARS[p.av]}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:'.82rem',fontWeight:800,color:'var(--tx)',marginBottom:3}}>{p.name}{p.host?' (você)':''}</div>
                {p.host?<span className="badge bg-gold">Anfitrião</span>:p.ready?<span className="badge bg-green">✓ Pronto</span>:<span className="badge bg-teal">Aguardando...</span>}
              </div>
            </div>
          ):(
            <div key={i} className="p-slot empty">
              <div className="p-av" style={{color:'#3a3530',fontSize:'1rem'}}>+</div>
              <span style={{fontSize:'.75rem',color:'#3a3530'}}>Aguardando jogador</span>
            </div>
          ))}
        </div>

        <div style={{background:'var(--bg3)',border:'1px solid #2d4550',borderRadius:11,padding:'10px 13px',marginBottom:14,fontSize:'.72rem',color:'var(--teal-l)',lineHeight:1.6}}>
          <strong style={{color:'var(--tx)'}}>◆ Missão secreta</strong> e 5 territórios serão distribuídos aleatoriamente ao iniciar a partida.
        </div>

        <div className="btn-row">
          <button className="btn btn-dark" onClick={onBack}>Sair</button>
          <button className="btn btn-gold" style={{flex:2}} onClick={onStartGame}>
            {readyAll?'Iniciar Partida ▶':'▶ Iniciar (modo demo)'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LobbyScreenScreen;
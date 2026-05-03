import { useState } from 'react';
import { AVATARS } from './polis/Data';
import AuthOverlay from './components/AuthOverlay';

function HomeScreen({onEnterLobby,onCreateLobby,flash}){
  const [username,setUsername]=useState('');
  const [selAv,setSelAv]=useState(0);
  const [codeInput,setCodeInput]=useState('');
  const [authMode,setAuthMode]=useState(null); // 'login'|'cadastro'|null

  const go=(create)=>{
    if(!username.trim()){flash('Digite seu nome antes de continuar!');return;}
    if(create) onCreateLobby({username,avatar:selAv});
    else{
      if(codeInput.trim().length<3){flash('Digite um código de sala válido.');return;}
      onEnterLobby({username,avatar:selAv,code:codeInput.trim().toUpperCase()});
    }
  };

  return(
    <div className="htbg" style={{height:'100%',display:'flex',flexDirection:'column'}}>
      {/* header */}
      <div style={{padding:'16px 22px',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid rgba(90,85,80,.25)'}}>
        <div className="logo" style={{fontSize:'2.2rem'}}>Polis<em>.</em></div>
        <div style={{display:'flex',gap:8}}>
          <button className="btn btn-dark" style={{fontSize:'.78rem',padding:'7px 16px'}} onClick={()=>setAuthMode('login')}>Entrar</button>
          <button className="btn btn-gold" style={{fontSize:'.78rem',padding:'7px 16px'}} onClick={()=>setAuthMode('cadastro')}>Criar conta</button>
        </div>
      </div>

      {/* body — fills remaining height */}
      <div style={{flex:1,display:'flex',alignItems:'stretch',padding:'0',gap:0,overflow:'hidden'}}>

        {/* LEFT — avatar + name — 55% width */}
        <div className="home-left-panel anim-up" style={{flex:'0 0 55%',display:'flex',flexDirection:'column',justifyContent:'center',padding:'28px 32px',borderRight:'1px solid rgba(90,85,80,.25)'}}>
          <div style={{marginBottom:10}}>
            <span className="lbl lbl-light" style={{marginBottom:4}}>Identidade do jogador</span>
            <div style={{fontSize:'1.5rem',fontWeight:900,color:'var(--tx)',lineHeight:1.2}}>Quem é você<br/>nesta arena?</div>
          </div>
          <hr className="sep" style={{margin:'16px 0'}}/>

          <div style={{display:'flex',alignItems:'center',gap:20,marginBottom:20}}>
            <div className="av-main-ring" style={{width:110,height:110,fontSize:'3.4rem'}} onClick={()=>setSelAv((selAv+1)%AVATARS.length)}>
              {AVATARS[selAv]}
              <div className="av-badge-edit">✎</div>
            </div>
            <div>
              <div style={{fontSize:'.65rem',color:'var(--teal-l)',fontFamily:'Space Mono,monospace',letterSpacing:'.12em',textTransform:'uppercase',marginBottom:8}}>Escolha seu avatar</div>
              <div className="av-picker" style={{gridTemplateColumns:'repeat(4,40px)',gap:8}}>
                {AVATARS.map((av,i)=>(
                  <button key={i} className={`av-opt${selAv===i?' active':''}`} style={{width:40,height:40,fontSize:'1.25rem'}} onClick={()=>setSelAv(i)}>{av}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="field" style={{marginBottom:12}}>
            <label style={{fontSize:'.88rem'}}>Seu nome no jogo</label>
            <input className="inp" style={{fontSize:'1rem',padding:'.75rem 1rem'}} placeholder="Como quer ser chamado?" value={username} onChange={e=>setUsername(e.target.value)} maxLength={20} onKeyDown={e=>e.key==='Enter'&&go(true)}/>
          </div>

          <div className="section-divider" style={{margin:'12px 0'}}><span>conta (opcional)</span></div>

          <div className="btn-row">
            <button className="btn btn-dark" onClick={()=>setAuthMode('cadastro')} style={{fontSize:'.82rem'}}>📝 Criar conta</button>
            <button className="btn btn-dark" onClick={()=>setAuthMode('login')} style={{fontSize:'.82rem'}}>🔑 Entrar na conta</button>
          </div>
        </div>

        {/* RIGHT — salas — 45% */}
        <div className="anim-up" style={{animationDelay:'.1s',flex:'0 0 45%',display:'flex',flexDirection:'column',justifyContent:'center',padding:'28px 28px',gap:16}}>
          <div>
            <span className="lbl lbl-light" style={{marginBottom:4}}>Partida</span>
            <div style={{fontSize:'1.3rem',fontWeight:900,color:'var(--tx)',lineHeight:1.2,marginBottom:16}}>Entre na<br/>batalha política</div>
          </div>

          <button className="btn btn-gold btn-full" style={{fontSize:'1rem',padding:'1rem',letterSpacing:'.02em'}} onClick={()=>go(true)}>
            ◆ Criar nova sala
          </button>

          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{flex:1,height:1,background:'rgba(90,85,80,.35)'}}/>
            <span style={{fontSize:'.62rem',fontFamily:'Space Mono,monospace',color:'var(--tx-m)',letterSpacing:'.12em'}}>OU</span>
            <div style={{flex:1,height:1,background:'rgba(90,85,80,.35)'}}/>
          </div>

          <div>
            <span className="lbl lbl-light" style={{marginBottom:8}}>Entrar por código</span>
            <div style={{display:'flex',gap:8}}>
              <input className="inp" style={{flex:1,fontSize:'.95rem',padding:'.72rem .9rem',letterSpacing:'.2em',fontFamily:'Space Mono, monospace'}} placeholder="ABC 123" value={codeInput} onChange={e=>setCodeInput(e.target.value.toUpperCase())} maxLength={7} onKeyDown={e=>e.key==='Enter'&&go(false)}/>
              <button className="btn btn-teal" style={{padding:'.72rem 20px',fontSize:'.95rem'}} onClick={()=>go(false)}>→</button>
            </div>
          </div>

          <div style={{marginTop:'auto',background:'rgba(15,24,28,.6)',border:'1px solid rgba(90,85,80,.3)',borderRadius:14,padding:'16px 18px'}}>
            <div style={{fontSize:'.72rem',color:'var(--teal-l)',lineHeight:1.8}}>
              <div style={{color:'var(--gold)',fontWeight:900,fontSize:'.8rem',marginBottom:4}}>◆ Como funciona</div>
              <div>🗺 Mapa estratégico do Brasil</div>
              <div>🎲 Dado + perguntas de política</div>
              <div>🎭 Missões secretas por jogador</div>
              <div>👥 Até 4 jogadores por partida</div>
            </div>
          </div>
        </div>
      </div>

      {authMode&&<AuthOverlay mode={authMode} onSuccess={(name)=>{setUsername(name);setAuthMode(null);flash(`Bem-vindo, ${name}!`);}} onClose={()=>setAuthMode(null)} flash={flash}/>}
    </div>
  );
}

export default HomeScreen;

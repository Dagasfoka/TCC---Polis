import { useState } from 'react';
import Overlay from './Overlay.js';

function AuthOverlay({mode,onSuccess,onClose,flash}){
  const [tab,setTab]=useState(mode);
  const [email,setEmail]=useState('');
  const [senha,setSenha]=useState('');
  const [senha2,setSenha2]=useState('');
  const [name,setName]=useState('');
  const doLogin=()=>{if(!email||!senha){flash('Preencha e-mail e senha.');return;}onSuccess(name||email.split('@')[0]||'Jogador');};
  const doCad=()=>{if(!name||!email||!senha||!senha2){flash('Preencha todos os campos.');return;}if(senha!==senha2){flash('Senhas não coincidem.');return;}flash('Conta criada!');setTimeout(()=>onSuccess(name),600);};
  return(
    <Overlay onClose={onClose} cream>
      <div style={{display:'flex',justifyContent:'center',gap:6,marginBottom:16}}>
        {['login','cadastro'].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{fontFamily:'Nunito,sans-serif',fontSize:'.78rem',fontWeight:800,padding:'5px 16px',borderRadius:99,border:`1.5px solid ${tab===t?'var(--gold)':'var(--div-c)'}`,background:tab===t?'var(--gold)':'transparent',color:tab===t?'#fff':'#7a7068',cursor:'pointer',transition:'all .15s'}}>
            {t==='login'?'Login':'Cadastro'}
          </button>
        ))}
      </div>
      <div className="overlay-title dark">{tab==='login'?'Login':'Cadastro'}</div>
      {tab==='cadastro'&&<div className="field" style={{marginTop:12}}><label className="dark">Nome de usuário</label><input className="inp inp-cream" placeholder="Seu nome no jogo" value={name} onChange={e=>setName(e.target.value)} maxLength={20}/></div>}
      <div className="field"><label className="dark">E-mail</label><input className="inp inp-cream" type="email" placeholder="seu@email.com" value={email} onChange={e=>setEmail(e.target.value)}/></div>
      <div className="field"><label className="dark">Senha</label><input className="inp inp-cream" type="password" placeholder="••••••••" value={senha} onChange={e=>setSenha(e.target.value)} onKeyDown={e=>e.key==='Enter'&&(tab==='login'?doLogin():doCad())}/></div>
      {tab==='cadastro'&&<div className="field"><label className="dark">Repita a senha</label><input className="inp inp-cream" type="password" placeholder="••••••••" value={senha2} onChange={e=>setSenha2(e.target.value)} onKeyDown={e=>e.key==='Enter'&&doCad()}/></div>}
      <div style={{display:'flex',justifyContent:tab==='login'?'space-between':'flex-end',marginBottom:14}}>
        {tab==='login'&&<button style={{background:'none',border:'none',fontSize:'.72rem',fontWeight:700,color:'#8a7a6a',cursor:'pointer'}} onClick={()=>flash('Link enviado!')}>Esqueci a senha</button>}
        <button style={{background:'none',border:'none',fontSize:'.72rem',fontWeight:700,color:'#8a7a6a',cursor:'pointer'}} onClick={()=>setTab(tab==='login'?'cadastro':'login')}>{tab==='login'?'Não tem conta? Cadastra-se':'Já tem conta? Login'}</button>
      </div>
      <div className="btn-row">
        <button className="btn btn-cream" onClick={onClose}>Cancelar</button>
        <button className="btn btn-teal" style={{flex:2}} onClick={tab==='login'?doLogin:doCad}>{tab==='login'?'Entrar':'Criar conta'}</button>
      </div>
    </Overlay>
  );
}

export default AuthOverlay;
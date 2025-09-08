import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (password === 'mmgadmin') {
      // store in session so panel access persists during session
      sessionStorage.setItem('admin_authenticated', 'true');
      navigate('/admin/panel');
    } else {
      setError('Senha incorreta.');
    }
  }

  return (
    <div style={{background:'#fff', padding:20, borderRadius:8, maxWidth:420}}>
      <h2>Admin - Acesso</h2>
      <form onSubmit={handleSubmit} style={{display:'grid', gap:8}}>
        <input type='password' value={password} onChange={e=>setPassword(e.target.value)} placeholder='Senha' />
        <button type='submit'>Entrar</button>
        {error && <div style={{color:'red'}}>{error}</div>}
      </form>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';

function downloadCSV(rows) {
  if (!rows.length) return;
  const header = Object.keys(rows[0]);
  const csv = [
    header.join(','),
    ...rows.map(r => header.map(h => '"' + (r[h] ?? '') + '"').join(','))
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'candidates_export.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminPanel() {
  const [candidates, setCandidates] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [previewImg, setPreviewImg] = useState(null);
  const navigate = useNavigate();

  useEffect(()=> {
    const authed = sessionStorage.getItem('admin_authenticated') === 'true';
    if (!authed) navigate('/admin');
  }, [navigate]);

  useEffect(()=> {
    const q = query(collection(db, 'candidates'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, snap => {
      setCandidates(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  async function setStatus(id, status) {
    await updateDoc(doc(db, 'candidates', id), { status });
  }

  const filtered = candidates.filter(c => {
    if (filter !== 'All' && c.status !== filter) return false;
    if (!search) return true;
    const s = search.toLowerCase();
    return (c.fullName && c.fullName.toLowerCase().includes(s)) || (c.cpf && c.cpf.toLowerCase().includes(s));
  });

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12}}>
        <h1>Painel Admin</h1>
        <div>
          <button onClick={()=>{ sessionStorage.removeItem('admin_authenticated'); navigate('/'); }} style={{marginRight:8}}>Sair</button>
          <Link to='/'>Voltar ao formulário</Link>
        </div>
      </div>

      <div style={{display:'flex', gap:8, marginBottom:12}}>
        <select value={filter} onChange={e=>setFilter(e.target.value)}>
          <option value='All'>Todos</option>
          <option value='Backlog'>Backlog</option>
          <option value='Aprovado'>Aprovado</option>
          <option value='Rejeitado'>Rejeitado</option>
        </select>
        <input placeholder='Buscar por nome ou CPF' value={search} onChange={e=>setSearch(e.target.value)} style={{flex:1}} />
        <button onClick={()=> downloadCSV(filtered)}>Exportar CSV (visíveis)</button>
      </div>

      <table style={{width:'100%', borderCollapse:'collapse', background:'#fff'}}>
        <thead>
          <tr style={{textAlign:'left', borderBottom:'1px solid #eee'}}>
            <th style={{padding:8}}>Nome</th>
            <th>CPF</th>
            <th>Idade</th>
            <th>Status</th>
            <th>Documentos</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(c => (
            <tr key={c.id} style={{borderBottom:'1px solid #f0f0f0'}}>
              <td style={{padding:8}}>{c.fullName}</td>
              <td>{c.cpf}</td>
              <td>{c.age}</td>
              <td>{c.status}</td>
              <td>
                <div style={{display:'flex', gap:6}}>
                  {c.cpfImg && <img src={c.cpfImg} alt='cpf' style={{height:50, cursor:'pointer'}} onClick={()=>setPreviewImg(c.cpfImg)} />}
                  {c.rgImg && <img src={c.rgImg} alt='rg' style={{height:50, cursor:'pointer'}} onClick={()=>setPreviewImg(c.rgImg)} />}
                  {c.pisImg && <img src={c.pisImg} alt='pis' style={{height:50, cursor:'pointer'}} onClick={()=>setPreviewImg(c.pisImg)} />}
                </div>
              </td>
              <td>
                <div style={{display:'flex', gap:6}}>
                  <button onClick={()=>setStatus(c.id, 'Aprovado')}>Aprovar</button>
                  <button onClick={()=>setStatus(c.id, 'Rejeitado')}>Rejeitar</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {previewImg && (
        <div style={{position:'fixed', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.6)'}} onClick={()=>setPreviewImg(null)}>
          <img src={previewImg} alt='preview' style={{maxHeight:'90%', maxWidth:'90%', borderRadius:8, boxShadow:'0 8px 24px rgba(0,0,0,0.5)'}} />
        </div>
      )}
    </div>
  );
}

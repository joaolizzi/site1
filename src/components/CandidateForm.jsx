import React, { useState } from 'react';
import { addDoc, collection, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { Link } from 'react-router-dom';

// helper masks
function maskCPF(value) {
  return value
    .replace(/\D/g, '')
    .slice(0,11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
}
function maskPIS(value) {
  return value
    .replace(/\D/g, '')
    .slice(0,11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})\.(\d{5})(\d)/, '$1.$2.$3');
}

function calculateAge(birthOrAge) {
  // if number (age) return that
  const n = Number(birthOrAge);
  if (!isNaN(n) && String(birthOrAge).length <= 3) return n;
  // else try to parse date YYYY-MM-DD or dd/mm/yyyy
  const d = new Date(birthOrAge);
  if (!isNaN(d)) {
    const diff = Date.now() - d.getTime();
    const age = new Date(diff).getUTCFullYear() - 1970;
    return age;
  }
  return null;
}

export default function CandidateForm() {
  const [form, setForm] = useState({ fullName: '', age: '', cpf: '', rg: '', pis: '' });
  const [files, setFiles] = useState({ cpfImg: null, rgImg: null, pisImg: null });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    if (name === 'cpf') setForm(prev => ({ ...prev, cpf: maskCPF(value) }));
    else if (name === 'pis') setForm(prev => ({ ...prev, pis: maskPIS(value) }));
    else setForm(prev => ({ ...prev, [name]: value }));
  }
  function handleFile(e) {
    setFiles(prev => ({ ...prev, [e.target.name]: e.target.files[0] }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      if (!form.fullName) throw new Error('Preencha o nome completo.');
      if (!form.cpf || form.cpf.replace(/\D/g, '').length !== 11) throw new Error('CPF inválido.');
      const ageNum = Number(form.age);
      if (isNaN(ageNum) || ageNum < 18) throw new Error('Idade inválida. Deve ter pelo menos 18 anos.');

      const docRef = await addDoc(collection(db, 'candidates'), {
        fullName: form.fullName,
        age: ageNum,
        cpf: form.cpf,
        rg: form.rg || null,
        pis: form.pis || null,
        createdAt: serverTimestamp(),
        status: 'Backlog',
      });

      const uploads = {};
      for (const key of ['cpfImg', 'rgImg', 'pisImg']) {
        const file = files[key];
        if (!file) continue;
        const ext = file.name.split('.').pop();
        const storageRef = ref(storage, `candidates/${docRef.id}/${key}.${ext}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        uploads[key] = url;
      }

      if (Object.keys(uploads).length) {
        await updateDoc(doc(db, 'candidates', docRef.id), uploads);
      }

      setMessage('Enviado com sucesso!');
      setForm({ fullName: '', age: '', cpf: '', rg: '', pis: '' });
      setFiles({ cpfImg: null, rgImg: null, pisImg: null });
    } catch (err) {
      console.error(err);
      setMessage('Erro: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{background: '#fff', padding: 20, borderRadius: 8, boxShadow: '0 2px 6px rgba(0,0,0,0.06)'}}>
      <h1 style={{fontSize: 22, marginBottom: 12}}>Formulário de Candidatura</h1>
      <form onSubmit={handleSubmit}>
        <div style={{display:'grid', gap:10}}>
          <label>
            Nome completo<br/>
            <input name='fullName' value={form.fullName} onChange={handleChange} required style={{width:'100%', padding:8}} />
          </label>
          <div style={{display:'flex', gap:10}}>
            <label style={{flex:1}}>
              Idade<br/>
              <input name='age' type='number' value={form.age} onChange={handleChange} style={{width:'100%', padding:8}} required />
            </label>
            <label style={{flex:2}}>
              CPF<br/>
              <input name='cpf' value={form.cpf} onChange={handleChange} required style={{width:'100%', padding:8}} />
            </label>
          </div>
          <div style={{display:'flex', gap:10}}>
            <label style={{flex:1}}>
              RG<br/>
              <input name='rg' value={form.rg} onChange={handleChange} style={{width:'100%', padding:8}} />
            </label>
            <label style={{flex:1}}>
              PIS<br/>
              <input name='pis' value={form.pis} onChange={handleChange} style={{width:'100%', padding:8}} />
            </label>
          </div>
          <div style={{display:'flex', gap:10}}>
            <label>
              Foto do CPF<br/>
              <input type='file' name='cpfImg' accept='image/*' onChange={handleFile} />
            </label>
            <label>
              Foto do RG<br/>
              <input type='file' name='rgImg' accept='image/*' onChange={handleFile} />
            </label>
            <label>
              Foto do PIS<br/>
              <input type='file' name='pisImg' accept='image/*' onChange={handleFile} />
            </label>
          </div>

          <div style={{display:'flex', gap:10, alignItems:'center'}}>
            <button type='submit' disabled={loading} style={{padding:'8px 12px'}}> {loading ? 'Enviando...' : 'Enviar candidatura'} </button>
            <Link to='/admin' style={{color:'#555'}}>Acessar Admin</Link>
          </div>
          {message && <div style={{marginTop:8}}>{message}</div>}
        </div>
      </form>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, setDoc, doc, getDocs } from "firebase/firestore";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "C",
      authDomain: "meuprojeto-257f0.firebaseapp.com",
      projectId: "meuprojeto-257f0",
      storageBucket: "meuprojeto-257f0.appspot.com",
      messagingSenderId: "710773486236",
      appId: "1:710773486236:web:e9529bab7f7ec7c80bf359",
      measurementId: "G-05PKZ06N10"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

export default function CandidateForm() {
  const [candidatos, setCandidatos] = useState([]);
  const [formData, setFormData] = useState({
    nome: "",
    idade: "",
    telefone: "",
    cpf: "",
    cpfImg: null
  });

  // Lida com mudanças no formulário
  const handleChange = (e) => {
    if (e.target.name === "cpfImg") {
      setFormData({ ...formData, cpfImg: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  // Salvar candidato
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const candidateId = crypto.randomUUID();
      const fileRef = ref(storage, `candidates/${candidateId}/cpfImg.jpeg`);
      await uploadBytes(fileRef, formData.cpfImg);
      const downloadURL = await getDownloadURL(fileRef);

      await setDoc(doc(db, "candidates", candidateId), {
        nome: formData.nome,
        idade: formData.idade,
        telefone: formData.telefone,
        cpf: formData.cpf,
        cpfImgUrl: downloadURL,
        createdAt: new Date()
      });

      setFormData({
        nome: "",
        idade: "",
        telefone: "",
        cpf: "",
        cpfImg: null
      });

      listarCandidatos(); // atualiza lista
    } catch (error) {
      console.error("Erro ao salvar candidato:", error);
    }
  };

  // Listar candidatos
  const listarCandidatos = async () => {
    const querySnapshot = await getDocs(collection(db, "candidates"));
    const data = [];
    querySnapshot.forEach((docSnap) => {
      data.push({ id: docSnap.id, ...docSnap.data() });
    });
    setCandidatos(data);
  };

  useEffect(() => {
    listarCandidatos();
  }, []);

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input name="nome" placeholder="Nome" value={formData.nome} onChange={handleChange} required />
        <input name="idade" placeholder="Idade" value={formData.idade} onChange={handleChange} required />
        <input name="telefone" placeholder="Telefone" value={formData.telefone} onChange={handleChange} required />
        <input name="cpf" placeholder="CPF" value={formData.cpf} onChange={handleChange} required />
        <input type="file" name="cpfImg" onChange={handleChange} required />
        <button type="submit">Enviar</button>
      </form>

      <h2>Candidatos</h2>
      <div>
        {candidatos.map((c) => (
          <div key={c.id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
            <p><strong>Nome:</strong> {c.nome}</p>
            <p><strong>Idade:</strong> {c.idade}</p>
            <p><strong>Telefone:</strong> {c.telefone}</p>
            <p><strong>CPF:</strong> {c.cpf}</p>
            <img src={c.cpfImgUrl} alt="CPF" width="150" />
          </div>
        ))}
      </div>
    </div>
  );
}

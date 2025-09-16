import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';
import { validateFile } from '../utils/validation';
import { getErrorMessage, showNotification } from '../utils/errorHandler';
import { appConfig } from '../config';

export const useCandidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'candidates'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCandidates(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(getErrorMessage(err));
        setLoading(false);
        showNotification('Erro ao carregar candidatos', 'error');
      }
    );

    return () => unsubscribe();
  }, []);

  const addCandidate = async (candidateData) => {
    try {
      setLoading(true);
      
      // Validar todos os arquivos
      const filesToValidate = [
        { file: candidateData.cpfImg, name: 'CPF' },
        { file: candidateData.pisImg, name: 'PIS' },
        { file: candidateData.rgFrenteImg, name: 'RG Frente' },
        { file: candidateData.rgVersoImg, name: 'RG Verso' },
        { file: candidateData.enderecoImg, name: 'Endereço' }
      ];

      for (const { file, name } of filesToValidate) {
        const fileValidation = validateFile(file, appConfig.maxFileSize, appConfig.allowedFileTypes);
        if (!fileValidation.valid) {
          throw new Error(`${name}: ${fileValidation.error}`);
        }
      }

      const candidateId = crypto.randomUUID();
      
      // Upload de todos os arquivos
      const uploadPromises = [
        { file: candidateData.cpfImg, path: `candidates/${candidateId}/cpfImg.jpeg`, key: 'cpfImgUrl' },
        { file: candidateData.pisImg, path: `candidates/${candidateId}/pisImg.jpeg`, key: 'pisImgUrl' },
        { file: candidateData.rgFrenteImg, path: `candidates/${candidateId}/rgFrenteImg.jpeg`, key: 'rgFrenteImgUrl' },
        { file: candidateData.rgVersoImg, path: `candidates/${candidateId}/rgVersoImg.jpeg`, key: 'rgVersoImgUrl' },
        { file: candidateData.enderecoImg, path: `candidates/${candidateId}/enderecoImg.jpeg`, key: 'enderecoImgUrl' }
      ];

      const uploadResults = await Promise.all(
        uploadPromises.map(async ({ file, path, key }) => {
          const fileRef = ref(storage, path);
          await uploadBytes(fileRef, file);
          const downloadURL = await getDownloadURL(fileRef);
          return { key, url: downloadURL };
        })
      );

      // Criar objeto com URLs dos documentos
      const documentUrls = uploadResults.reduce((acc, { key, url }) => {
        acc[key] = url;
        return acc;
      }, {});

      await setDoc(doc(db, 'candidates', candidateId), {
        nome: candidateData.nome,
        idade: parseInt(candidateData.idade),
        telefone: candidateData.telefone,
        cpf: candidateData.cpf,
        ...documentUrls,
        status: 'Backlog',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Log da atividade
      await setDoc(doc(db, 'logs', 'candidate_logs', crypto.randomUUID()), {
        action: 'create',
        candidateId: candidateId,
        candidateName: candidateData.nome,
        timestamp: serverTimestamp(),
        userAgent: navigator.userAgent
      });

      // Backup automático
      await setDoc(doc(db, 'backup', 'candidates', candidateId), {
        nome: candidateData.nome,
        idade: parseInt(candidateData.idade),
        telefone: candidateData.telefone,
        cpf: candidateData.cpf,
        ...documentUrls,
        status: 'Backlog',
        createdAt: serverTimestamp(),
        backupAt: serverTimestamp()
      });

      showNotification('Candidato adicionado com sucesso!', 'success');
      return true;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
      showNotification(errorMessage, 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateCandidateStatus = async (candidateId, status) => {
    try {
      const candidate = candidates.find(c => c.id === candidateId);
      const oldStatus = candidate?.status || 'Backlog';
      
      await updateDoc(doc(db, 'candidates', candidateId), { 
        status,
        updatedAt: serverTimestamp()
      });

      // Log da atividade
      await setDoc(doc(db, 'logs', 'candidate_logs', crypto.randomUUID()), {
        action: 'status_update',
        candidateId: candidateId,
        candidateName: candidate?.nome || 'Desconhecido',
        oldStatus: oldStatus,
        newStatus: status,
        timestamp: serverTimestamp(),
        userAgent: navigator.userAgent
      });

      // Atualizar backup
      await setDoc(doc(db, 'backup', 'candidates', candidateId), {
        ...candidate,
        status: status,
        updatedAt: serverTimestamp(),
        backupAt: serverTimestamp()
      }, { merge: true });

      showNotification(`Status atualizado para ${status}`, 'success');
      return true;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showNotification(errorMessage, 'error');
      return false;
    }
  };

  const deleteCandidate = async (candidateId) => {
    try {
      const candidate = candidates.find(c => c.id === candidateId);
      if (!candidate) {
        throw new Error('Candidato não encontrado');
      }

      // Lista de arquivos para deletar
      const filesToDelete = [
        { url: candidate.cpfImgUrl, path: `candidates/${candidateId}/cpfImg.jpeg` },
        { url: candidate.pisImgUrl, path: `candidates/${candidateId}/pisImg.jpeg` },
        { url: candidate.rgFrenteImgUrl, path: `candidates/${candidateId}/rgFrenteImg.jpeg` },
        { url: candidate.rgVersoImgUrl, path: `candidates/${candidateId}/rgVersoImg.jpeg` },
        { url: candidate.enderecoImgUrl, path: `candidates/${candidateId}/enderecoImg.jpeg` }
      ].filter(file => file.url); // Apenas arquivos que existem

      // Deletar arquivos do storage
      const deletePromises = filesToDelete.map(async ({ path }) => {
        try {
          const fileRef = ref(storage, path);
          await deleteObject(fileRef);
        } catch (error) {
          console.warn(`Erro ao deletar arquivo ${path}:`, error);
          // Continua mesmo se um arquivo não for encontrado
        }
      });

      await Promise.all(deletePromises);

      // Deletar documento do Firestore
      await deleteDoc(doc(db, 'candidates', candidateId));

      // Deletar do backup
      await deleteDoc(doc(db, 'backup', 'candidates', candidateId));

      // Log da atividade
      await setDoc(doc(db, 'logs', 'candidate_logs', crypto.randomUUID()), {
        action: 'delete',
        candidateId: candidateId,
        candidateName: candidate.nome,
        timestamp: serverTimestamp(),
        userAgent: navigator.userAgent
      });

      showNotification(`Candidato ${candidate.nome} deletado com sucesso!`, 'success');
      return true;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showNotification(errorMessage, 'error');
      return false;
    }
  };

  return {
    candidates,
    loading,
    error,
    addCandidate,
    updateCandidateStatus,
    deleteCandidate
  };
};

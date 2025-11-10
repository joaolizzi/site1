import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCandidates } from '../hooks/useCandidates';
import { useAuth } from '../hooks/useAuth';
import SyncStatus from './SyncStatus';
import ConfirmModal from './ConfirmModal';
import * as XLSX from 'xlsx';

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

function downloadExcel(candidates) {
  if (!candidates.length) return;

  // Preparar dados para exportação
  const exportData = candidates.map(c => {
    // Formatar data se existir
    const formatDate = (timestamp) => {
      if (!timestamp) return '';
      if (timestamp.toDate) {
        // Firestore timestamp
        return timestamp.toDate().toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
      return '';
    };

    // Listar documentos disponíveis
    const documentos = [];
    if (c.cpfImgUrl) documentos.push('CPF');
    if (c.pisImgUrl) documentos.push('PIS');
    if (c.rgFrenteImgUrl) documentos.push('RG Frente');
    if (c.rgVersoImgUrl) documentos.push('RG Verso');
    if (c.enderecoImgUrl) documentos.push('Endereço');

    return {
      'Nome': c.nome || '',
      'CPF': c.cpf || '',
      'Idade': c.idade ? `${c.idade} anos` : '',
      'Telefone': c.telefone || '',
      'Cidade': c.cidade || 'Sem cidade',
      'Status': c.status || 'Backlog',
      'Documentos': documentos.join(', '),
      'Data de Cadastro': formatDate(c.createdAt),
      'Última Atualização': formatDate(c.updatedAt)
    };
  });

  // Criar workbook e worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(exportData);

  // Definir larguras das colunas
  const colWidths = [
    { wch: 30 }, // Nome
    { wch: 15 }, // CPF
    { wch: 10 }, // Idade
    { wch: 15 }, // Telefone
    { wch: 20 }, // Cidade
    { wch: 12 }, // Status
    { wch: 40 }, // Documentos
    { wch: 20 }, // Data de Cadastro
    { wch: 20 }  // Última Atualização
  ];
  ws['!cols'] = colWidths;

  // Formatar cabeçalhos
  const range = XLSX.utils.decode_range(ws['!ref']);
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
    if (!ws[cellAddress]) continue;
    
    // Estilizar cabeçalho
    ws[cellAddress].s = {
      font: { bold: true, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: '4472C4' } },
      alignment: { horizontal: 'center', vertical: 'center' },
      border: {
        top: { style: 'thin', color: { rgb: '000000' } },
        bottom: { style: 'thin', color: { rgb: '000000' } },
        left: { style: 'thin', color: { rgb: '000000' } },
        right: { style: 'thin', color: { rgb: '000000' } }
      }
    };
  }

  // Formatar células de dados
  for (let R = 1; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      if (!ws[cellAddress]) continue;
      
      // Alinhamento
      ws[cellAddress].s = {
        ...ws[cellAddress].s,
        alignment: { 
          horizontal: C === 0 || C === 4 || C === 5 ? 'left' : 'center',
          vertical: 'center',
          wrapText: C === 6 // Quebrar linha na coluna de documentos
        },
        border: {
          top: { style: 'thin', color: { rgb: 'E0E0E0' } },
          bottom: { style: 'thin', color: { rgb: 'E0E0E0' } },
          left: { style: 'thin', color: { rgb: 'E0E0E0' } },
          right: { style: 'thin', color: { rgb: 'E0E0E0' } }
        }
      };

      // Formatar coluna de Status com cores
      if (C === 5) {
        const status = ws[cellAddress].v;
        if (status === 'Aprovado') {
          ws[cellAddress].s.fill = { fgColor: { rgb: 'C6EFCE' } };
          ws[cellAddress].s.font = { color: { rgb: '006100' }, bold: true };
        } else if (status === 'Rejeitado') {
          ws[cellAddress].s.fill = { fgColor: { rgb: 'FFC7CE' } };
          ws[cellAddress].s.font = { color: { rgb: '9C0006' }, bold: true };
        } else {
          ws[cellAddress].s.fill = { fgColor: { rgb: 'FFEB9C' } };
          ws[cellAddress].s.font = { color: { rgb: '9C6500' }, bold: true };
        }
      }
    }

    // Alternar cores de linha para melhor legibilidade
    if (R % 2 === 0) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        if (ws[cellAddress] && C !== 5) { // Não aplicar na coluna de status
          ws[cellAddress].s = {
            ...ws[cellAddress].s,
            fill: { fgColor: { rgb: 'F2F2F2' } }
          };
        }
      }
    }
  }

  // Adicionar worksheet ao workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Candidatos');

  // Gerar nome do arquivo com data
  const date = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
  const fileName = `candidatos_${date}.xlsx`;

  // Exportar arquivo
  XLSX.writeFile(wb, fileName);
}

export default function AdminPanel() {
  const { candidates, loading, updateCandidateStatus, deleteCandidate } = useCandidates();
  const { requireAuth, logout } = useAuth();
  const [filter, setFilter] = useState('All');
  const [cityFilter, setCityFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [previewImg, setPreviewImg] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, candidate: null });
  const navigate = useNavigate();

  useEffect(() => {
    requireAuth();
  }, [requireAuth]);

  // Obter lista única de cidades para o filtro
  const uniqueCities = useMemo(() => {
    const cities = [...new Set(candidates.map(c => c.cidade).filter(Boolean))];
    return cities.sort();
  }, [candidates]);

  // Contar candidatos sem cidade
  const candidatesWithoutCity = useMemo(() => {
    return candidates.filter(c => !c.cidade).length;
  }, [candidates]);

  // Memoizar filtros para performance
  const filteredCandidates = useMemo(() => {
    return candidates.filter(c => {
      if (filter !== 'All' && c.status !== filter) return false;
      
      // Filtro por cidade
      if (cityFilter === 'SemCidade') {
        if (c.cidade) return false; // Se tem cidade, não incluir
      } else if (cityFilter !== 'All' && c.cidade !== cityFilter) {
        return false; // Se tem cidade específica selecionada e não é a mesma
      }
      
      if (!search) return true;
      const s = search.toLowerCase();
      return (c.nome && c.nome.toLowerCase().includes(s)) || 
             (c.cpf && c.cpf.toLowerCase().includes(s)) ||
             (c.cidade && c.cidade.toLowerCase().includes(s));
    });
  }, [candidates, filter, cityFilter, search]);

  const handleStatusChange = async (candidateId, status) => {
    await updateCandidateStatus(candidateId, status);
  };

  const handleDeleteClick = (candidate) => {
    setDeleteModal({ isOpen: true, candidate });
  };

  const handleDeleteConfirm = async () => {
    if (deleteModal.candidate) {
      await deleteCandidate(deleteModal.candidate.id);
      setDeleteModal({ isOpen: false, candidate: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, candidate: null });
  };

  if (loading) {
    return (
      <div className="admin-panel">
        <div className="loading">Carregando painel administrativo...</div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Painel Administrativo</h1>
        <div className="admin-actions">
          <SyncStatus />
          <button onClick={logout} className="logout-button">
            Sair
          </button>
          <Link to='/' className="back-link">
            Voltar ao formulário
          </Link>
        </div>
      </div>

      <div className="admin-controls">
        <div className="filter-group">
          <label htmlFor="status-filter">Filtrar por status:</label>
          <select 
            id="status-filter"
            value={filter} 
            onChange={e => setFilter(e.target.value)}
            aria-label="Filtrar candidatos por status"
          >
            <option value='All'>Todos</option>
            <option value='Backlog'>Backlog</option>
            <option value='Aprovado'>Aprovado</option>
            <option value='Rejeitado'>Rejeitado</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="city-filter">Filtrar por cidade:</label>
          <select 
            id="city-filter"
            value={cityFilter} 
            onChange={e => setCityFilter(e.target.value)}
            aria-label="Filtrar candidatos por cidade"
          >
            <option value='All'>Todas as cidades ({candidates.length})</option>
            {candidatesWithoutCity > 0 && (
              <option value='SemCidade'>Sem cidade cadastrada ({candidatesWithoutCity})</option>
            )}
            {uniqueCities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
        
        <div className="search-group">
          <label htmlFor="search-input">Buscar:</label>
          <input 
            id="search-input"
            type="text"
            placeholder='Buscar por nome, CPF ou cidade' 
            value={search} 
            onChange={e => setSearch(e.target.value)}
            aria-label="Buscar candidatos"
          />
        </div>
        
        <div className="export-buttons">
          <button 
            onClick={() => downloadCSV(filteredCandidates)}
            className="export-button export-csv"
            disabled={filteredCandidates.length === 0}
            title="Exportar para CSV"
          >
            Exportar CSV ({filteredCandidates.length})
          </button>
          <button 
            onClick={() => downloadExcel(filteredCandidates)}
            className="export-button export-excel"
            disabled={filteredCandidates.length === 0}
            title="Exportar para Excel com formatação"
          >
            Exportar Excel ({filteredCandidates.length})
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="candidates-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Idade</th>
              <th>Telefone</th>
              <th>Cidade</th>
              <th>Status</th>
              <th>Documentos</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredCandidates.map(c => (
              <tr key={c.id}>
                <td className="candidate-name">{c.nome}</td>
                <td>{c.cpf}</td>
                <td>{c.idade} anos</td>
                <td>{c.telefone}</td>
                <td className="candidate-city">
                  {c.cidade ? (
                    <span className="city-name">{c.cidade}</span>
                  ) : (
                    <span className="no-city" title="Candidato cadastrado antes da implementação do campo cidade">
                      Sem cidade
                    </span>
                  )}
                </td>
                <td>
                  <span className={`status status-${c.status?.toLowerCase() || 'backlog'}`}>
                    {c.status || 'Backlog'}
                  </span>
                </td>
                <td>
                  <div className="documents">
                    {c.cpfImgUrl && (
                      <img 
                        src={c.cpfImgUrl} 
                        alt='CPF' 
                        className="document-thumb"
                        onClick={() => setPreviewImg(c.cpfImgUrl)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            setPreviewImg(c.cpfImgUrl);
                          }
                        }}
                        title="CPF"
                      />
                    )}
                    {c.pisImgUrl && (
                      <img 
                        src={c.pisImgUrl} 
                        alt='PIS' 
                        className="document-thumb"
                        onClick={() => setPreviewImg(c.pisImgUrl)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            setPreviewImg(c.pisImgUrl);
                          }
                        }}
                        title="PIS"
                      />
                    )}
                    {c.rgFrenteImgUrl && (
                      <img 
                        src={c.rgFrenteImgUrl} 
                        alt='RG Frente' 
                        className="document-thumb"
                        onClick={() => setPreviewImg(c.rgFrenteImgUrl)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            setPreviewImg(c.rgFrenteImgUrl);
                          }
                        }}
                        title="RG Frente"
                      />
                    )}
                    {c.rgVersoImgUrl && (
                      <img 
                        src={c.rgVersoImgUrl} 
                        alt='RG Verso' 
                        className="document-thumb"
                        onClick={() => setPreviewImg(c.rgVersoImgUrl)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            setPreviewImg(c.rgVersoImgUrl);
                          }
                        }}
                        title="RG Verso"
                      />
                    )}
                    {c.enderecoImgUrl && (
                      <img 
                        src={c.enderecoImgUrl} 
                        alt='Endereço' 
                        className="document-thumb"
                        onClick={() => setPreviewImg(c.enderecoImgUrl)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            setPreviewImg(c.enderecoImgUrl);
                          }
                        }}
                        title="Comprovante de Endereço"
                      />
                    )}
                  </div>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      onClick={() => handleStatusChange(c.id, 'Aprovado')}
                      className="approve-button"
                      disabled={c.status === 'Aprovado'}
                    >
                      Aprovar
                    </button>
                    <button 
                      onClick={() => handleStatusChange(c.id, 'Rejeitado')}
                      className="reject-button"
                      disabled={c.status === 'Rejeitado'}
                    >
                      Rejeitar
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(c)}
                      className="delete-button"
                      title="Deletar candidato"
                    >
                      Deletar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredCandidates.length === 0 && (
          <div className="no-results">
            {search || filter !== 'All' || cityFilter !== 'All'
              ? 'Nenhum candidato encontrado com os filtros aplicados.' 
              : 'Nenhum candidato cadastrado ainda.'
            }
          </div>
        )}
      </div>

      {previewImg && (
        <div 
          className="modal-overlay" 
          onClick={() => setPreviewImg(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Visualizar documento"
        >
          <div className="modal-content">
            <img 
              src={previewImg} 
              alt='Documento' 
              className="preview-image"
            />
            <button 
              className="close-modal"
              onClick={() => setPreviewImg(null)}
              aria-label="Fechar visualização"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja deletar o candidato "${deleteModal.candidate?.nome}"? Esta ação não pode ser desfeita e todos os documentos serão removidos permanentemente.`}
        confirmText="Deletar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
}

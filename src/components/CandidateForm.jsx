import React, { useState } from "react";
import { useCandidates } from "../hooks/useCandidates";
import { validateCPF, validatePhone, formatPhone, formatCPF } from "../utils/validation";

export default function CandidateForm() {
  const { addCandidate } = useCandidates();
  const [formData, setFormData] = useState({
    nome: "",
    idade: "",
    telefone: "",
    cpf: "",
    cpfImg: null,
    pisImg: null,
    rgFrenteImg: null,
    rgVersoImg: null,
    enderecoImg: null
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validação em tempo real
  const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'nome':
        if (!value.trim()) {
          newErrors.nome = 'Nome é obrigatório';
        } else if (value.trim().length < 2) {
          newErrors.nome = 'Nome deve ter pelo menos 2 caracteres';
        } else {
          delete newErrors.nome;
        }
        break;
      case 'idade':
        const age = parseInt(value);
        if (!value) {
          newErrors.idade = 'Idade é obrigatória';
        } else if (isNaN(age) || age < 18 || age > 100) {
          newErrors.idade = 'Idade deve ser entre 18 e 100 anos';
        } else {
          delete newErrors.idade;
        }
        break;
      case 'telefone':
        if (!value) {
          newErrors.telefone = 'Telefone é obrigatório';
        } else if (!validatePhone(value)) {
          newErrors.telefone = 'Formato de telefone inválido';
        } else {
          delete newErrors.telefone;
        }
        break;
      case 'cpf':
        if (!value) {
          newErrors.cpf = 'CPF é obrigatório';
        } else if (!validateCPF(value)) {
          newErrors.cpf = 'CPF inválido';
        } else {
          delete newErrors.cpf;
        }
        break;
      case 'pisImg':
      case 'rgFrenteImg':
      case 'rgVersoImg':
      case 'enderecoImg':
        if (!value) {
          newErrors[name] = 'Documento é obrigatório';
        } else {
          const fileValidation = validateFile(value, 5 * 1024 * 1024, ['image/jpeg', 'image/png', 'image/jpg']);
          if (!fileValidation.valid) {
            newErrors[name] = fileValidation.error;
          } else {
            delete newErrors[name];
          }
        }
        break;
    }
    
    setErrors(newErrors);
  };

  // Lida com mudanças no formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "cpfImg" || name === "pisImg" || name === "rgFrenteImg" || name === "rgVersoImg" || name === "enderecoImg") {
      setFormData({ ...formData, [name]: e.target.files[0] });
      // Validar arquivo
      const fileValidation = validateFile(e.target.files[0], 5 * 1024 * 1024, ['image/jpeg', 'image/png', 'image/jpg']);
      if (!fileValidation.valid) {
        setErrors({ ...errors, [name]: fileValidation.error });
      } else {
        const newErrors = { ...errors };
        delete newErrors[name];
        setErrors(newErrors);
      }
    } else {
      let formattedValue = value;
      
      // Formatação automática
      if (name === 'telefone') {
        formattedValue = formatPhone(value);
      } else if (name === 'cpf') {
        formattedValue = formatCPF(value);
      }
      
      setFormData({ ...formData, [name]: formattedValue });
      validateField(name, formattedValue);
    }
  };

  // Salvar candidato
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar todos os campos
    const hasErrors = Object.keys(errors).length > 0;
    if (hasErrors) {
      return;
    }

    setIsSubmitting(true);
    const success = await addCandidate(formData);
    
    if (success) {
      setFormData({
        nome: "",
        idade: "",
        telefone: "",
        cpf: "",
        cpfImg: null,
        pisImg: null,
        rgFrenteImg: null,
        rgVersoImg: null,
        enderecoImg: null
      });
      setErrors({});
    }
    
    setIsSubmitting(false);
  };


  return (
    <div className="form-container-single">
      <div className="card">
        <h1>Formulário de Candidato</h1>
        <form onSubmit={handleSubmit} className="candidate-form">
          <div className="form-group">
            <label htmlFor="nome">Nome Completo *</label>
            <input
              id="nome"
              name="nome"
              type="text"
              placeholder="Digite seu nome completo"
              value={formData.nome}
              onChange={handleChange}
              required
              aria-describedby={errors.nome ? "nome-error" : undefined}
              className={errors.nome ? "error" : ""}
            />
            {errors.nome && <span id="nome-error" className="error-message">{errors.nome}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="idade">Idade *</label>
            <input
              id="idade"
              name="idade"
              type="number"
              placeholder="Digite sua idade"
              value={formData.idade}
              onChange={handleChange}
              min="16"
              max="100"
              required
              aria-describedby={errors.idade ? "idade-error" : undefined}
              className={errors.idade ? "error" : ""}
            />
            {errors.idade && <span id="idade-error" className="error-message">{errors.idade}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="telefone">Telefone *</label>
            <input
              id="telefone"
              name="telefone"
              type="tel"
              placeholder="(11) 99999-9999"
              value={formData.telefone}
              onChange={handleChange}
              required
              aria-describedby={errors.telefone ? "telefone-error" : undefined}
              className={errors.telefone ? "error" : ""}
            />
            {errors.telefone && <span id="telefone-error" className="error-message">{errors.telefone}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="cpf">CPF *</label>
            <input
              id="cpf"
              name="cpf"
              type="text"
              placeholder="000.000.000-00"
              value={formData.cpf}
              onChange={handleChange}
              required
              aria-describedby={errors.cpf ? "cpf-error" : undefined}
              className={errors.cpf ? "error" : ""}
            />
            {errors.cpf && <span id="cpf-error" className="error-message">{errors.cpf}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="cpfImg">Foto do CPF *</label>
            <input
              id="cpfImg"
              name="cpfImg"
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleChange}
              required
              className={`file-input ${errors.cpfImg ? "error" : ""}`}
              aria-describedby={errors.cpfImg ? "cpfImg-error" : undefined}
            />
            {errors.cpfImg && <span id="cpfImg-error" className="error-message">{errors.cpfImg}</span>}
            <small className="file-help">Formatos aceitos: JPG, PNG. Máximo 5MB.</small>
          </div>

          <div className="form-group">
            <label htmlFor="pisImg">Foto do PIS *</label>
            <input
              id="pisImg"
              name="pisImg"
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleChange}
              required
              className={`file-input ${errors.pisImg ? "error" : ""}`}
              aria-describedby={errors.pisImg ? "pisImg-error" : undefined}
            />
            {errors.pisImg && <span id="pisImg-error" className="error-message">{errors.pisImg}</span>}
            <small className="file-help">Formatos aceitos: JPG, PNG. Máximo 5MB.</small>
          </div>

          <div className="form-group">
            <label htmlFor="rgFrenteImg">Foto do RG (Frente) *</label>
            <input
              id="rgFrenteImg"
              name="rgFrenteImg"
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleChange}
              required
              className={`file-input ${errors.rgFrenteImg ? "error" : ""}`}
              aria-describedby={errors.rgFrenteImg ? "rgFrenteImg-error" : undefined}
            />
            {errors.rgFrenteImg && <span id="rgFrenteImg-error" className="error-message">{errors.rgFrenteImg}</span>}
            <small className="file-help">Formatos aceitos: JPG, PNG. Máximo 5MB.</small>
          </div>

          <div className="form-group">
            <label htmlFor="rgVersoImg">Foto do RG (Verso) *</label>
            <input
              id="rgVersoImg"
              name="rgVersoImg"
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleChange}
              required
              className={`file-input ${errors.rgVersoImg ? "error" : ""}`}
              aria-describedby={errors.rgVersoImg ? "rgVersoImg-error" : undefined}
            />
            {errors.rgVersoImg && <span id="rgVersoImg-error" className="error-message">{errors.rgVersoImg}</span>}
            <small className="file-help">Formatos aceitos: JPG, PNG. Máximo 5MB.</small>
          </div>

          <div className="form-group">
            <label htmlFor="enderecoImg">Foto do Comprovante de Endereço *</label>
            <input
              id="enderecoImg"
              name="enderecoImg"
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleChange}
              required
              className={`file-input ${errors.enderecoImg ? "error" : ""}`}
              aria-describedby={errors.enderecoImg ? "enderecoImg-error" : undefined}
            />
            {errors.enderecoImg && <span id="enderecoImg-error" className="error-message">{errors.enderecoImg}</span>}
            <small className="file-help">Formatos aceitos: JPG, PNG. Máximo 5MB.</small>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting || Object.keys(errors).length > 0}
            className="submit-button"
            aria-describedby="submit-help"
          >
            {isSubmitting ? "Enviando..." : "Enviar Candidatura"}
          </button>
          <div id="submit-help" className="submit-help">
            {Object.keys(errors).length > 0 && "Corrija os erros acima para continuar"}
          </div>
        </form>
      </div>

    </div>
  );
}

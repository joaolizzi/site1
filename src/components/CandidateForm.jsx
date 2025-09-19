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
    cidade: "",
    cpfImg: null,
    pisImg: null,
    rgFrenteImg: null,
    rgVersoImg: null,
    enderecoImg: null,
    aceiteLGPD: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cidadeSearch, setCidadeSearch] = useState("");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showLGPDInfo, setShowLGPDInfo] = useState(false);

  // Lista completa de cidades brasileiras (incluindo todas as cidades do Paraná)
  const cidadesBrasileiras = [
    // Principais capitais e cidades grandes
    "São Paulo - SP",
    "Rio de Janeiro - RJ",
    "Belo Horizonte - MG",
    "Salvador - BA",
    "Brasília - DF",
    "Fortaleza - CE",
    "Manaus - AM",
    "Curitiba - PR",
    "Recife - PE",
    "Goiânia - GO",
    "Belém - PA",
    "Porto Alegre - RS",
    "Guarulhos - SP",
    "Campinas - SP",
    "São Luís - MA",
    "São Gonçalo - RJ",
    "Maceió - AL",
    "Duque de Caxias - RJ",
    "Natal - RN",
    "Teresina - PI",
    "Campo Grande - MS",
    "Nova Iguaçu - RJ",
    "São Bernardo do Campo - SP",
    "João Pessoa - PB",
    "Santo André - SP",
    "Osasco - SP",
    "Jaboatão dos Guararapes - PE",
    "São José dos Campos - SP",
    "Ribeirão Preto - SP",
    "Uberlândia - MG",
    "Sorocaba - SP",
    "Contagem - MG",
    "Aracaju - SE",
    "Feira de Santana - BA",
    "Cuiabá - MT",
    "Joinville - SC",
    "Aparecida de Goiânia - GO",
    "Londrina - PR",
    "Ananindeua - PA",
    "Serra - ES",
    "Niterói - RJ",
    "Caxias do Sul - RS",
    "Campos dos Goytacazes - RJ",
    "Vila Velha - ES",
    "Florianópolis - SC",
    "Macapá - AP",
    "Diadema - SP",
    "São João de Meriti - RJ",
    "Mauá - SP",
    "São Vicente - SP",
    "Jundiaí - SP",
    "Betim - MG",
    "Canoas - RS",
    "Carapicuíba - SP",
    "Mogi das Cruzes - SP",
    "Piracicaba - SP",
    "Bauru - SP",
    "Montes Claros - MG",
    "Cariacica - ES",
    "Itaquaquecetuba - SP",
    "São Caetano do Sul - SP",
    "Blumenau - SC",
    "Ribeirão das Neves - MG",
    "Volta Redonda - RJ",
    "Petrolina - PE",
    "Uberaba - MG",
    "Paulista - PE",
    "Cascavel - PR",
    "Praia Grande - SP",
    "São José do Rio Preto - SP",
    "Guarujá - SP",
    "Taubaté - SP",
    "Embu das Artes - SP",
    "Limeira - SP",
    "Camaçari - BA",
    "Petrópolis - RJ",
    "Suzano - SP",
    "Taboão da Serra - SP",
    "Várzea Grande - MT",
    "Barueri - SP",
    "Viamão - RS",
    "Pindamonhangaba - SP",
    "Cabo Frio - RJ",
    "Araçatuba - SP",
    "Rio Branco - AC",
    "Boa Vista - RR",
    "Palmas - TO",
    "Vitória - ES",
    "Caucaia - CE",
    "Itabuna - BA",
    "Foz do Iguaçu - PR",
    "Franca - SP",
    "Americana - SP",
    "Santa Maria - RS",
    "Guarapuava - PR",
    "Caruaru - PE",
    "Mossoró - RN",
    "Rondonópolis - MT",
    "Jacareí - SP",
    "Arapiraca - AL",
    "Tatuí - SP",
    "Parnamirim - RN",
    "Marília - SP",
    "Anápolis - GO",
    "Itu - SP",
    "Cabo de Santo Agostinho - PE",
    "Rio Claro - SP",
    "Poços de Caldas - MG",
    "Patos de Minas - MG",
    
    // TODAS AS CIDADES DO PARANÁ
    "Abatiá - PR",
    "Adrianópolis - PR",
    "Agudos do Sul - PR",
    "Almirante Tamandaré - PR",
    "Altamira do Paraná - PR",
    "Alto Paraíso - PR",
    "Alto Paraná - PR",
    "Alto Piquiri - PR",
    "Altônia - PR",
    "Amaporã - PR",
    "Ampére - PR",
    "Anahy - PR",
    "Andirá - PR",
    "Ângulo - PR",
    "Antonina - PR",
    "Antônio Olinto - PR",
    "Apucarana - PR",
    "Arapongas - PR",
    "Arapoti - PR",
    "Arapuã - PR",
    "Araruna - PR",
    "Araucária - PR",
    "Ariranha do Ivaí - PR",
    "Assaí - PR",
    "Assis Chateaubriand - PR",
    "Astorga - PR",
    "Atalaia - PR",
    "Balsa Nova - PR",
    "Bandeirantes - PR",
    "Barbosa Ferraz - PR",
    "Barra do Jacaré - PR",
    "Barracão - PR",
    "Bela Vista da Caroba - PR",
    "Bela Vista do Paraíso - PR",
    "Bituruna - PR",
    "Boa Esperança - PR",
    "Boa Esperança do Iguaçu - PR",
    "Boa Ventura de São Roque - PR",
    "Boa Vista da Aparecida - PR",
    "Bocaiúva do Sul - PR",
    "Bom Jesus do Sul - PR",
    "Bom Sucesso - PR",
    "Bom Sucesso do Sul - PR",
    "Borrazópolis - PR",
    "Braganey - PR",
    "Brasilândia do Sul - PR",
    "Cafeara - PR",
    "Cafelândia - PR",
    "Cafezal do Sul - PR",
    "Cafezal do Sul - PR",
    "Califórnia - PR",
    "Cambará - PR",
    "Cambé - PR",
    "Cambira - PR",
    "Campina da Lagoa - PR",
    "Campina do Simão - PR",
    "Campina Grande do Sul - PR",
    "Campo Bonito - PR",
    "Campo do Tenente - PR",
    "Campo Largo - PR",
    "Campo Magro - PR",
    "Campo Mourão - PR",
    "Cândido de Abreu - PR",
    "Candói - PR",
    "Cantagalo - PR",
    "Capanema - PR",
    "Capitão Leônidas Marques - PR",
    "Carambeí - PR",
    "Carlópolis - PR",
    "Cascavel - PR",
    "Castro - PR",
    "Catanduvas - PR",
    "Centenário do Sul - PR",
    "Cerro Azul - PR",
    "Céu Azul - PR",
    "Chopinzinho - PR",
    "Cianorte - PR",
    "Cidade Gaúcha - PR",
    "Clevelândia - PR",
    "Colombo - PR",
    "Colorado - PR",
    "Congonhinhas - PR",
    "Conselheiro Mairinck - PR",
    "Contenda - PR",
    "Corbélia - PR",
    "Cornélio Procópio - PR",
    "Coronel Domingos Soares - PR",
    "Coronel Vivida - PR",
    "Corumbataí do Sul - PR",
    "Cruz Machado - PR",
    "Cruzeiro do Iguaçu - PR",
    "Cruzeiro do Oeste - PR",
    "Cruzeiro do Sul - PR",
    "Cruzmaltina - PR",
    "Curitiba - PR",
    "Curiúva - PR",
    "Diamante do Norte - PR",
    "Diamante do Sul - PR",
    "Diamante D'Oeste - PR",
    "Dois Vizinhos - PR",
    "Douradina - PR",
    "Doutor Camargo - PR",
    "Enéas Marques - PR",
    "Engenheiro Beltrão - PR",
    "Entre Rios do Oeste - PR",
    "Esperança Nova - PR",
    "Espigão Alto do Iguaçu - PR",
    "Farol - PR",
    "Faxinal - PR",
    "Fazenda Rio Grande - PR",
    "Fênix - PR",
    "Fernandes Pinheiro - PR",
    "Figueira - PR",
    "Flor da Serra do Sul - PR",
    "Floraí - PR",
    "Floresta - PR",
    "Florestópolis - PR",
    "Flórida - PR",
    "Formosa do Oeste - PR",
    "Foz do Iguaçu - PR",
    "Foz do Jordão - PR",
    "Francisco Alves - PR",
    "Francisco Beltrão - PR",
    "General Carneiro - PR",
    "Godoy Moreira - PR",
    "Goioerê - PR",
    "Goioxim - PR",
    "Grandes Rios - PR",
    "Guaíra - PR",
    "Guamiranga - PR",
    "Guapirama - PR",
    "Guaporema - PR",
    "Guaraci - PR",
    "Guaraniaçu - PR",
    "Guarapuava - PR",
    "Guaraqueçaba - PR",
    "Guaratuba - PR",
    "Honório Serpa - PR",
    "Ibaiti - PR",
    "Ibema - PR",
    "Ibiporã - PR",
    "Icaraíma - PR",
    "Iguaraçu - PR",
    "Iguatu - PR",
    "Imbaú - PR",
    "Imbituva - PR",
    "Inácio Martins - PR",
    "Inajá - PR",
    "Indianópolis - PR",
    "Ipiranga - PR",
    "Iporã - PR",
    "Iracema do Oeste - PR",
    "Irati - PR",
    "Iretama - PR",
    "Itaguajé - PR",
    "Itaipulândia - PR",
    "Itambaracá - PR",
    "Itambé - PR",
    "Itapejara d'Oeste - PR",
    "Itaperuçu - PR",
    "Itaúna do Sul - PR",
    "Ivaí - PR",
    "Ivaiporã - PR",
    "Ivaté - PR",
    "Ivatuba - PR",
    "Jaboti - PR",
    "Jacarezinho - PR",
    "Jaguapitã - PR",
    "Jaguariaíva - PR",
    "Jandaia do Sul - PR",
    "Janiópolis - PR",
    "Japira - PR",
    "Japurá - PR",
    "Jardim Alegre - PR",
    "Jardim Olinda - PR",
    "Jataizinho - PR",
    "Jesuítas - PR",
    "Joaquim Távora - PR",
    "Jundiaí do Sul - PR",
    "Juranda - PR",
    "Jussara - PR",
    "Kaloré - PR",
    "Lapa - PR",
    "Laranjal - PR",
    "Laranjeiras do Sul - PR",
    "Leópolis - PR",
    "Lidianópolis - PR",
    "Lindoeste - PR",
    "Loanda - PR",
    "Lobato - PR",
    "Londrina - PR",
    "Luiziana - PR",
    "Lunardelli - PR",
    "Lupionópolis - PR",
    "Mallet - PR",
    "Mamborê - PR",
    "Mandaguaçu - PR",
    "Mandaguari - PR",
    "Mandirituba - PR",
    "Manfrinópolis - PR",
    "Mangueirinha - PR",
    "Manoel Ribas - PR",
    "Marechal Cândido Rondon - PR",
    "Maria Helena - PR",
    "Marialva - PR",
    "Marilândia do Sul - PR",
    "Marilena - PR",
    "Mariluz - PR",
    "Maringá - PR",
    "Mariópolis - PR",
    "Maripá - PR",
    "Marmeleiro - PR",
    "Marquinho - PR",
    "Marumbi - PR",
    "Matelândia - PR",
    "Matinhos - PR",
    "Mato Rico - PR",
    "Mauá da Serra - PR",
    "Medianeira - PR",
    "Mercedes - PR",
    "Mirador - PR",
    "Miraselva - PR",
    "Missal - PR",
    "Moreira Sales - PR",
    "Morretes - PR",
    "Munhoz de Melo - PR",
    "Nossa Senhora das Graças - PR",
    "Nova Aliança do Ivaí - PR",
    "Nova América da Colina - PR",
    "Nova Aurora - PR",
    "Nova Cantu - PR",
    "Nova Esperança - PR",
    "Nova Esperança do Sudoeste - PR",
    "Nova Fátima - PR",
    "Nova Laranjeiras - PR",
    "Nova Londrina - PR",
    "Nova Olímpia - PR",
    "Nova Prata do Iguaçu - PR",
    "Nova Santa Bárbara - PR",
    "Nova Santa Rosa - PR",
    "Nova Tebas - PR",
    "Novo Itacolomi - PR",
    "Ortigueira - PR",
    "Ourizona - PR",
    "Ouro Verde do Oeste - PR",
    "Paiçandu - PR",
    "Palmas - PR",
    "Palmeira - PR",
    "Palmital - PR",
    "Palotina - PR",
    "Paraíso do Norte - PR",
    "Paranacity - PR",
    "Paranaguá - PR",
    "Paranapoema - PR",
    "Paranavaí - PR",
    "Pato Bragado - PR",
    "Pato Branco - PR",
    "Paula Freitas - PR",
    "Paulo Frontin - PR",
    "Peabiru - PR",
    "Perobal - PR",
    "Pérola - PR",
    "Pérola d'Oeste - PR",
    "Piên - PR",
    "Pinhais - PR",
    "Pinhal de São Bento - PR",
    "Pinhalão - PR",
    "Pinhão - PR",
    "Piraí do Sul - PR",
    "Piraquara - PR",
    "Pitanga - PR",
    "Pitangueiras - PR",
    "Planaltina do Paraná - PR",
    "Planalto - PR",
    "Ponta Grossa - PR",
    "Pontal do Paraná - PR",
    "Porecatu - PR",
    "Porto Amazonas - PR",
    "Porto Barreiro - PR",
    "Porto Rico - PR",
    "Porto Vitória - PR",
    "Prado Ferreira - PR",
    "Pranchita - PR",
    "Presidente Castelo Branco - PR",
    "Primeiro de Maio - PR",
    "Prudentópolis - PR",
    "Quarto Centenário - PR",
    "Quatiguá - PR",
    "Quatro Barras - PR",
    "Quatro Pontes - PR",
    "Quedas do Iguaçu - PR",
    "Querência do Norte - PR",
    "Quinta do Sol - PR",
    "Quitandinha - PR",
    "Ramilândia - PR",
    "Rancho Alegre - PR",
    "Rancho Alegre D'Oeste - PR",
    "Realeza - PR",
    "Rebouças - PR",
    "Renascença - PR",
    "Reserva - PR",
    "Reserva do Iguaçu - PR",
    "Ribeirão Claro - PR",
    "Ribeirão do Pinhal - PR",
    "Rio Azul - PR",
    "Rio Bom - PR",
    "Rio Branco do Ivaí - PR",
    "Rio Branco do Sul - PR",
    "Rio Negro - PR",
    "Rolândia - PR",
    "Roncador - PR",
    "Rondon - PR",
    "Rosário do Ivaí - PR",
    "Sabáudia - PR",
    "Salgado Filho - PR",
    "Salto do Itararé - PR",
    "Salto do Lontra - PR",
    "Santa Amélia - PR",
    "Santa Cecília do Pavão - PR",
    "Santa Cruz de Monte Castelo - PR",
    "Santa Fé - PR",
    "Santa Helena - PR",
    "Santa Inês - PR",
    "Santa Isabel do Ivaí - PR",
    "Santa Izabel do Oeste - PR",
    "Santa Lúcia - PR",
    "Santa Maria do Oeste - PR",
    "Santa Mariana - PR",
    "Santa Mônica - PR",
    "Santa Tereza do Oeste - PR",
    "Santa Terezinha de Itaipu - PR",
    "Santana do Itararé - PR",
    "Santo Antônio da Platina - PR",
    "Santo Antônio do Caiuá - PR",
    "Santo Antônio do Paraíso - PR",
    "Santo Antônio do Sudoeste - PR",
    "Santo Inácio - PR",
    "São Carlos do Ivaí - PR",
    "São Jerônimo da Serra - PR",
    "São João - PR",
    "São João do Caiuá - PR",
    "São João do Ivaí - PR",
    "São João do Triunfo - PR",
    "São Jorge d'Oeste - PR",
    "São Jorge do Ivaí - PR",
    "São Jorge do Patrocínio - PR",
    "São José da Boa Vista - PR",
    "São José das Palmeiras - PR",
    "São José dos Pinhais - PR",
    "São Manoel do Paraná - PR",
    "São Mateus do Sul - PR",
    "São Miguel do Iguaçu - PR",
    "São Pedro do Iguaçu - PR",
    "São Pedro do Ivaí - PR",
    "São Pedro do Paraná - PR",
    "São Sebastião da Amoreira - PR",
    "São Tomé - PR",
    "Sapopema - PR",
    "Sarandi - PR",
    "Sengés - PR",
    "Serranópolis do Iguaçu - PR",
    "Sertaneja - PR",
    "Sertanópolis - PR",
    "Siqueira Campos - PR",
    "Sulina - PR",
    "Tamarana - PR",
    "Tamboara - PR",
    "Tapejara - PR",
    "Tapira - PR",
    "Teixeira Soares - PR",
    "Telêmaco Borba - PR",
    "Terra Boa - PR",
    "Terra Rica - PR",
    "Terra Roxa - PR",
    "Tibagi - PR",
    "Tijucas do Sul - PR",
    "Toledo - PR",
    "Tomazina - PR",
    "Três Barras do Paraná - PR",
    "Tunas do Paraná - PR",
    "Tuneiras do Oeste - PR",
    "Tupãssi - PR",
    "Turvo - PR",
    "Ubiratã - PR",
    "Umuarama - PR",
    "União da Vitória - PR",
    "Uniflor - PR",
    "Uraí - PR",
    "Ventania - PR",
    "Vera Cruz do Oeste - PR",
    "Verê - PR",
    "Virmond - PR",
    "Vitorino - PR",
    "Wenceslau Braz - PR",
    "Xambrê - PR"
  ];

  // Filtrar cidades baseado na pesquisa
  const cidadesFiltradas = cidadesBrasileiras.filter(cidade =>
    cidade.toLowerCase().includes(cidadeSearch.toLowerCase())
  );

  // Função para lidar com a pesquisa de cidades
  const handleCidadeSearch = (e) => {
    const value = e.target.value;
    setCidadeSearch(value);
    setShowCityDropdown(true);
    
    if (value) {
      setFormData({ ...formData, cidade: value });
    }
  };

  // Função para selecionar uma cidade
  const selectCidade = (cidade) => {
    setFormData({ ...formData, cidade });
    setCidadeSearch(cidade);
    setShowCityDropdown(false);
    validateField('cidade', cidade);
  };


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
      case 'cidade':
        if (!value) {
          newErrors.cidade = 'Cidade é obrigatória';
        } else {
          delete newErrors.cidade;
        }
        break;
      case 'aceiteLGPD':
        if (!value) {
          newErrors.aceiteLGPD = 'Você deve aceitar os termos LGPD';
        } else {
          delete newErrors.aceiteLGPD;
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
    const { name, value, type, checked } = e.target;
    
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
    } else if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
      validateField(name, checked);
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
        cidade: "",
        cpfImg: null,
        pisImg: null,
        rgFrenteImg: null,
        rgVersoImg: null,
        enderecoImg: null,
        aceiteLGPD: false
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
            <label htmlFor="cidade">Cidade *</label>
            <div className="city-input-container">
              <input
                id="cidade"
                name="cidade"
                type="text"
                placeholder="Digite para pesquisar sua cidade..."
                value={cidadeSearch}
                onChange={handleCidadeSearch}
                onFocus={() => setShowCityDropdown(true)}
                onBlur={() => setTimeout(() => setShowCityDropdown(false), 200)}
                required
                aria-describedby={errors.cidade ? "cidade-error" : undefined}
                className={errors.cidade ? "error" : ""}
                autoComplete="off"
              />
              
              {showCityDropdown && cidadesFiltradas.length > 0 && (
                <div className="city-dropdown">
                  {cidadesFiltradas.slice(0, 10).map((cidade, index) => (
                    <div
                      key={index}
                      className="city-option"
                      onClick={() => selectCidade(cidade)}
                    >
                      {cidade}
                    </div>
                  ))}
                  {cidadesFiltradas.length > 10 && (
                    <div className="city-option-more">
                      ... e mais {cidadesFiltradas.length - 10} cidades
                    </div>
                  )}
                </div>
              )}
            </div>
            {errors.cidade && <span id="cidade-error" className="error-message">{errors.cidade}</span>}
            <small className="city-help">
              Digite para pesquisar sua cidade
            </small>
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

          <div className="form-group lgpd-group">
            <div className="checkbox-container">
              <input
                id="aceiteLGPD"
                name="aceiteLGPD"
                type="checkbox"
                checked={formData.aceiteLGPD}
                onChange={handleChange}
                required
                className={errors.aceiteLGPD ? "error" : ""}
                aria-describedby={errors.aceiteLGPD ? "aceiteLGPD-error" : "lgpd-help"}
              />
              <label htmlFor="aceiteLGPD" className="checkbox-label">
                Li e aceito os termos da <button type="button" onClick={() => setShowLGPDInfo(true)} className="lgpd-link">Lei Geral de Proteção de Dados (LGPD)</button> *
              </label>
            </div>
            {errors.aceiteLGPD && <span id="aceiteLGPD-error" className="error-message">{errors.aceiteLGPD}</span>}
            <div id="lgpd-help" className="lgpd-help">
              <small>
                Ao marcar esta opção, você concorda com o tratamento dos seus dados pessoais conforme nossa 
                <button type="button" onClick={() => setShowLGPDInfo(true)} className="lgpd-link"> Política de Privacidade</button>.
              </small>
            </div>
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

      {/* Modal de Informações LGPD */}
      {showLGPDInfo && (
        <div 
          className="modal-overlay" 
          onClick={() => setShowLGPDInfo(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Informações sobre LGPD"
        >
          <div className="modal-content lgpd-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Lei Geral de Proteção de Dados (LGPD)</h2>
              <button 
                className="close-modal"
                onClick={() => setShowLGPDInfo(false)}
                aria-label="Fechar modal"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="lgpd-content">
                <h3>O que é a LGPD?</h3>
                <p>
                  A Lei Geral de Proteção de Dados (Lei nº 13.709/2018) é a legislação brasileira que regula 
                  o tratamento de dados pessoais por pessoas físicas e jurídicas, tanto no meio físico quanto 
                  no digital, com o objetivo de proteger os direitos fundamentais de liberdade e privacidade.
                </p>

                <h3>Seus Direitos</h3>
                <ul>
                  <li><strong>Confirmação e acesso:</strong> Saber se tratamos seus dados e acessá-los</li>
                  <li><strong>Correção:</strong> Corrigir dados incompletos, inexatos ou desatualizados</li>
                  <li><strong>Anonimização, bloqueio ou eliminação:</strong> Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários</li>
                  <li><strong>Portabilidade:</strong> Solicitar a portabilidade dos dados para outro fornecedor</li>
                  <li><strong>Eliminação:</strong> Solicitar a eliminação dos dados tratados com consentimento</li>
                  <li><strong>Informação:</strong> Obter informações sobre as entidades com as quais compartilhamos dados</li>
                  <li><strong>Revogação:</strong> Revogar o consentimento a qualquer momento</li>
                </ul>

                <h3>Como Utilizamos Seus Dados</h3>
                <p>
                  Coletamos e tratamos seus dados pessoais exclusivamente para:
                </p>
                <ul>
                  <li>Processamento de candidaturas e seleção de candidatos</li>
                  <li>Verificação de documentos e informações fornecidas</li>
                  <li>Comunicação sobre o processo seletivo</li>
                  <li>Cumprimento de obrigações legais</li>
                </ul>

                <h3>Compartilhamento de Dados</h3>
                <p>
                  Seus dados pessoais não serão compartilhados com terceiros, exceto quando necessário 
                  para cumprimento de obrigação legal ou regulatória, ou mediante sua autorização expressa.
                </p>

                <h3>Segurança dos Dados</h3>
                <p>
                  Adotamos medidas técnicas e organizacionais adequadas para proteger seus dados pessoais 
                  contra acesso não autorizado, alteração, divulgação ou destruição.
                </p>

                <h3>Contato</h3>
                <p>
                  Para exercer seus direitos ou esclarecer dúvidas sobre o tratamento de seus dados, 
                  entre em contato conosco através dos canais oficiais.
                </p>

                <div className="lgpd-footer">
                  <small>
                    <strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR')}
                  </small>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                type="button"
                className="btn-secondary"
                onClick={() => setShowLGPDInfo(false)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

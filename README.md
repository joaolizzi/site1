# Sistema de Entrevistas v2

Sistema moderno para cadastro e gerenciamento de candidatos com interface responsiva, validações avançadas e **acesso global com sincronização em tempo real**.

## 🚀 Funcionalidades

### Para Candidatos
- ✅ Formulário de cadastro com validação em tempo real
- ✅ Validação de CPF automática
- ✅ Formatação automática de telefone
- ✅ Upload de documentos com validação
- ✅ Interface responsiva e moderna
- ✅ Feedback visual de erros e sucesso

### Para Administradores
- ✅ Painel administrativo completo
- ✅ Visualização de todos os candidatos
- ✅ Filtros por status (Backlog, Aprovado, Rejeitado)
- ✅ Busca por nome ou CPF
- ✅ Aprovação/rejeição de candidatos
- ✅ Visualização de documentos
- ✅ Exportação para CSV
- ✅ Interface responsiva
- ✅ **Sincronização em tempo real**
- ✅ **Status de conexão**
- ✅ **Backup automático**
- ✅ **Logs de auditoria**

## 🛠️ Tecnologias

- **React 18** - Framework frontend
- **Firebase** - Backend e autenticação
- **Firestore** - Banco de dados em tempo real
- **Firebase Storage** - Armazenamento de arquivos
- **Firebase Hosting** - Deploy global
- **React Router** - Navegação
- **CSS3** - Estilização moderna com glassmorphism

## 📦 Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```



3. Execute o projeto:
```bash
npm run dev
```

## 🔧 Configuração do Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com)
2. Ative o Firestore Database
3. Ative o Storage
4. Configure as regras de segurança
5. Copie as credenciais para o arquivo `src/config.js`

## 🔐 Segurança

- ✅ Credenciais centralizadas em arquivo de configuração
- ✅ Validação de arquivos no frontend e backend
- ✅ Autenticação de administrador
- ✅ Regras de segurança do Firestore
- ✅ Validação de tipos de arquivo permitidos

## 📱 Responsividade

O sistema é totalmente responsivo e funciona perfeitamente em:
- 📱 Dispositivos móveis
- 📱 Tablets
- 💻 Desktops
- 🖥️ Telas grandes

## 🎨 Interface

- Design moderno com glassmorphism
- Gradientes e animações suaves
- Feedback visual para todas as ações
- Estados de loading
- Notificações toast
- Modal para visualização de documentos

## 🚀 Melhorias Implementadas

### Segurança
- [x] Credenciais em variáveis de ambiente
- [x] Validação robusta de arquivos
- [x] Autenticação centralizada
- [x] Tratamento de erros

### Performance
- [x] Hooks personalizados
- [x] Memoização de componentes
- [x] Lazy loading de imagens
- [x] Otimização de re-renders

### UX/UI
- [x] Validação em tempo real
- [x] Formatação automática
- [x] Estados de loading
- [x] Feedback visual
- [x] Design responsivo

### Acessibilidade
- [x] ARIA labels
- [x] Navegação por teclado
- [x] Contraste adequado
- [x] Semântica HTML

## 📝 Uso

### Cadastro de Candidatos
1. Acesse a página principal
2. Preencha o formulário com validação em tempo real
3. Faça upload do documento
4. Clique em "Enviar Candidatura"

### Painel Administrativo
1. Acesse `/admin`
2. Digite a senha de administrador
3. Gerencie candidatos no painel
4. Use filtros e busca para encontrar candidatos
5. Aprove ou rejeite candidatos
6. Exporte dados para CSV

## 🔧 Desenvolvimento

### Estrutura do Projeto
```
src/
├── components/          # Componentes React
├── hooks/              # Hooks personalizados
├── utils/              # Utilitários e validações
├── config.js           # Configurações centralizadas
├── firebase.js         # Configuração do Firebase
└── styles.css          # Estilos globais
```

### Scripts Disponíveis
- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview do build
- `npm run deploy` - Deploy completo (build + Firebase)
- `npm run deploy:hosting` - Deploy apenas do frontend
- `npm run deploy:firestore` - Deploy apenas do banco de dados
- `npm run deploy:storage` - Deploy apenas do storage

## 🌐 Deploy para Acesso Global

### 1. Instalar Firebase CLI
```bash
npm install -g firebase-tools
```

### 2. Fazer login no Firebase
```bash
firebase login
```

### 3. Deploy completo
```bash
npm run deploy
```

### 4. Acesso Global
Após o deploy, o sistema estará disponível globalmente em:
- **URL principal**: `https://seu-projeto-id.web.app`
- **URL alternativa**: `https://seu-projeto-id.firebaseapp.com`

### Características do Acesso Global:
- ✅ **Sincronização em tempo real** entre todos os dispositivos
- ✅ **Backup automático** de todos os dados
- ✅ **Logs de auditoria** de todas as operações
- ✅ **Persistência** de dados mesmo após fechar o navegador
- ✅ **Acesso offline** com sincronização posterior
- ✅ **Status de conexão** em tempo real

## 🗄️ Estrutura do Banco de Dados

```
firestore/
├── candidates/          # Candidatos principais
├── backup/candidates/   # Backup automático
├── logs/
│   ├── auth_logs/      # Logs de autenticação
│   └── candidate_logs/ # Logs de candidatos
└── admin/
    ├── sessions/       # Sessões ativas
    └── sync_status/    # Status de sincronização
```

## 📄 Licença

Este projeto é privado e destinado ao uso interno da MMG.
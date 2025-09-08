# Sistema de Entrevistas v2 - React + Vite + Firebase

## O que tem
- Formulário para candidatos (validações: CPF/PIS mask, idade mínima 18).
- Upload de imagens (CPF, RG, PIS) para Firebase Storage.
- Dados salvos no Firestore (collection `candidates`).
- Admin com senha fixa `mmgadmin` (sem Firebase Auth).
- Painel admin com busca, filtros, exportar CSV, preview de imagens, aprovar/rejeitar.

## Como rodar
1. `npm install`
2. `npm run dev`
3. Abra `http://localhost:5173/`

## Observações de segurança
- A senha `mmgadmin` está apenas no front-end (sessionStorage). Não é seguro para produção pública.
- Mantenha as regras do Firestore/Storage restritas no Firebase Console.

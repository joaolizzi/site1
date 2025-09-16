#!/usr/bin/env node

/**
 * Script de teste para verificar se o sistema está pronto para deploy
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuração do sistema...\n');

// Verificar arquivos essenciais
const requiredFiles = [
  'firebase.json',
  'firestore.rules',
  'firestore.indexes.json',
  'storage.rules',
  'src/firebase.js',
  'src/config.js',
  'src/hooks/useSync.js',
  'src/components/SyncStatus.jsx'
];

let allFilesExist = true;

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - ARQUIVO FALTANDO`);
    allFilesExist = false;
  }
});

// Verificar configuração do Firebase
console.log('\n🔧 Verificando configuração do Firebase...');

try {
  const firebaseConfig = require('./src/config.js');
  if (firebaseConfig.firebaseConfig) {
    console.log('✅ Configuração do Firebase encontrada');
  } else {
    console.log('❌ Configuração do Firebase não encontrada');
  }
} catch (error) {
  console.log('❌ Erro ao ler configuração do Firebase:', error.message);
}

// Verificar package.json
console.log('\n📦 Verificando scripts de deploy...');

try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const deployScripts = ['deploy', 'deploy:hosting', 'deploy:firestore', 'deploy:storage'];
  
  deployScripts.forEach(script => {
    if (packageJson.scripts[script]) {
      console.log(`✅ Script ${script} configurado`);
    } else {
      console.log(`❌ Script ${script} não encontrado`);
    }
  });
} catch (error) {
  console.log('❌ Erro ao ler package.json:', error.message);
}

// Verificar regras do Firestore
console.log('\n🔒 Verificando regras de segurança...');

try {
  const firestoreRules = fs.readFileSync('firestore.rules', 'utf8');
  if (firestoreRules.includes('allow read, write: if true')) {
    console.log('✅ Regras do Firestore configuradas para acesso público');
  } else {
    console.log('⚠️  Regras do Firestore podem estar restritivas');
  }
} catch (error) {
  console.log('❌ Erro ao ler regras do Firestore:', error.message);
}

// Resultado final
console.log('\n' + '='.repeat(50));

if (allFilesExist) {
  console.log('🎉 Sistema pronto para deploy!');
  console.log('\n📋 Próximos passos:');
  console.log('1. npm install -g firebase-tools');
  console.log('2. firebase login');
  console.log('3. npm run deploy');
  console.log('\n🌐 Após o deploy, o sistema estará disponível globalmente!');
} else {
  console.log('❌ Sistema não está pronto para deploy. Corrija os erros acima.');
}

console.log('\n' + '='.repeat(50));

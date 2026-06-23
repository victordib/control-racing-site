// scripts/generate-firebase-config.mjs
//
// Gera js/firebase-config.js a partir de variáveis de ambiente.
// Use isto como "Build command" na Cloudflare Pages se quiser manter
// os valores fora do repositório Git (boa prática, ainda que a apiKey
// do Firebase não seja, por definição, um segredo — veja SECURITY.md).
//
// Variáveis de ambiente esperadas (configure em
// Cloudflare Pages > Settings > Environment variables):
//
//   FIREBASE_API_KEY
//   FIREBASE_AUTH_DOMAIN
//   FIREBASE_PROJECT_ID
//   FIREBASE_STORAGE_BUCKET
//   FIREBASE_MESSAGING_SENDER_ID
//   FIREBASE_APP_ID
//
// Se as variáveis não estiverem definidas, o script mantém os valores
// atuais do projeto (control-racing) como fallback, então o deploy
// nunca quebra por falta de configuração.

import { writeFileSync } from "fs";

const cfg = {
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSyDaOJQBbu-XwgLkcrsiTkoiCywq9u2mNlA",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "control-racing.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "control-racing",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "control-racing.firebasestorage.app",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "114488486568",
  appId: process.env.FIREBASE_APP_ID || "1:114488486568:web:bba81c86949cf38d91f09d"
};

const fileContent = `/* ARQUIVO GERADO AUTOMATICAMENTE NO BUILD — NÃO EDITE À MÃO.
   Gerado por scripts/generate-firebase-config.mjs a partir de
   variáveis de ambiente da Cloudflare Pages. */

export const firebaseConfig = ${JSON.stringify(cfg, null, 2)};
`;

writeFileSync(new URL("../js/firebase-config.js", import.meta.url), fileContent);

console.log("js/firebase-config.js gerado com sucesso.");

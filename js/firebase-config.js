/*
  CONFIGURAÇÃO CENTRAL DO FIREBASE
  --------------------------------
  Antes este objeto estava duplicado (copiado e colado) em mais de 20
  arquivos .html. Agora existe em um único lugar — qualquer alteração
  futura (rotacionar a key, mudar de projeto, etc.) só precisa ser
  feita aqui.

  IMPORTANTE: a "apiKey" do Firebase NÃO é um segredo. Ela é enviada
  para o navegador de qualquer forma (é assim que o Firebase Auth /
  Firestore funcionam no client-side) e o próprio Google diz que é
  seguro ela ficar pública. Quem realmente protege seus dados são:

    1. Firestore Security Rules (veja firestore.rules na raiz do projeto)
    2. Restrição da API key por domínio (Google Cloud Console)
    3. Firebase App Check

  Veja o SECURITY.md para o passo a passo de cada um desses itens.

  --------------------------------------------------------------------
  USO COM VARIÁVEIS DE AMBIENTE NA CLOUDFLARE PAGES (opcional)
  --------------------------------------------------------------------
  Se preferir não deixar nem esse valor "público" diretamente no
  histórico do Git, configure variáveis de ambiente no painel da
  Cloudflare Pages (Settings > Environment variables) com os nomes:

    FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN, FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET, FIREBASE_MESSAGING_SENDER_ID, FIREBASE_APP_ID

  E defina o "Build command" do projeto na Cloudflare Pages como:

    node scripts/generate-firebase-config.mjs

  Esse script (incluído no projeto) gera este arquivo automaticamente
  em cada deploy, lendo os valores das variáveis de ambiente — assim
  o valor real nunca fica commitado no repositório Git.
  Sem configurar isso, o site funciona normalmente com os valores
  abaixo (que são os mesmos que já estavam públicos no código antes).
*/

export const firebaseConfig = {
  apiKey: "AIzaSyDaOJQBbu-XwgLkcrsiTkoiCywq9u2mNlA",
  authDomain: "control-racing.firebaseapp.com",
  projectId: "control-racing",
  storageBucket: "control-racing.firebasestorage.app",
  messagingSenderId: "114488486568",
  appId: "1:114488486568:web:bba81c86949cf38d91f09d"
};

# Segurança — Control Racing

Resumo do que foi revisado e alterado no projeto, e o que ainda
precisa ser feito por você diretamente no Firebase / Google Cloud /
Cloudflare (eu não tenho acesso a essas contas).

## 1. Sobre a "apiKey" do Firebase

A `apiKey` do Firebase **não é um segredo de verdade** — é assim que
o Google projetou o produto. Ela só identifica seu projeto Firebase
para o navegador; qualquer app que usa Firebase Auth/Firestore no
client-side precisa enviá-la para o navegador, então ela sempre será
visível em "Inspecionar > Network" não importa onde você guarde o
valor original (variável de ambiente, secret manager, etc.).

A própria documentação do Firebase confirma isso e explica que a
proteção real vem de outro lugar — por isso o foco deste trabalho foi
nos itens 2, 3 e 4 abaixo, que são as proteções que de fato importam.

**O que eu fiz mesmo assim (boa prática, não "segurança" em si):**
- Criei `js/firebase-config.js` como fonte única da configuração —
  antes ela estava copiada e colada em mais de 20 arquivos.
- Criei `scripts/generate-firebase-config.mjs`, que permite gerar esse
  arquivo a partir de variáveis de ambiente da Cloudflare Pages (em
  Settings > Environment variables), se você quiser que o valor não
  fique digitado no histórico do Git. Configure o "Build command" do
  projeto na Cloudflare Pages como:
  ```
  node scripts/generate-firebase-config.mjs
  ```
  Sem configurar isso, o site funciona normalmente com os valores que
  já estavam no código (control-racing).

## 2. Restringir a API key por domínio (faça isso agora)

No Google Cloud Console (APIs e Serviços > Credenciais) do projeto
`control-racing`:
1. Encontre a API key usada pelo Firebase.
2. Em "Restrições de aplicativo", escolha **Referenciadores HTTP** e
   adicione seu domínio (ex: `https://seusite.pages.dev/*` e o domínio
   do CNAME).
3. Em "Restrições de API", limite às APIs que o site realmente usa
   (Identity Toolkit / Firebase Auth, Cloud Firestore).

Isso impede que alguém copie sua apiKey e use em outro site/app.

## 3. Firebase App Check (recomendado)

Ative o **App Check** no Firebase Console (Build > App Check) com
reCAPTCHA v3 ou Enterprise. Isso bloqueia chamadas ao Firestore/Auth
que não vêm do seu site real, mesmo que alguém tenha a apiKey.

## 4. Firestore Security Rules (o item mais importante)

Este é a proteção que **não pode ser contornada pelo navegador** —
equivalente a "queries parametrizadas" no mundo SQL: ela garante que,
independente do que o código do site faça, o banco só aceita
exatamente o formato de dado esperado, do usuário certo.

O projeto enviado não incluía o arquivo de regras (elas vivem no
Firebase, não no site), então criei um **modelo** em `firestore.rules`
baseado nas coleções que identifiquei no código
(`inscricoes`, `pilotos`, `blacklist`, `pedidos`, `caixa`, `acessos`,
etc.). Você precisa:
1. Revisar os nomes de coleção/campos contra o que está realmente no
   seu Firestore (eu inferi pelos nomes usados no JavaScript).
2. Publicar via Firebase Console (Firestore Database > Regras) ou
   `firebase deploy --only firestore:rules`.

**Sem regras corretas no Firestore, qualquer um pode ler ou escrever
qualquer coleção direto pela API, independente de qualquer validação
que exista no site.**

## 5. XSS (o equivalente real de "SQL injection" neste projeto)

Seu site não usa SQL — usa Firestore (NoSQL) via SDK do cliente, que
já usa consultas estruturadas (não há como fazer "SQL injection"
clássica aqui). O risco real que **encontrei e corrigi** foi
**XSS armazenado**: vários campos vindos do Firestore (nome, carro,
equipe, cliente, motivo, etc.) eram inseridos direto em `innerHTML`
sem nenhum tratamento. Se um valor malicioso fosse gravado (ex: pelo
formulário público de inscrição), ele executaria como código na tela
de outros usuários/admins.

**O que foi feito:**
- Criado `js/security-utils.js` com `escapeHTML()`, `safeURL()` e
  `sanitizeInput()`.
- Todos os pontos onde dados do Firestore são inseridos em `innerHTML`
  agora passam por `escapeHTML()` antes — nos arquivos: `admin.html`,
  `blacklist.html`, `equipe.html`, `campeonatos.html`, `corridas.html`,
  `piloto.html`, `admin-pedidos.html`, `historico-pedidos.html`,
  `meus-pedidos.html`, `caixa.html`, `coleta.html`, `acessos.html`.
- O formulário público (`formulario.html`, a única tela onde alguém
  sem login pode gravar dados) agora valida e limpa os campos
  (`sanitizeInput`) antes de enviar ao Firestore — tamanho máximo,
  remoção de tags HTML, caracteres permitidos.

**Importante:** essa validação no formulário roda no navegador, então
protege contra usuários comuns mas pode ser contornada por alguém que
chame a API do Firestore diretamente. A única defesa que não pode ser
contornada é a regra no item 4 (`firestore.rules`) — por isso o modelo
que criei já valida tipo e tamanho do campo `inscricoes` no servidor
também.

## 6. Telas internas (admin, pedidos, caixa, etc.)

Essas páginas dependem de login (Firebase Auth) — presumo que hoje a
autorização de quem pode ver/editar o quê está só no JavaScript do
site (ex: esconder botões). Isso **não é proteção real**: qualquer
pessoa logada (ou não) pode chamar a API do Firestore direto e ler ou
escrever o que as regras permitirem. Garanta que `firestore.rules`
reflita exatamente quem pode fazer o quê — não confie em checagens só
no front-end para dados sensíveis (pedidos, caixa, blacklist).

## Resumo do que mudou nos arquivos

| Mudança | Onde |
|---|---|
| Config do Firebase centralizada | `js/firebase-config.js` (importado pelos 22 arquivos que antes tinham a config duplicada) |
| Geração via variável de ambiente (opcional) | `scripts/generate-firebase-config.mjs` |
| Escape de XSS em dados do Firestore exibidos | `js/security-utils.js` + 12 páginas que renderizam dados via `innerHTML` |
| Validação de input no formulário público | `formulario.html` |
| Modelo de regras do Firestore | `firestore.rules` (revisar e publicar no Firebase) |

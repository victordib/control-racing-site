/*
  security-utils.js
  -----------------
  Funções de proteção usadas em todo o site. Carregado como script
  comum (não-module) para ficar disponível globalmente (window) e
  ser usado dentro dos <script type="module"> de cada página.

  1) escapeHTML(valor)
     Neutraliza qualquer dado que vem do Firestore antes de inserir
     em innerHTML. Isso é o que impede um "nome" ou "carro" cadastrado
     por um usuário (ex: pelo formulario.html público) de virar código
     HTML/JS executável na tela de outros usuários ou de admins
     (ataque conhecido como XSS armazenado / stored XSS).

  2) safeURL(valor)
     Garante que um valor usado em src="" / href="" seja realmente uma
     URL http(s) ou um caminho relativo — bloqueia coisas como
     "javascript:alert(1)".

  3) sanitizeInput(valor, opções)
     Limpa e valida texto digitado pelo usuário ANTES de enviar para
     o Firestore (nome, carro, etc.): remove tags, corta no tamanho
     máximo e opcionalmente restringe a um padrão de caracteres.

  IMPORTANTE: isso é proteção no FRONT-END (cliente). Qualquer
  validação no cliente pode ser contornada por quem chamar a API do
  Firestore diretamente. A proteção que não pode ser contornada são
  as Firestore Security Rules (server-side) — veja firestore.rules e
  SECURITY.md. Trate este arquivo como uma camada extra, não como a
  única linha de defesa.
*/

(function (global) {
  "use strict";

  const ESCAPE_MAP = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
    "`": "&#96;"
  };

  /**
   * Escapa um valor para uso seguro dentro de innerHTML.
   * Aceita qualquer tipo (number, boolean, null, undefined) e
   * sempre retorna uma string segura.
   */
  function escapeHTML(value) {
    if (value === null || value === undefined) return "";

    const str = String(value);

    return str.replace(/[&<>"'`]/g, (ch) => ESCAPE_MAP[ch]);
  }

  /**
   * Valida que uma URL é http(s) ou caminho relativo simples.
   * Bloqueia esquemas perigosos (javascript:, data:, vbscript:, etc).
   * Retorna uma URL seguro para usar em src/href, ou um placeholder
   * vazio caso a URL seja suspeita.
   */
  function safeURL(value, fallback) {
    fallback = fallback || "";

    if (!value) return fallback;

    const str = String(value).trim();

    // bloqueia esquemas perigosos explicitamente
    if (/^\s*(javascript|data|vbscript|file):/i.test(str)) {
      return fallback;
    }

    // permite apenas http(s) absoluto ou caminho relativo (sem protocolo)
    const isHttp = /^https?:\/\//i.test(str);
    const isRelative = /^[^:]*$/.test(str); // não tem "esquema:" nenhum

    if (isHttp || isRelative) {
      return escapeHTML(str);
    }

    return fallback;
  }

  /**
   * Sanitiza e valida texto de input do usuário antes de salvar no
   * Firestore. Use isso em TODO campo de formulário preenchido por
   * usuários (nome, carro, motivo, etc.) antes de chamar addDoc/setDoc.
   *
   * opções:
   *   maxLength: número máximo de caracteres (padrão 100)
   *   pattern: regex de caracteres permitidos (padrão: letras, números,
   *            espaço e pontuação básica)
   *   required: se true, lança erro quando vazio
   */
  function sanitizeInput(value, opcoes) {
    opcoes = opcoes || {};

    const maxLength = opcoes.maxLength || 100;
    const pattern = opcoes.pattern || /^[\p{L}\p{N}\s.,!?()\-_'"#@/]*$/u;
    const required = !!opcoes.required;

    let str = (value === null || value === undefined) ? "" : String(value);

    // remove tags HTML por completo (não apenas escapa) e espaços nas pontas
    str = str.replace(/<[^>]*>/g, "").trim();

    // corta no tamanho máximo
    str = str.slice(0, maxLength);

    if (required && str.length === 0) {
      throw new Error("Campo obrigatório não pode ficar vazio.");
    }

    if (str.length > 0 && !pattern.test(str)) {
      throw new Error("Campo contém caracteres não permitidos.");
    }

    return str;
  }

  global.escapeHTML = escapeHTML;
  global.safeURL = safeURL;
  global.sanitizeInput = sanitizeInput;

})(window);

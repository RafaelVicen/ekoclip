/**
 * EkoClip - Utilitários de Segurança
 * Funções para prevenir XSS e outras vulnerabilidades
 */

/**
 * Sanitiza HTML removendo tags potencialmente perigosas
 * @param {string} html - HTML a ser sanitizado
 * @returns {string} HTML sanitizado
 */
function sanitizeHtml(html) {
  if (!html || typeof html !== 'string') return '';

  // Remove tags script, style, iframe, object, embed
  const dangerousTags =
    /<\/?(script|style|iframe|object|embed|form|input|textarea|select|button|meta|link)\b[^>]*>/gi;

  // Remove atributos perigosos
  const dangerousAttrs =
    /(\bon\w+|href\s*=\s*["']?\s*javascript:|style\s*=\s*["']?\s*[^"']*expression|style\s*=\s*["']?\s*[^"']*javascript)/gi;

  // Remove comentários condicionais do IE que podem conter scripts
  const conditionalComments = /<!--\[if[^>]*>[\s\S]*?<!\[endif\]-->/gi;

  return html
    .replace(dangerousTags, '')
    .replace(dangerousAttrs, '')
    .replace(conditionalComments, '');
}

/**
 * Sanitiza texto para uso seguro em innerHTML
 * @param {string} text - Texto a ser sanitizado
 * @returns {string} Texto sanitizado
 */
function sanitizeText(text) {
  if (!text || typeof text !== 'string') return '';

  // Converte caracteres especiais para entidades HTML
  const entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };

  return text.replace(/[&<>"'`=/]/g, (s) => entityMap[s]);
}

/**
 * Valida e sanitiza parâmetros de URL
 * @param {string} param - Parâmetro a ser validado
 * @param {string} type - Tipo esperado ('string', 'number', 'email')
 * @returns {string|number|null} Valor sanitizado ou null se inválido
 */
function sanitizeUrlParam(param, type = 'string') {
  if (!param || typeof param !== 'string') return null;

  // Remove caracteres de controle e null bytes
  param = param.replace(/[\x00-\x1F\x7F]/g, '');

  switch (type) {
    case 'number':
      const num = parseFloat(param);
      return isNaN(num) ? null : num;

    case 'email':
      // Validação básica de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(param) ? param.toLowerCase() : null;

    case 'string':
    default:
      // Limita comprimento e remove caracteres perigosos
      return param.length > 1000 ? null : sanitizeText(param);
  }
}

/**
 * Sanitiza dados para localStorage/sessionStorage
 * @param {*} data - Dados a serem armazenados
 * @returns {string} Dados sanitizados em JSON
 */
function sanitizeStorageData(data) {
  try {
    // Converte para JSON e sanitiza strings
    const sanitized = JSON.parse(
      JSON.stringify(data, (key, value) => {
        if (typeof value === 'string') {
          return sanitizeText(value);
        }
        return value;
      })
    );
    return JSON.stringify(sanitized);
  } catch (e) {
    console.error('Erro ao sanitizar dados para storage:', e);
    return null;
  }
}

/**
 * Valida se uma URL é segura (mesmo domínio ou HTTPS)
 * @param {string} url - URL a ser validada
 * @returns {boolean} True se segura
 */
function isSecureUrl(url) {
  if (!url || typeof url !== 'string') return false;

  try {
    const urlObj = new URL(url, window.location.origin);

    // Permite apenas HTTPS ou mesmo domínio
    return (
      urlObj.protocol === 'https:' ||
      (urlObj.protocol === 'http:' &&
        urlObj.hostname === window.location.hostname)
    );
  } catch (e) {
    return false;
  }
}

/**
 * Gera um token CSRF simples (para proteção básica)
 * @returns {string} Token CSRF
 */
function generateCsrfToken() {
  return btoa(Math.random().toString()).substr(10, 16);
}

/**
 * Wrapper seguro para innerHTML
 * @param {Element} element - Elemento DOM
 * @param {string} html - HTML a inserir
 */
function safeInnerHTML(element, html) {
  if (!element || !html) return;

  try {
    const sanitized = sanitizeHtml(html);
    element.innerHTML = sanitized;
  } catch (e) {
    console.error('Erro ao definir innerHTML de forma segura:', e);
    element.textContent = 'Erro ao carregar conteúdo';
  }
}

/**
 * Reporta violação CSP (para relatórios de Content Security Policy)
 * @param {Event} event - Evento de violação CSP
 */
function reportViolation(event) {
  try {
    if (event && event.detail) {
      console.warn('CSP Violation:', event.detail);
    }
  } catch (e) {
    console.warn('Erro ao reportar violação CSP:', e);
  }
}

// Exporta funções para uso global
window.SecurityUtils = {
  sanitizeHtml,
  sanitizeText,
  sanitizeUrlParam,
  sanitizeStorageData,
  isSecureUrl,
  generateCsrfToken,
  safeInnerHTML,
  reportViolation
};

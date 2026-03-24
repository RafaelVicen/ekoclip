// Importa utilitários de segurança
import('./../scripts/security-utils.js')
  .then(() => {
    console.log('Utilitários de segurança carregados');
  })
  .catch((err) => {
    console.warn('Não foi possível carregar utilitários de segurança:', err);
  });

document.addEventListener('DOMContentLoaded', () => {
  // --- LÓGICA DO FILTRO DE PODCASTS ---
  const filterButtons = document.querySelectorAll('.filter-btn');
  const videoCards = document.querySelectorAll('.video-card');

  if (filterButtons.length > 0 && videoCards.length > 0) {
    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        filterButtons.forEach((btn) => btn.classList.remove('active'));
        button.classList.add('active');

        const filterCategory = button.textContent;

        videoCards.forEach((card) => {
          const cardCategory = card.dataset.category;
          if (filterCategory === 'Todos' || cardCategory === filterCategory) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // --- LÓGICA DO MENU HAMBÚRGUER ---
  const hamburger = document.querySelector('.hamburger');
  const mainNav = document.querySelector('.main-nav');

  if (hamburger && mainNav) {
    hamburger.addEventListener('click', () => {
      mainNav.classList.toggle('active');
    });
  }
});
// --- LÓGICA PARA BUSCAR NOTÍCIAS AUTOMATICAMENTE ---
document.addEventListener('DOMContentLoaded', () => {
  const newsContainer = document.getElementById('news-feed-container');

  // Só executa se encontrar o espaço para as notícias na página
  if (newsContainer) {
    // Mostra uma mensagem de "A carregar..."
    if (window.SecurityUtils && window.SecurityUtils.safeInnerHTML) {
      window.SecurityUtils.safeInnerHTML(
        newsContainer,
        '<p>A carregar últimas notícias...</p>'
      );
    } else {
      newsContainer.textContent = 'A carregar últimas notícias...';
    }

    // Pede as notícias à Função Netlify (URL absoluta para funcionar em /pages/)
    const newsApiUrl = `${window.location.origin}/.netlify/functions/get-news`;
    fetch(newsApiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Limpa a mensagem "A carregar..." de forma segura
        while (newsContainer.firstChild) {
          newsContainer.removeChild(newsContainer.firstChild);
        }

        // Verifica se há itens
        if (!data.items || data.items.length === 0) {
          if (window.SecurityUtils && window.SecurityUtils.safeInnerHTML) {
            window.SecurityUtils.safeInnerHTML(
              newsContainer,
              '<p>Nenhuma notícia disponível de momento.</p>'
            );
          } else {
            newsContainer.textContent =
              'Nenhuma notícia disponível de momento.';
          }
          return;
        }

        // Pega apenas nas 5 notícias mais recentes
        const latestNews = data.items.slice(0, 5);

        latestNews.forEach((item) => {
          // Sanitiza dados antes de usar
          const safeTitle = window.SecurityUtils
            ? window.SecurityUtils.sanitizeText(item.title)
            : item.title;
          const safeContent = window.SecurityUtils
            ? window.SecurityUtils.sanitizeText(item.contentSnippet || '')
            : item.contentSnippet || '';
          const safeLink =
            window.SecurityUtils && window.SecurityUtils.isSecureUrl(item.link)
              ? item.link
              : '#';

          // Cria o HTML para cada notícia de forma segura
          const newsItem = document.createElement('div');
          newsItem.className = 'news-item';

          // Usa innerHTML de forma controlada com dados sanitizados
          const safeHtml = `
                        <h3><a href="${safeLink}" target="_blank" rel="noopener noreferrer">${safeTitle}</a></h3>
                        <p>${safeContent}</p>
                        <small>Fonte: ${item.isoDate ? new Date(item.isoDate).toLocaleDateString('pt-AO') : 'Recente'}</small>
                    `;

          if (window.SecurityUtils && window.SecurityUtils.safeInnerHTML) {
            window.SecurityUtils.safeInnerHTML(newsItem, safeHtml);
          } else {
            newsItem.innerHTML = safeHtml; // Fallback se utils não carregaram
          }

          newsContainer.appendChild(newsItem);
        });
      })
      .catch((error) => {
        console.error('Erro ao buscar notícias:', error);
        // Fallback: mostra notícias estáticas quando a API falha (dev ou feeds em baixo)
        const fallbackNews = [
          { title: 'Cultura angolana em destaque', link: 'https://www.bbc.com/portuguese', contentSnippet: 'A música e a arte angolana continuam a conquistar o mundo. Descobre os últimos lançamentos e eventos.', isoDate: new Date().toISOString() },
          { title: 'Podcasts: a nova onda do entretenimento', link: 'https://www.bbc.com/portuguese', contentSnippet: 'Os podcasts ganham cada vez mais ouvintes em Angola e na diáspora.', isoDate: new Date().toISOString() },
          { title: 'Eventos culturais em Luanda', link: 'https://www.bbc.com/portuguese', contentSnippet: 'Confere a agenda de concertos, exposições e festivais na capital.', isoDate: new Date().toISOString() },
          { title: 'Novos talentos da música angolana', link: 'https://www.bbc.com/portuguese', contentSnippet: 'Conhece os artistas que estão a fazer barulho na cena musical.', isoDate: new Date().toISOString() },
          { title: 'EkoClip: o eco da cultura angolana', link: 'index.html', contentSnippet: 'O teu espaço para notícias, músicas, podcasts e eventos. Acompanha-nos!', isoDate: new Date().toISOString() }
        ];
        while (newsContainer.firstChild) newsContainer.removeChild(newsContainer.firstChild);
        fallbackNews.forEach((item) => {
          const div = document.createElement('div');
          div.className = 'news-item';
          const safeTitle = (window.SecurityUtils ? window.SecurityUtils.sanitizeText(item.title) : item.title);
          const safeContent = (window.SecurityUtils ? window.SecurityUtils.sanitizeText(item.contentSnippet) : item.contentSnippet);
          const safeLink = item.link && (item.link.startsWith('http') || item.link.startsWith('/')) ? item.link : (item.link || 'https://www.bbc.com/portuguese');
          const dateStr = item.isoDate ? new Date(item.isoDate).toLocaleDateString('pt-AO') : 'Recente';
          div.innerHTML = `<h3><a href="${safeLink}" target="_blank" rel="noopener noreferrer">${safeTitle}</a></h3><p>${safeContent}</p><small>${dateStr}</small>`;
          newsContainer.appendChild(div);
        });
      });
  }
});

// --- LÓGICA DO CRONÓMETRO DE DESCONTO ---
document.addEventListener('DOMContentLoaded', () => {
  const ebookInput = document.getElementById('ebook-selecionado');
  const priceDisplay = document.getElementById('ebook-price-display');

  // Só executa se estivermos na página de pedido
  if (ebookInput && priceDisplay) {
    const params = new URLSearchParams(window.location.search);
    const ebookName = params.get('ebook');
    const ebookPrice = params.get('price');

    // Sanitiza parâmetros de URL
    const safeEbookName = window.SecurityUtils
      ? window.SecurityUtils.sanitizeUrlParam(ebookName, 'string')
      : ebookName;
    const safeEbookPrice = window.SecurityUtils
      ? window.SecurityUtils.sanitizeUrlParam(ebookPrice, 'number')
      : parseFloat(ebookPrice);

    // Preenche o campo escondido com o nome do ebook
    if (safeEbookName) {
      ebookInput.value = safeEbookName;
    }

    // Mostra o preço ao utilizador
    if (safeEbookPrice && !isNaN(safeEbookPrice)) {
      // Formata o número para ter o aspeto de moeda (ex: 5.000,00 Kz)
      const formattedPrice = new Intl.NumberFormat('pt-AO', {
        style: 'currency',
        currency: 'AOA'
      }).format(ebookPrice);

      if (window.SecurityUtils && window.SecurityUtils.safeInnerHTML) {
        window.SecurityUtils.safeInnerHTML(
          priceDisplay,
          `Valor a Pagar: <strong>${formattedPrice}</strong>`
        );
      } else {
        priceDisplay.textContent = `Valor a Pagar: ${formattedPrice}`;
      }
    } else {
      if (window.SecurityUtils && window.SecurityUtils.safeInnerHTML) {
        window.SecurityUtils.safeInnerHTML(
          priceDisplay,
          'Valor não especificado. Por favor, volte à livraria.'
        );
      } else {
        priceDisplay.textContent =
          'Valor não especificado. Por favor, volte à livraria.';
      }
      priceDisplay.style.color = 'red';
    }
  }
});
// --- LÓGICA DO CRONÓMETRO DE DESCONTO ---
document.addEventListener('DOMContentLoaded', () => {
  const timerBanner = document.getElementById('discount-timer-banner');
  const countdownDisplay = document.getElementById('countdown-timer');
  const DURATION_IN_HOURS = 24; // Duração da oferta em horas

  function startTimer() {
    const endTime = new Date().getTime() + DURATION_IN_HOURS * 60 * 60 * 1000;
    localStorage.setItem('ekoClipDiscountEndTime', endTime);
    return endTime;
  }

  function updateTimer() {
    let endTime = localStorage.getItem('ekoClipDiscountEndTime');
    if (!endTime) {
      endTime = startTimer();
    }

    const now = new Date().getTime();
    const distance = endTime - now;

    if (distance > 0) {
      timerBanner.style.display = 'block';

      const hours = Math.floor(
        (distance % (10 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      countdownDisplay.textContent =
        ('0' + hours).slice(-2) +
        ':' +
        ('0' + minutes).slice(-2) +
        ':' +
        ('0' + seconds).slice(-2);

      // Ativa o modo de desconto no site
      document.body.classList.add('discount-active');
    } else {
      timerBanner.style.display = 'none';
      localStorage.removeItem('ekoClipDiscountEndTime');
      // Desativa o modo de desconto
      document.body.classList.remove('discount-active');
    }
  }

  // Atualiza o cronómetro a cada segundo
  setInterval(updateTimer, 1000);
  updateTimer(); // Chama uma vez para não haver atraso
});

// --- ATUALIZA A LÓGICA DO FORMULÁRIO DE PEDIDO DE EBOOK ---
document.addEventListener('DOMContentLoaded', () => {
  const ebookInput = document.getElementById('ebook-selecionado');
  const priceDisplay = document.getElementById('ebook-price-display');

  if (ebookInput && priceDisplay) {
    const params = new URLSearchParams(window.location.search);
    const ebookName = params.get('ebook');
    const ebookPrice = params.get('price');
    const originalPrice = params.get('original_price');

    // Sanitiza todos os parâmetros
    const safeEbookName = window.SecurityUtils
      ? window.SecurityUtils.sanitizeUrlParam(ebookName, 'string')
      : ebookName;
    const safeEbookPrice = window.SecurityUtils
      ? window.SecurityUtils.sanitizeUrlParam(ebookPrice, 'number')
      : parseFloat(ebookPrice);
    const safeOriginalPrice = window.SecurityUtils
      ? window.SecurityUtils.sanitizeUrlParam(originalPrice, 'number')
      : parseFloat(originalPrice);

    if (safeEbookName) {
      ebookInput.value = safeEbookName;
    }

    // Mostra o preço (com ou sem desconto)
    let priceHtml = '';
    if (
      safeEbookPrice &&
      !isNaN(safeEbookPrice) &&
      safeOriginalPrice &&
      !isNaN(safeOriginalPrice)
    ) {
      const formattedOriginalPrice = new Intl.NumberFormat('pt-AO', {
        style: 'currency',
        currency: 'AOA'
      }).format(originalPrice);
      const formattedDiscountPrice = new Intl.NumberFormat('pt-AO', {
        style: 'currency',
        currency: 'AOA'
      }).format(ebookPrice);
      priceHtml = `
                <span class="original-price" style="display: inline;">${formattedOriginalPrice}</span>
                Valor a Pagar: <strong>${formattedDiscountPrice}</strong>
            `;
    } else if (ebookPrice) {
      const formattedPrice = new Intl.NumberFormat('pt-AO', {
        style: 'currency',
        currency: 'AOA'
      }).format(ebookPrice);
      priceHtml = `Valor a Pagar: <strong>${formattedPrice}</strong>`;
    } else {
      if (window.SecurityUtils && window.SecurityUtils.safeInnerHTML) {
        window.SecurityUtils.safeInnerHTML(priceDisplay, priceHtml);
      } else {
        // Fallback: remove tags HTML e usa apenas texto
        priceDisplay.textContent = priceHtml.replace(/<[^>]*>/g, '');
      }
    }
  }
});

// --- API SEGURA EKoclip - INTEGRAÇÃO COM BACKEND GO ---

// Configuração da API
const API_CONFIG = {
  baseURL:
    window.location.hostname === 'localhost'
      ? 'http://localhost:8080/api/v1'
      : 'https://ekoclip-api.netlify.app/.netlify/functions/api/v1',
  timeout: 10000 // 10 segundos
};

// Classe para gerenciar chamadas da API segura
class SecureAPI {
  constructor() {
    this.csrfToken = null;
  }

  // Obtém token CSRF
  async getCSRFToken() {
    try {
      const response = await this.makeRequest('/csrf-token', {
        method: 'GET'
      });

      if (response.success && response.data.csrf_token) {
        this.csrfToken = response.data.csrf_token;
        return this.csrfToken;
      }

      throw new Error('Falha ao obter token CSRF');
    } catch (error) {
      console.error('Erro ao obter token CSRF:', error);
      // Fallback: gerar token local (menos seguro, mas funcional)
      this.csrfToken = btoa(Math.random().toString()).substr(10, 16);
      return this.csrfToken;
    }
  }

  // Faz requisição HTTP segura
  async makeRequest(endpoint, options = {}) {
    const url = `${API_CONFIG.baseURL}${endpoint}`;

    const defaultOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      timeout: API_CONFIG.timeout
    };

    // Adicionar token CSRF se disponível
    if (this.csrfToken) {
      defaultOptions.headers['X-CSRF-Token'] = this.csrfToken;
    }

    const finalOptions = { ...defaultOptions, ...options };

    // Adicionar headers de segurança
    if (
      finalOptions.headers['Content-Type'] === 'application/json' &&
      finalOptions.body
    ) {
      // Sanitizar dados JSON antes de enviar
      try {
        const data = JSON.parse(finalOptions.body);
        const sanitizedData = this.sanitizeRequestData(data);
        finalOptions.body = JSON.stringify(sanitizedData);
      } catch (e) {
        console.warn('Erro ao sanitizar dados da requisição:', e);
      }
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        API_CONFIG.timeout
      );

      const response = await fetch(url, {
        ...finalOptions,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Requisição cancelada por timeout');
      }
      throw error;
    }
  }

  // Sanitiza dados antes de enviar
  sanitizeRequestData(data) {
    const sanitized = {};

    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        // Usar função de sanitização se disponível
        sanitized[key] = window.SecurityUtils
          ? window.SecurityUtils.sanitizeText(value)
          : value.replace(/[<>]/g, ''); // Fallback básico
      } else if (typeof value === 'number' && !isNaN(value)) {
        sanitized[key] = value;
      } else if (typeof value === 'boolean') {
        sanitized[key] = value;
      }
      // Ignorar outros tipos por segurança
    }

    return sanitized;
  }

  // Envia formulário de contato
  async submitContactForm(formData) {
    // Obter token CSRF se necessário
    if (!this.csrfToken) {
      await this.getCSRFToken();
    }

    const payload = {
      name: formData.get('name') || '',
      email: formData.get('email') || '',
      subject: formData.get('subject') || '',
      message: formData.get('message') || '',
      csrf: this.csrfToken
    };

    return await this.makeRequest('/contact', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  // Envia pedido de ebook
  async submitEbookOrder(orderData) {
    // Obter token CSRF se necessário
    if (!this.csrfToken) {
      await this.getCSRFToken();
    }

    const payload = {
      ebook_name: orderData.ebookName || '',
      price: parseFloat(orderData.price) || 0,
      email: orderData.email || '',
      csrf: this.csrfToken
    };

    return await this.makeRequest('/ebook-order', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  // Health check da API
  async healthCheck() {
    try {
      const response = await this.makeRequest('/health', {
        method: 'GET'
      });
      return response.success === true;
    } catch (error) {
      console.warn('API health check failed:', error);
      return false;
    }
  }
}

// Instância global da API segura
const secureAPI = new SecureAPI();

// --- FORMULÁRIOS COM API SEGURA ---

// Formulário de contato seguro
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.querySelector('form[action*="formspree"]');
  if (contactForm) {
    // Substituir action do Formspree
    contactForm.action = '#';
    contactForm.method = 'POST';

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;

      try {
        // Mostrar loading
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;

        // Verificar saúde da API
        const apiHealthy = await secureAPI.healthCheck();
        if (!apiHealthy) {
          throw new Error(
            'Serviço temporariamente indisponível. Tente novamente mais tarde.'
          );
        }

        // Enviar formulário
        const formData = new FormData(contactForm);
        const response = await secureAPI.submitContactForm(formData);

        if (response.success) {
          // Sucesso
          alert(
            'Mensagem enviada com sucesso! Entraremos em contato em breve.'
          );
          contactForm.reset();
        } else {
          // Erro de validação
          const errors = Array.isArray(response.data)
            ? response.data
            : [response.message];
          alert('Erro ao enviar mensagem:\n' + errors.join('\n'));
        }
      } catch (error) {
        console.error('Erro ao enviar formulário:', error);
        alert('Erro ao enviar mensagem: ' + error.message);
      } finally {
        // Restaurar botão
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }
});

// Formulário de pedido de ebook seguro
document.addEventListener('DOMContentLoaded', () => {
  const ebookForm = document.querySelector('form[action*="formspree"]');
  if (
    ebookForm &&
    ebookForm.querySelector('input[name="_next"][value*="obrigado"]')
  ) {
    // Este é o formulário de pedido de ebook
    ebookForm.action = '#';
    ebookForm.method = 'POST';

    ebookForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = ebookForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;

      try {
        // Mostrar loading
        submitBtn.textContent = 'Processando pedido...';
        submitBtn.disabled = true;

        // Verificar saúde da API
        const apiHealthy = await secureAPI.healthCheck();
        if (!apiHealthy) {
          throw new Error(
            'Serviço temporariamente indisponível. Tente novamente mais tarde.'
          );
        }

        // Coletar dados do pedido
        const ebookName =
          document.getElementById('ebook-selecionado')?.value || '';
        const email =
          document.querySelector('input[name="email"]')?.value || '';
        const priceText =
          document.getElementById('ebook-price-display')?.textContent || '';
        const priceMatch = priceText.match(/[\d.,]+/);
        const price = priceMatch
          ? parseFloat(priceMatch[0].replace(',', '.'))
          : 0;

        // Enviar pedido
        const response = await secureAPI.submitEbookOrder({
          ebookName,
          email,
          price
        });

        if (response.success) {
          // Sucesso - redirecionar para página de obrigado
          window.location.href = 'obrigado.html';
        } else {
          // Erro de validação
          const errors = Array.isArray(response.data)
            ? response.data
            : [response.message];
          alert('Erro ao processar pedido:\n' + errors.join('\n'));
        }
      } catch (error) {
        console.error('Erro ao processar pedido:', error);
        alert('Erro ao processar pedido: ' + error.message);
      } finally {
        // Restaurar botão
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }
});

// --- MONITORAMENTO DE SEGURANÇA ---

// Monitor de violações de CSP
document.addEventListener('securitypolicyviolation', (event) => {
  console.warn('CSP Violation:', {
    violatedDirective: event.violatedDirective,
    blockedURI: event.blockedURI,
    sourceFile: event.sourceFile,
    lineNumber: event.lineNumber
  });

  // Em produção, enviar para serviço de monitoramento
  if (window.SecurityUtils && window.SecurityUtils.reportViolation) {
    window.SecurityUtils.reportViolation(event);
  }
});

// Monitor de tentativas de XSS
const originalAlert = window.alert;
window.alert = function (message) {
  // Log suspeito se alert for chamado com código potencialmente perigoso
  if (/<script|javascript:|on\w+=/i.test(message)) {
    console.warn('Potencial tentativa de XSS detectada em alert:', message);
  }
  return originalAlert.apply(this, arguments);
};

// Inicialização da API segura
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Pré-carregar token CSRF
    await secureAPI.getCSRFToken();
    console.log('🔒 API segura inicializada com token CSRF');
  } catch (error) {
    console.warn('⚠️ Falha ao inicializar API segura:', error);
  }
});

// Application Component Manager
// Simula estrutura de componentes do Angular usando Vanilla JS

class ComponentManager {
  constructor() {
    this.components = new Map();
    this.state = {
      isLoading: false,
      currentPage: 'welcome'
    };
    this.init();
  }

  init() {
    this.registerComponents();
    this.renderWelcome();
    this.attachEventListeners();
  }

  registerComponents() {
    // Header Component
    this.components.set('header', {
      render: () => `
                <nav class="navbar">
                    <div class="nav-container">
                        <div class="nav-logo">
                            <span class="logo-icon">🎵</span>
                            <span class="logo-text">EkoClip</span>
                        </div>
                        <button class="nav-toggle" id="navToggle">☰</button>
                        <ul class="nav-menu" id="navMenu">
                            <li><a href="#" class="nav-link" onclick="app.scrollToSection('benefits')">Benefícios</a></li>
                            <li><a href="#" class="nav-link" onclick="app.enterProject()">Entrar →</a></li>
                        </ul>
                    </div>
                </nav>
            `
    });

    // Welcome Component
    this.components.set('welcome', {
      render: () => `
                <section class="welcome-section">
                    <div class="welcome-content">
                        <div class="welcome-icon">🎵</div>
                        <h1 class="welcome-title">
                            Bem-vindo ao <span class="gradient-text">EkoClip</span>
                        </h1>
                        <p class="welcome-subtitle">
                            O eco da nova geração da cultura angolana
                        </p>
                        <p class="welcome-description">
                            Notícias • Podcasts • Músicas • Eventos Culturais
                        </p>
                        <button class="btn btn-primary" onclick="app.enterProject()">
                            Explorar Agora
                            <span class="btn-loader" id="btnLoader" style="display: none;">●●●</span>
                        </button>
                    </div>
                </section>
            `
    });

    // Benefits Component
    this.components.set('benefits', {
      render: () => `
                <section class="benefits-section" id="benefits">
                    <h2 class="section-title">Por que EkoClip?</h2>
                    <div class="benefits-grid">
                        ${this.renderBenefits()}
                    </div>
                </section>
            `,
      renderBenefits: () =>
        [
          {
            icon: '📰',
            title: 'Notícias Atualizadas',
            desc: 'Fique sempre informado'
          },
          {
            icon: '🎙️',
            title: 'Podcasts Premium',
            desc: 'Melhor conteúdo de áudio'
          },
          {
            icon: '🎵',
            title: 'Músicas Exclusivas',
            desc: 'Artistas angolanos'
          },
          { icon: '📚', title: 'Livros Digitais', desc: 'Biblioteca completa' },
          {
            icon: '🎬',
            title: 'Vídeos Curados',
            desc: 'Entretenimento de qualidade'
          },
          {
            icon: '🎪',
            title: 'Eventos Ao Vivo',
            desc: 'Agenda sempre atualizada'
          }
        ]
          .map(
            (benefit) => `
                <div class="benefit-card">
                    <div class="benefit-icon">${benefit.icon}</div>
                    <h3>${benefit.title}</h3>
                    <p>${benefit.desc}</p>
                </div>
            `
          )
          .join('')
    });

    // Footer Component
    this.components.set('footer', {
      render: () => `
                <footer class="footer">
                    <p>&copy; 2026 EkoClip. Todos os direitos reservados.</p>
                    <div class="social-links">
                        <a href="#" title="Facebook">f</a>
                        <a href="#" title="Instagram">📷</a>
                        <a href="#" title="Twitter">𝕏</a>
                        <a href="#" title="YouTube">▶</a>
                    </div>
                </footer>
            `
    });
  }

  attachEventListeners() {
    // Mobile menu toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle) {
      navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
      });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'Enter') {
        this.enterProject();
      }
    });

    // Scroll effects
    window.addEventListener('scroll', () => {
      this.handleScrollEffects();
    });
  }

  renderWelcome() {
    const app = document.getElementById('app');
    if (!app) return;

    // Usar abordagem segura para renderizar HTML
    if (window.SecurityUtils && window.SecurityUtils.safeInnerHTML) {
      const html = `
            ${this.components.get('header').render()}
            ${this.components.get('welcome').render()}
            ${this.components.get('benefits').render()}
            ${this.components.get('footer').render()}
        `;
      window.SecurityUtils.safeInnerHTML(app, html);
    } else {
      // Fallback: limpar e recriar elementos de forma segura
      while (app.firstChild) {
        app.removeChild(app.firstChild);
      }
      // Como não temos SecurityUtils, assumimos que os componentes são seguros
      // e usamos abordagem mais segura
      const components = [
        this.components.get('header').render(),
        this.components.get('welcome').render(),
        this.components.get('benefits').render(),
        this.components.get('footer').render()
      ];

      components.forEach((componentHtml) => {
        const tempDiv = document.createElement('div');
        // Usar textContent se possível, senão innerHTML com cautela
        if (componentHtml.indexOf('<') === -1) {
          tempDiv.textContent = componentHtml;
        } else {
          // Para HTML, usar abordagem mais segura
          tempDiv.innerHTML = componentHtml.replace(
            /<script[^>]*>.*?<\/script>/gi,
            ''
          );
        }
        while (tempDiv.firstChild) {
          app.appendChild(tempDiv.firstChild);
        }
      });
    }

    this.attachEventListeners();
  }

  enterProject() {
    const loader = document.getElementById('btnLoader');
    if (loader) {
      loader.style.display = 'inline';
    }

    this.state.isLoading = true;

    setTimeout(() => {
      document.body.style.transition = 'opacity 0.6s ease-out';
      document.body.style.opacity = '0';

      setTimeout(() => {
        window.location.href = './pages/index.html';
      }, 600);
    }, 1500);
  }

  scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  handleScrollEffects() {
    const cards = document.querySelectorAll('.benefit-card');
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.75) {
        card.classList.add('visible');
      }
    });
  }
}

// Initialize application
const app = new ComponentManager();

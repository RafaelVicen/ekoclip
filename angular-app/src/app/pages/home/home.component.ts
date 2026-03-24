import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

interface NewsItem {
  title: string;
  contentSnippet: string;
  link: string;
  isoDate: string;
}

interface Ebook {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  image: string;
  downloadLink: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content fade-in-up">
          <h1>EkoClip</h1>
          <p class="hero-subtitle">O eco da nova geração da cultura angolana</p>
          <p class="hero-description">
            Conectando artistas, criadores e audiência através da música,
            literatura e mídia digital. Descubra o melhor da cultura angolana em
            um só lugar.
          </p>
          <div class="hero-buttons">
            <a routerLink="/musicas" class="btn btn-primary"
              >Explorar Músicas</a
            >
            <a routerLink="/livros" class="btn btn-secondary">Ver Livros</a>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="section features">
      <div class="container">
        <h2 class="section-title">O que oferecemos</h2>
        <div class="grid grid-3">
          <div class="card feature-card fade-in-up">
            <div class="feature-icon">🎵</div>
            <h3>Músicas</h3>
            <p>
              Descubra e baixe as melhores músicas angolanas. De Kizomba a Hip
              Hop, temos tudo que você precisa.
            </p>
            <a routerLink="/musicas" class="btn btn-secondary">Ver Músicas</a>
          </div>

          <div class="card feature-card fade-in-up delay-1">
            <div class="feature-icon">📚</div>
            <h3>Livros</h3>
            <p>
              Literatura angolana de qualidade. Ebooks exclusivos de autores
              nacionais e internacionais.
            </p>
            <a routerLink="/livros" class="btn btn-secondary">Ver Livros</a>
          </div>

          <div class="card feature-card fade-in-up delay-2">
            <div class="feature-icon">🎙️</div>
            <h3>Podcasts</h3>
            <p>
              Entrevistas exclusivas com artistas, escritores e personalidades
              da cultura angolana.
            </p>
            <a routerLink="/podcasts" class="btn btn-secondary"
              >Ouvir Podcasts</a
            >
          </div>
        </div>
      </div>
    </section>

    <!-- Destaques Section -->
    <section class="section destaques bg-secondary">
      <div class="container">
        <h2 class="section-title">Destaques da Semana</h2>

        <!-- Livros em Destaque -->
        <div class="destaque-section">
          <h3>Livros em Destaque</h3>
          <div class="grid grid-4">
            <div class="card book-card" *ngFor="let book of featuredBooks">
              <img [src]="book.image" [alt]="book.title" class="book-image" />
              <div class="book-info">
                <h4>{{ book.title }}</h4>
                <p class="author">{{ book.author }}</p>
                <p class="price">
                  {{ book.price | currency: 'AOA' : 'symbol' : '1.0-0' }}
                </p>
                <a
                  [routerLink]="['/download', book.id]"
                  class="btn btn-primary btn-small"
                  >Comprar</a
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Notícias Section -->
    <section class="section news">
      <div class="container">
        <h2 class="section-title">Últimas Notícias</h2>

        <div class="loading" *ngIf="loadingNews">
          <div class="spinner"></div>
          <p>Carregando notícias...</p>
        </div>

        <div class="error" *ngIf="newsError">
          <h3>Erro ao carregar notícias</h3>
          <p>{{ newsError }}</p>
        </div>

        <div class="grid grid-3" *ngIf="!loadingNews && !newsError">
          <div class="card news-card" *ngFor="let news of latestNews">
            <h3>{{ news.title }}</h3>
            <p>{{ news.contentSnippet }}</p>
            <small>{{ news.isoDate | date: 'dd/MM/yyyy' }}</small>
            <a
              [href]="news.link"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-secondary btn-small"
            >
              Ler mais
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="section cta">
      <div class="container">
        <div class="cta-content">
          <h2>Junte-se à comunidade EkoClip</h2>
          <p>
            Seja parte do movimento cultural angolano. Conecte-se com artistas,
            descubra novos talentos e apoie a cultura nacional.
          </p>
          <div class="cta-buttons">
            <a routerLink="/contato" class="btn btn-primary"
              >Entre em Contato</a
            >
            <a routerLink="/sobre-nos" class="btn btn-secondary">Saiba Mais</a>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .hero {
        min-height: 100vh;
        display: flex;
        align-items: center;
        background: linear-gradient(135deg, #f7fafc 0%, #ffffff 100%);
        position: relative;
        overflow: hidden;
      }

      .hero::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url('/assets/images/capa1.jpg') center/cover;
        opacity: 0.1;
        z-index: 1;
      }

      .hero-content {
        position: relative;
        z-index: 2;
        text-align: center;
        max-width: 800px;
        margin: 0 auto;
        padding: 0 20px;
      }

      .hero h1 {
        font-size: 4rem;
        margin-bottom: 1rem;
        background: linear-gradient(135deg, #ff6b35, #e53e3e);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        font-weight: 700;
      }

      .hero-subtitle {
        font-size: 1.5rem;
        color: #2d3748;
        margin-bottom: 1.5rem;
        font-weight: 600;
      }

      .hero-description {
        font-size: 1.2rem;
        color: #4a5568;
        margin-bottom: 2.5rem;
        line-height: 1.6;
        max-width: 600px;
        margin-left: auto;
        margin-right: auto;
      }

      .hero-buttons {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
      }

      .features {
        background: white;
      }

      .feature-card {
        text-align: center;
        padding: 2.5rem;
      }

      .feature-icon {
        font-size: 3rem;
        margin-bottom: 1.5rem;
      }

      .feature-card h3 {
        margin-bottom: 1rem;
        color: #2d3748;
      }

      .feature-card p {
        color: #4a5568;
        margin-bottom: 1.5rem;
        line-height: 1.6;
      }

      .bg-secondary {
        background: #f7fafc;
      }

      .destaque-section h3 {
        text-align: center;
        margin-bottom: 2rem;
        color: #2d3748;
        font-size: 1.8rem;
      }

      .book-card {
        text-align: center;
        overflow: hidden;
        transition: transform 0.3s ease;
      }

      .book-card:hover {
        transform: translateY(-5px);
      }

      .book-image {
        width: 100%;
        height: 200px;
        object-fit: cover;
        border-radius: 8px 8px 0 0;
      }

      .book-info {
        padding: 1.5rem;
      }

      .book-info h4 {
        margin-bottom: 0.5rem;
        color: #2d3748;
        font-size: 1.1rem;
      }

      .author {
        color: #718096;
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
      }

      .price {
        font-weight: 700;
        color: #ff6b35;
        margin-bottom: 1rem;
      }

      .news-card h3 {
        margin-bottom: 1rem;
        color: #2d3748;
        font-size: 1.1rem;
      }

      .news-card p {
        color: #4a5568;
        margin-bottom: 1rem;
        line-height: 1.6;
      }

      .news-card small {
        color: #718096;
        display: block;
        margin-bottom: 1rem;
      }

      .cta {
        background: linear-gradient(135deg, #ff6b35, #e53e3e);
        color: white;
        text-align: center;
      }

      .cta-content {
        max-width: 600px;
        margin: 0 auto;
      }

      .cta h2 {
        margin-bottom: 1rem;
        color: white;
      }

      .cta p {
        margin-bottom: 2rem;
        opacity: 0.9;
        line-height: 1.6;
      }

      .cta-buttons {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
      }

      .btn-small {
        padding: 0.5rem 1rem;
        font-size: 0.9rem;
      }

      .loading,
      .error {
        text-align: center;
        padding: 3rem;
      }

      .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #ff6b35;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 1rem;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      @media (max-width: 768px) {
        .hero h1 {
          font-size: 2.5rem;
        }

        .hero-subtitle {
          font-size: 1.2rem;
        }

        .hero-description {
          font-size: 1rem;
        }

        .hero-buttons {
          flex-direction: column;
          align-items: center;
        }

        .grid-3,
        .grid-4 {
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        }

        .feature-card {
          padding: 2rem;
        }

        .cta-buttons {
          flex-direction: column;
          align-items: center;
        }
      }

      @media (max-width: 480px) {
        .hero-content {
          padding: 0 15px;
        }

        .grid-3,
        .grid-4 {
          grid-template-columns: 1fr;
        }
      }
    `
  ]
})
export class HomeComponent implements OnInit {
  featuredBooks: Ebook[] = [
    {
      id: 'ser-pobre',
      title: 'Ser Pobre',
      author: 'Ondjaki',
      description: 'Uma obra-prima da literatura angolana contemporânea.',
      price: 15000,
      image: '/assets/images/ser-pobre.jpg',
      downloadLink: '/download/ser-pobre'
    },
    {
      id: 'ultimo-poeta',
      title: 'O Último Poeta',
      author: 'António Jacinto',
      description: 'Poesia angolana clássica que marcou gerações.',
      price: 12000,
      image: '/assets/images/ultimo-poeta.jpg',
      downloadLink: '/download/ultimo-poeta'
    },
    {
      id: 'alma-na-paixao',
      title: 'Alma na Paixão',
      author: 'Pepetela',
      description: 'Romance histórico sobre a luta angolana.',
      price: 18000,
      image: '/assets/images/alma-na-paixao.jpg',
      downloadLink: '/download/alma-na-paixao'
    },
    {
      id: 'comeram-minha-banana',
      title: 'Comeram Minha Banana',
      author: 'Arlindo Barbeitos',
      description: 'Contos angolanos cheios de humor e crítica social.',
      price: 14000,
      image: '/assets/images/comeram-minha-banana.jpg',
      downloadLink: '/download/comeram-minha-banana'
    }
  ];

  latestNews: NewsItem[] = [];
  loadingNews = true;
  newsError = '';

  ngOnInit() {
    this.loadNews();
  }

  async loadNews() {
    try {
      this.loadingNews = true;
      this.newsError = '';

      // Simular carregamento de notícias (em produção, conectar com API real)
      setTimeout(() => {
        this.latestNews = [
          {
            title: 'Novo álbum de Kizomba promete revolucionar o gênero',
            contentSnippet:
              'O artista angolano X lançou seu mais novo trabalho que está conquistando as paradas musicais...',
            link: '#',
            isoDate: new Date().toISOString()
          },
          {
            title: 'Literatura angolana ganha destaque internacional',
            contentSnippet:
              'Escritores nacionais participam de feira literária em Portugal com grande sucesso...',
            link: '#',
            isoDate: new Date(Date.now() - 86400000).toISOString()
          },
          {
            title: 'Podcast sobre cultura urbana angola ganha prêmio',
            contentSnippet:
              'Produção independente conquista reconhecimento internacional na categoria cultura...',
            link: '#',
            isoDate: new Date(Date.now() - 172800000).toISOString()
          }
        ];
        this.loadingNews = false;
      }, 1500);
    } catch (error) {
      this.newsError = 'Erro ao carregar notícias. Tente novamente mais tarde.';
      this.loadingNews = false;
      console.error('Erro ao carregar notícias:', error);
    }
  }
}

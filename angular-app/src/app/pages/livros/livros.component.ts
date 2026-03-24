import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Ebook {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  pages: number;
  language: string;
  featured?: boolean;
}

@Component({
  selector: 'app-livros',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <!-- Hero Section -->
    <section class="hero-books">
      <div class="container">
        <div class="hero-content">
          <h1>Livraria EkoClip</h1>
          <p>
            Descubra a melhor literatura angolana e internacional. Ebooks de
            qualidade com preços acessíveis.
          </p>
        </div>
      </div>
    </section>

    <!-- Filtros -->
    <section class="filters">
      <div class="container">
        <div class="filter-buttons">
          <button
            class="filter-btn"
            [class.active]="activeFilter === 'todos'"
            (click)="setFilter('todos')"
          >
            Todos os Livros
          </button>
          <button
            class="filter-btn"
            [class.active]="activeFilter === 'nacionais'"
            (click)="setFilter('nacionais')"
          >
            Literatura Angolana
          </button>
          <button
            class="filter-btn"
            [class.active]="activeFilter === 'internacionais'"
            (click)="setFilter('internacionais')"
          >
            Literatura Internacional
          </button>
          <button
            class="filter-btn"
            [class.active]="activeFilter === 'promocoes'"
            (click)="setFilter('promocoes')"
          >
            Promoções
          </button>
        </div>
      </div>
    </section>

    <!-- Livros Grid -->
    <section class="books-section">
      <div class="container">
        <div class="books-grid">
          <div class="book-card" *ngFor="let book of filteredBooks">
            <div class="book-image-container">
              <img [src]="book.image" [alt]="book.title" class="book-image" />
              <div class="book-badge" *ngIf="book.featured">Destaque</div>
              <div
                class="book-discount"
                *ngIf="book.originalPrice && book.originalPrice > book.price"
              >
                -{{ getDiscountPercentage(book) }}%
              </div>
            </div>

            <div class="book-info">
              <div class="book-category">{{ book.category }}</div>
              <h3 class="book-title">{{ book.title }}</h3>
              <p class="book-author">por {{ book.author }}</p>

              <div class="book-rating">
                <div class="stars">
                  <span
                    class="star"
                    *ngFor="let star of [1, 2, 3, 4, 5]"
                    [class.filled]="star <= book.rating"
                    >★</span
                  >
                </div>
                <span class="rating-text">{{ book.rating }}/5</span>
              </div>

              <p class="book-description">{{ book.description }}</p>

              <div class="book-details">
                <span class="detail">{{ book.pages }} páginas</span>
                <span class="detail">{{ book.language }}</span>
              </div>

              <div class="book-price">
                <div class="price-container">
                  <span class="current-price">{{
                    book.price | currency: 'AOA' : 'symbol' : '1.0-0'
                  }}</span>
                  <span
                    class="original-price"
                    *ngIf="
                      book.originalPrice && book.originalPrice > book.price
                    "
                  >
                    {{
                      book.originalPrice | currency: 'AOA' : 'symbol' : '1.0-0'
                    }}
                  </span>
                </div>
                <a [routerLink]="['/download', book.id]" class="btn btn-primary"
                  >Comprar Agora</a
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter Section -->
    <section class="newsletter">
      <div class="container">
        <div class="newsletter-content">
          <h2>Fique por dentro dos lançamentos</h2>
          <p>Receba notificações sobre novos ebooks e promoções exclusivas.</p>
          <form class="newsletter-form" (ngSubmit)="onNewsletterSubmit($event)">
            <input
              type="email"
              placeholder="Seu email"
              required
              class="newsletter-input"
            />
            <button type="submit" class="btn btn-primary">Inscrever-se</button>
          </form>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .hero-books {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 80px 0;
        text-align: center;
      }

      .hero-books h1 {
        font-size: 3rem;
        margin-bottom: 1rem;
      }

      .hero-books p {
        font-size: 1.2rem;
        opacity: 0.9;
        max-width: 600px;
        margin: 0 auto;
      }

      .filters {
        background: white;
        padding: 30px 0;
        border-bottom: 1px solid #e2e8f0;
      }

      .filter-buttons {
        display: flex;
        justify-content: center;
        gap: 1rem;
        flex-wrap: wrap;
      }

      .filter-btn {
        padding: 12px 24px;
        background: #f7fafc;
        border: 2px solid #e2e8f0;
        border-radius: 25px;
        font-weight: 600;
        color: #4a5568;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .filter-btn:hover,
      .filter-btn.active {
        background: #ff6b35;
        border-color: #ff6b35;
        color: white;
      }

      .books-section {
        padding: 60px 0;
        background: #f7fafc;
      }

      .books-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 2rem;
      }

      .book-card {
        background: white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition:
          transform 0.3s ease,
          box-shadow 0.3s ease;
      }

      .book-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      }

      .book-image-container {
        position: relative;
        height: 250px;
        overflow: hidden;
      }

      .book-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
      }

      .book-card:hover .book-image {
        transform: scale(1.05);
      }

      .book-badge {
        position: absolute;
        top: 10px;
        left: 10px;
        background: #ff6b35;
        color: white;
        padding: 5px 10px;
        border-radius: 15px;
        font-size: 0.8rem;
        font-weight: 600;
      }

      .book-discount {
        position: absolute;
        top: 10px;
        right: 10px;
        background: #e53e3e;
        color: white;
        padding: 5px 10px;
        border-radius: 15px;
        font-size: 0.8rem;
        font-weight: 600;
      }

      .book-info {
        padding: 1.5rem;
      }

      .book-category {
        color: #ff6b35;
        font-size: 0.8rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 0.5rem;
      }

      .book-title {
        font-size: 1.2rem;
        font-weight: 700;
        color: #2d3748;
        margin-bottom: 0.5rem;
        line-height: 1.3;
      }

      .book-author {
        color: #718096;
        font-size: 0.9rem;
        margin-bottom: 1rem;
      }

      .book-rating {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 1rem;
      }

      .stars {
        display: flex;
        gap: 2px;
      }

      .star {
        color: #e2e8f0;
        font-size: 1rem;
      }

      .star.filled {
        color: #ffa500;
      }

      .rating-text {
        font-size: 0.8rem;
        color: #718096;
      }

      .book-description {
        color: #4a5568;
        font-size: 0.9rem;
        line-height: 1.5;
        margin-bottom: 1rem;
      }

      .book-details {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
      }

      .detail {
        font-size: 0.8rem;
        color: #718096;
        background: #f7fafc;
        padding: 4px 8px;
        border-radius: 4px;
      }

      .book-price {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .price-container {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      .current-price {
        font-size: 1.2rem;
        font-weight: 700;
        color: #ff6b35;
      }

      .original-price {
        font-size: 0.9rem;
        color: #a0aec0;
        text-decoration: line-through;
      }

      .newsletter {
        background: #2d3748;
        color: white;
        padding: 60px 0;
        text-align: center;
      }

      .newsletter h2 {
        margin-bottom: 1rem;
      }

      .newsletter p {
        margin-bottom: 2rem;
        opacity: 0.9;
      }

      .newsletter-form {
        display: flex;
        gap: 1rem;
        max-width: 500px;
        margin: 0 auto;
        flex-wrap: wrap;
        justify-content: center;
      }

      .newsletter-input {
        flex: 1;
        min-width: 250px;
        padding: 12px 20px;
        border: none;
        border-radius: 25px;
        font-size: 1rem;
      }

      @media (max-width: 768px) {
        .hero-books h1 {
          font-size: 2rem;
        }

        .books-grid {
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .filter-buttons {
          flex-direction: column;
          align-items: center;
        }

        .book-price {
          flex-direction: column;
          gap: 1rem;
          align-items: stretch;
        }

        .newsletter-form {
          flex-direction: column;
          align-items: center;
        }

        .newsletter-input {
          min-width: auto;
          width: 100%;
          max-width: 300px;
        }
      }
    `
  ]
})
export class LivrosComponent {
  activeFilter = 'todos';

  allBooks: Ebook[] = [
    {
      id: 'ser-pobre',
      title: 'Ser Pobre',
      author: 'Ondjaki',
      description:
        'Uma obra-prima da literatura angolana contemporânea que explora a vida urbana em Luanda.',
      price: 15000,
      image: '/assets/images/ser-pobre.jpg',
      category: 'Literatura Angolana',
      rating: 4.8,
      pages: 120,
      language: 'Português',
      featured: true
    },
    {
      id: 'ultimo-poeta',
      title: 'O Último Poeta',
      author: 'António Jacinto',
      description:
        'Poesia angolana clássica que marcou gerações e influenciou o movimento literário nacional.',
      price: 12000,
      image: '/assets/images/ultimo-poeta.jpg',
      category: 'Poesia',
      rating: 4.9,
      pages: 95,
      language: 'Português',
      featured: true
    },
    {
      id: 'alma-na-paixao',
      title: 'Alma na Paixão',
      author: 'Pepetela',
      description:
        'Romance histórico sobre a luta angolana pela independência, uma obra fundamental da literatura nacional.',
      price: 18000,
      originalPrice: 22000,
      image: '/assets/images/alma-na-paixao.jpg',
      category: 'Romance Histórico',
      rating: 4.7,
      pages: 280,
      language: 'Português'
    },
    {
      id: 'comeram-minha-banana',
      title: 'Comeram Minha Banana',
      author: 'Arlindo Barbeitos',
      description:
        'Contos angolanos cheios de humor e crítica social, uma leitura leve e reflexiva.',
      price: 14000,
      image: '/assets/images/comeram-minha-banana.jpg',
      category: 'Contos',
      rating: 4.5,
      pages: 160,
      language: 'Português'
    },
    {
      id: 'dom-casmurro',
      title: 'Dom Casmurro',
      author: 'Machado de Assis',
      description:
        'Clássico da literatura brasileira, uma obra-prima do realismo.',
      price: 16000,
      originalPrice: 20000,
      image: '/assets/images/dom-casmurro.jpg',
      category: 'Clássicos',
      rating: 4.6,
      pages: 320,
      language: 'Português'
    },
    {
      id: '1984',
      title: '1984',
      author: 'George Orwell',
      description:
        'Distopia clássica sobre vigilância, controle e liberdade individual.',
      price: 19000,
      image: '/assets/images/1984.jpg',
      category: 'Ficção Científica',
      rating: 4.8,
      pages: 328,
      language: 'Português'
    }
  ];

  get filteredBooks(): Ebook[] {
    switch (this.activeFilter) {
      case 'nacionais':
        return this.allBooks.filter(
          (book) =>
            book.category.includes('Angolana') ||
            book.category.includes('Poesia') ||
            book.category.includes('Contos') ||
            book.category.includes('Romance Histórico')
        );
      case 'internacionais':
        return this.allBooks.filter(
          (book) =>
            !book.category.includes('Angolana') &&
            !book.category.includes('Poesia') &&
            !book.category.includes('Contos') &&
            !book.category.includes('Romance Histórico')
        );
      case 'promocoes':
        return this.allBooks.filter(
          (book) => book.originalPrice && book.originalPrice > book.price
        );
      default:
        return this.allBooks;
    }
  }

  setFilter(filter: string) {
    this.activeFilter = filter;
  }

  getDiscountPercentage(book: Ebook): number {
    if (!book.originalPrice) return 0;
    return Math.round(
      ((book.originalPrice - book.price) / book.originalPrice) * 100
    );
  }

  onNewsletterSubmit(event: Event) {
    event.preventDefault();
    // Implementar lógica de newsletter
    alert(
      'Obrigado por se inscrever! Em breve você receberá nossas novidades.'
    );
  }
}

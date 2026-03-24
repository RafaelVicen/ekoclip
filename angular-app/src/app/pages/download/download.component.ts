import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Ebook {
  id: string;
  title: string;
  author: string;
  price: number;
  image: string;
}

@Component({
  selector: 'app-download',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="hero-download">
      <div class="container">
        <div class="hero-content">
          <h1>Download do Ebook</h1>
          <p>Finalize sua compra e baixe seu ebook instantaneamente</p>
        </div>
      </div>
    </section>

    <section class="download-section" *ngIf="ebook">
      <div class="container">
        <div class="download-content">
          <div class="ebook-preview">
            <img [src]="ebook.image" [alt]="ebook.title" class="ebook-image" />
            <div class="ebook-info">
              <h2>{{ ebook.title }}</h2>
              <p class="author">por {{ ebook.author }}</p>
              <p class="price">
                {{ ebook.price | currency: 'AOA' : 'symbol' : '1.0-0' }}
              </p>
            </div>
          </div>

          <div class="purchase-form">
            <h3>Finalizar Compra</h3>
            <form class="form" (ngSubmit)="onPurchase($event)">
              <div class="form-group">
                <label for="name">Nome completo *</label>
                <input
                  type="text"
                  id="name"
                  required
                  class="form-input"
                  placeholder="Digite seu nome"
                />
              </div>

              <div class="form-group">
                <label for="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  required
                  class="form-input"
                  placeholder="seu@email.com"
                />
              </div>

              <div class="form-group">
                <label for="phone">Telefone *</label>
                <input
                  type="tel"
                  id="phone"
                  required
                  class="form-input"
                  placeholder="+244 900 000 000"
                />
              </div>

              <div class="payment-methods">
                <h4>Forma de Pagamento</h4>
                <div class="payment-options">
                  <label class="payment-option">
                    <input type="radio" name="payment" value="card" checked />
                    <span class="checkmark"></span>
                    Cartão de Crédito/Débito
                  </label>
                  <label class="payment-option">
                    <input type="radio" name="payment" value="transfer" />
                    <span class="checkmark"></span>
                    Transferência Bancária
                  </label>
                  <label class="payment-option">
                    <input type="radio" name="payment" value="mobile" />
                    <span class="checkmark"></span>
                    Mobile Money
                  </label>
                </div>
              </div>

              <button
                type="submit"
                class="btn btn-primary btn-full"
                [disabled]="isProcessing"
              >
                {{ isProcessing ? 'Processando...' : 'Finalizar Compra' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>

    <section class="error-section" *ngIf="!ebook">
      <div class="container">
        <div class="error-content">
          <h2>Ebook não encontrado</h2>
          <p>
            O ebook solicitado não foi encontrado. Volte à livraria e tente
            novamente.
          </p>
          <a routerLink="/livros" class="btn btn-primary">Voltar à Livraria</a>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .hero-download {
        background: linear-gradient(135deg, #ff6b35, #e53e3e);
        color: white;
        padding: 80px 0;
        text-align: center;
      }

      .hero-download h1 {
        font-size: 3rem;
        margin-bottom: 1rem;
      }

      .hero-download p {
        font-size: 1.2rem;
        opacity: 0.9;
      }

      .download-section {
        padding: 80px 0;
        background: #f7fafc;
      }

      .download-content {
        max-width: 1000px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 3rem;
        align-items: start;
      }

      .ebook-preview {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        text-align: center;
      }

      .ebook-image {
        width: 200px;
        height: 300px;
        object-fit: cover;
        border-radius: 8px;
        margin-bottom: 1.5rem;
      }

      .ebook-info h2 {
        color: #2d3748;
        margin-bottom: 0.5rem;
      }

      .author {
        color: #718096;
        margin-bottom: 1rem;
      }

      .price {
        font-size: 1.5rem;
        font-weight: 700;
        color: #ff6b35;
      }

      .purchase-form {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }

      .purchase-form h3 {
        color: #2d3748;
        margin-bottom: 2rem;
        text-align: center;
      }

      .form-group {
        margin-bottom: 1.5rem;
      }

      .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: #2d3748;
      }

      .form-input {
        width: 100%;
        padding: 12px 16px;
        border: 2px solid #e2e8f0;
        border-radius: 8px;
        font-size: 1rem;
        transition: border-color 0.3s ease;
      }

      .form-input:focus {
        outline: none;
        border-color: #ff6b35;
      }

      .payment-methods {
        margin-bottom: 2rem;
      }

      .payment-methods h4 {
        margin-bottom: 1rem;
        color: #2d3748;
      }

      .payment-options {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .payment-option {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        cursor: pointer;
        padding: 0.75rem;
        border-radius: 8px;
        transition: background 0.3s ease;
      }

      .payment-option:hover {
        background: #f7fafc;
      }

      .payment-option input[type='radio'] {
        display: none;
      }

      .checkmark {
        width: 20px;
        height: 20px;
        border: 2px solid #e2e8f0;
        border-radius: 50%;
        position: relative;
      }

      .payment-option input[type='radio']:checked + .checkmark {
        border-color: #ff6b35;
      }

      .payment-option input[type='radio']:checked + .checkmark::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 10px;
        height: 10px;
        background: #ff6b35;
        border-radius: 50%;
      }

      .btn-full {
        width: 100%;
        padding: 16px;
        font-size: 1.1rem;
      }

      .error-section {
        padding: 80px 0;
        background: #f7fafc;
        text-align: center;
      }

      .error-content h2 {
        color: #e53e3e;
        margin-bottom: 1rem;
      }

      .error-content p {
        color: #4a5568;
        margin-bottom: 2rem;
      }

      @media (max-width: 968px) {
        .download-content {
          grid-template-columns: 1fr;
          gap: 2rem;
        }
      }

      @media (max-width: 768px) {
        .hero-download h1 {
          font-size: 2rem;
        }

        .ebook-image {
          width: 150px;
          height: 225px;
        }
      }
    `
  ]
})
export class DownloadComponent implements OnInit {
  ebook: Ebook | null = null;
  isProcessing = false;

  ebooks: Ebook[] = [
    {
      id: 'ser-pobre',
      title: 'Ser Pobre',
      author: 'Ondjaki',
      price: 15000,
      image: '/assets/images/ser-pobre.jpg'
    },
    {
      id: 'ultimo-poeta',
      title: 'O Último Poeta',
      author: 'António Jacinto',
      price: 12000,
      image: '/assets/images/ultimo-poeta.jpg'
    },
    {
      id: 'alma-na-paixao',
      title: 'Alma na Paixão',
      author: 'Pepetela',
      price: 18000,
      image: '/assets/images/alma-na-paixao.jpg'
    },
    {
      id: 'comeram-minha-banana',
      title: 'Comeram Minha Banana',
      author: 'Arlindo Barbeitos',
      price: 14000,
      image: '/assets/images/comeram-minha-banana.jpg'
    }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const ebookId = this.route.snapshot.paramMap.get('ebook');
    this.ebook = this.ebooks.find((e) => e.id === ebookId) || null;
  }

  onPurchase(event: Event) {
    event.preventDefault();

    if (this.isProcessing) return;

    this.isProcessing = true;

    // Simular processamento de pagamento
    setTimeout(() => {
      alert(
        'Compra realizada com sucesso! O download começará automaticamente.'
      );
      this.isProcessing = false;
      // Em produção, aqui seria implementado o download real
    }, 3000);
  }
}

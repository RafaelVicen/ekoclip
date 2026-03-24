import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contato',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Hero Section -->
    <section class="hero-contact">
      <div class="container">
        <div class="hero-content">
          <h1>Entre em Contato</h1>
          <p>
            Tem dúvidas, sugestões ou quer colaborar conosco? Estamos aqui para
            ajudar!
          </p>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="contact-section">
      <div class="container">
        <div class="contact-grid">
          <!-- Contact Form -->
          <div class="contact-form-container">
            <div class="card">
              <h2>Envie sua mensagem</h2>
              <form
                class="contact-form"
                (ngSubmit)="onSubmit($event)"
                #contactForm="ngForm"
              >
                <div class="form-group">
                  <label for="name">Nome completo *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    [(ngModel)]="contactFormData.name"
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
                    name="email"
                    [(ngModel)]="contactFormData.email"
                    required
                    email
                    class="form-input"
                    placeholder="seu@email.com"
                  />
                </div>

                <div class="form-group">
                  <label for="subject">Assunto *</label>
                  <select
                    id="subject"
                    name="subject"
                    [(ngModel)]="contactFormData.subject"
                    required
                    class="form-input"
                  >
                    <option value="">Selecione um assunto</option>
                    <option value="suporte">Suporte Técnico</option>
                    <option value="vendas">Vendas e Parcerias</option>
                    <option value="conteudo">Sugestões de Conteúdo</option>
                    <option value="parceria">Proposta de Parceria</option>
                    <option value="outros">Outros</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="message">Mensagem *</label>
                  <textarea
                    id="message"
                    name="message"
                    [(ngModel)]="contactFormData.message"
                    required
                    class="form-textarea"
                    rows="6"
                    placeholder="Digite sua mensagem aqui..."
                  ></textarea>
                </div>

                <div class="form-group checkbox-group">
                  <label class="checkbox-label">
                    <input
                      type="checkbox"
                      name="newsletter"
                      [(ngModel)]="contactFormData.newsletter"
                      class="checkbox-input"
                    />
                    <span class="checkmark"></span>
                    Quero receber novidades e atualizações por email
                  </label>
                </div>

                <button
                  type="submit"
                  class="btn btn-primary btn-full"
                  [disabled]="!contactForm.valid || isSubmitting"
                >
                  {{ isSubmitting ? 'Enviando...' : 'Enviar Mensagem' }}
                </button>
              </form>
            </div>
          </div>

          <!-- Contact Info -->
          <div class="contact-info">
            <div class="info-card">
              <h3>Informações de Contato</h3>
              <div class="info-item">
                <div class="info-icon">📧</div>
                <div>
                  <strong>Email</strong>
                  <p>contato@ekoclip.netlify.app</p>
                </div>
              </div>

              <div class="info-item">
                <div class="info-icon">📱</div>
                <div>
                  <strong>Telefone</strong>
                  <p>+244 923 456 789</p>
                </div>
              </div>

              <div class="info-item">
                <div class="info-icon">📍</div>
                <div>
                  <strong>Localização</strong>
                  <p>Luanda, Angola</p>
                </div>
              </div>
            </div>

            <div class="info-card">
              <h3>Horário de Atendimento</h3>
              <div class="schedule-item">
                <span class="day">Segunda - Sexta</span>
                <span class="hours">9:00 - 18:00</span>
              </div>
              <div class="schedule-item">
                <span class="day">Sábado</span>
                <span class="hours">9:00 - 14:00</span>
              </div>
              <div class="schedule-item">
                <span class="day">Domingo</span>
                <span class="hours">Fechado</span>
              </div>
            </div>

            <div class="info-card">
              <h3>Redes Sociais</h3>
              <div class="social-links">
                <a href="#" class="social-link" aria-label="Facebook">
                  <span class="social-icon">📘</span>
                  Facebook
                </a>
                <a href="#" class="social-link" aria-label="Instagram">
                  <span class="social-icon">📷</span>
                  Instagram
                </a>
                <a href="#" class="social-link" aria-label="Twitter">
                  <span class="social-icon">🐦</span>
                  Twitter
                </a>
                <a href="#" class="social-link" aria-label="YouTube">
                  <span class="social-icon">📺</span>
                  YouTube
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="faq-section">
      <div class="container">
        <h2 class="section-title">Perguntas Frequentes</h2>
        <div class="faq-grid">
          <div
            class="faq-item"
            *ngFor="let faq of faqs"
            (click)="toggleFaq(faq)"
          >
            <div class="faq-question">
              <h3>{{ faq.question }}</h3>
              <span class="faq-toggle" [class.active]="faq.isOpen">+</span>
            </div>
            <div class="faq-answer" [class.active]="faq.isOpen">
              <p>{{ faq.answer }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .hero-contact {
        background: linear-gradient(135deg, #ff6b35, #e53e3e);
        color: white;
        padding: 80px 0;
        text-align: center;
      }

      .hero-contact h1 {
        font-size: 3rem;
        margin-bottom: 1rem;
      }

      .hero-contact p {
        font-size: 1.2rem;
        opacity: 0.9;
        max-width: 600px;
        margin: 0 auto;
      }

      .contact-section {
        padding: 80px 0;
        background: #f7fafc;
      }

      .contact-grid {
        display: grid;
        grid-template-columns: 1fr 400px;
        gap: 3rem;
        align-items: start;
      }

      .contact-form-container {
        flex: 1;
      }

      .contact-form h2 {
        margin-bottom: 2rem;
        color: #2d3748;
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

      .form-input,
      .form-textarea {
        width: 100%;
        padding: 12px 16px;
        border: 2px solid #e2e8f0;
        border-radius: 8px;
        font-size: 1rem;
        transition: border-color 0.3s ease;
        font-family: inherit;
      }

      .form-input:focus,
      .form-textarea:focus {
        outline: none;
        border-color: #ff6b35;
      }

      .form-textarea {
        resize: vertical;
        min-height: 120px;
      }

      .checkbox-group {
        display: flex;
        align-items: center;
      }

      .checkbox-label {
        display: flex;
        align-items: center;
        cursor: pointer;
        font-weight: normal;
        gap: 0.5rem;
      }

      .checkbox-input {
        display: none;
      }

      .checkmark {
        width: 20px;
        height: 20px;
        border: 2px solid #e2e8f0;
        border-radius: 4px;
        position: relative;
        transition: all 0.3s ease;
      }

      .checkbox-input:checked + .checkmark {
        background: #ff6b35;
        border-color: #ff6b35;
      }

      .checkbox-input:checked + .checkmark::after {
        content: '✓';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-size: 12px;
        font-weight: bold;
      }

      .btn-full {
        width: 100%;
        padding: 16px;
        font-size: 1.1rem;
      }

      .contact-info {
        display: flex;
        flex-direction: column;
        gap: 2rem;
      }

      .info-card {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }

      .info-card h3 {
        margin-bottom: 1.5rem;
        color: #2d3748;
      }

      .info-item {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        margin-bottom: 1.5rem;
      }

      .info-item:last-child {
        margin-bottom: 0;
      }

      .info-icon {
        font-size: 1.5rem;
        flex-shrink: 0;
      }

      .info-item strong {
        display: block;
        color: #2d3748;
        margin-bottom: 0.25rem;
      }

      .info-item p {
        color: #4a5568;
        margin: 0;
      }

      .schedule-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem 0;
        border-bottom: 1px solid #e2e8f0;
      }

      .schedule-item:last-child {
        border-bottom: none;
      }

      .day {
        font-weight: 600;
        color: #2d3748;
      }

      .hours {
        color: #4a5568;
      }

      .social-links {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .social-link {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem;
        border-radius: 8px;
        text-decoration: none;
        color: #4a5568;
        transition: all 0.3s ease;
      }

      .social-link:hover {
        background: #f7fafc;
        color: #ff6b35;
      }

      .social-icon {
        font-size: 1.2rem;
      }

      .faq-section {
        padding: 80px 0;
        background: white;
      }

      .faq-grid {
        max-width: 800px;
        margin: 0 auto;
      }

      .faq-item {
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        margin-bottom: 1rem;
        overflow: hidden;
        cursor: pointer;
        transition: box-shadow 0.3s ease;
      }

      .faq-item:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      .faq-question {
        padding: 1.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #f7fafc;
      }

      .faq-question h3 {
        margin: 0;
        font-size: 1.1rem;
        color: #2d3748;
      }

      .faq-toggle {
        font-size: 1.5rem;
        font-weight: bold;
        color: #ff6b35;
        transition: transform 0.3s ease;
      }

      .faq-toggle.active {
        transform: rotate(45deg);
      }

      .faq-answer {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease;
        background: white;
      }

      .faq-answer.active {
        max-height: 200px;
      }

      .faq-answer p {
        padding: 1.5rem;
        margin: 0;
        color: #4a5568;
        line-height: 1.6;
      }

      @media (max-width: 968px) {
        .contact-grid {
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        .contact-info {
          order: -1;
        }
      }

      @media (max-width: 768px) {
        .hero-contact h1 {
          font-size: 2rem;
        }

        .info-item {
          flex-direction: column;
          text-align: center;
          gap: 0.5rem;
        }

        .schedule-item {
          flex-direction: column;
          gap: 0.25rem;
          text-align: center;
        }

        .social-links {
          align-items: center;
        }
      }
    `
  ]
})
export class ContatoComponent {
  contactFormData = {
    name: '',
    email: '',
    subject: '',
    message: '',
    newsletter: false
  };

  isSubmitting = false;

  faqs = [
    {
      question: 'Como posso comprar ebooks?',
      answer:
        'Para comprar ebooks, navegue até a seção Livros, selecione o ebook desejado e clique em "Comprar Agora". Você será redirecionado para a página de checkout onde poderá finalizar a compra.',
      isOpen: false
    },
    {
      question: 'Quais são as formas de pagamento aceitas?',
      answer:
        'Aceitamos pagamentos via cartão de crédito, débito, transferência bancária e mobile money (para Angola). Todas as transações são processadas de forma segura.',
      isOpen: false
    },
    {
      question: 'Como faço o download dos ebooks após a compra?',
      answer:
        'Após a confirmação do pagamento, você receberá um email com o link de download. O link também ficará disponível na sua conta no site.',
      isOpen: false
    },
    {
      question: 'Posso devolver um ebook se não gostar?',
      answer:
        'Oferecemos garantia de satisfação de 7 dias. Se você não ficar satisfeito com o ebook, entre em contato conosco para solicitar o reembolso.',
      isOpen: false
    },
    {
      question: 'Como posso sugerir novos conteúdos?',
      answer:
        'Adoramos ouvir sugestões! Use o formulário de contato acima selecionando "Sugestões de Conteúdo" no campo assunto.',
      isOpen: false
    },
    {
      question: 'Vocês oferecem suporte para autores angolanos?',
      answer:
        'Sim! Temos um programa especial para autores angolanos. Entre em contato conosco para saber mais sobre como publicar seus trabalhos conosco.',
      isOpen: false
    }
  ];

  onSubmit(event: Event) {
    event.preventDefault();

    if (this.isSubmitting) return;

    this.isSubmitting = true;

    // Simular envio do formulário
    setTimeout(() => {
      alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
      this.contactFormData = {
        name: '',
        email: '',
        subject: '',
        message: '',
        newsletter: false
      };
      this.isSubmitting = false;
    }, 2000);
  }

  toggleFaq(faq: any) {
    faq.isOpen = !faq.isOpen;
  }
}

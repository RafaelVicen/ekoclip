import { Component } from '@angular/core';

@Component({
  selector: 'app-politica-privacidade',
  standalone: true,
  template: `
    <section class="hero-privacy">
      <div class="container">
        <div class="hero-content">
          <h1>Política de Privacidade</h1>
          <p>Como protegemos suas informações pessoais</p>
        </div>
      </div>
    </section>

    <section class="privacy-section">
      <div class="container">
        <div class="privacy-content">
          <div class="privacy-item">
            <h2>1. Informações que Coletamos</h2>
            <p>
              Coletamos informações que você nos fornece diretamente, como nome,
              email e informações de pagamento quando você faz uma compra.
            </p>
          </div>

          <div class="privacy-item">
            <h2>2. Como Usamos suas Informações</h2>
            <p>
              Usamos suas informações para processar pedidos, fornecer suporte
              ao cliente, enviar comunicações de marketing (com seu
              consentimento) e melhorar nossos serviços.
            </p>
          </div>

          <div class="privacy-item">
            <h2>3. Compartilhamento de Informações</h2>
            <p>
              Não vendemos, alugamos ou compartilhamos suas informações pessoais
              com terceiros, exceto quando necessário para processar pagamentos
              ou conforme exigido por lei.
            </p>
          </div>

          <div class="privacy-item">
            <h2>4. Segurança de Dados</h2>
            <p>
              Implementamos medidas de segurança técnicas e organizacionais
              apropriadas para proteger suas informações pessoais contra acesso
              não autorizado, alteração, divulgação ou destruição.
            </p>
          </div>

          <div class="privacy-item">
            <h2>5. Cookies</h2>
            <p>
              Usamos cookies para melhorar sua experiência no site, lembrar suas
              preferências e analisar o tráfego do site.
            </p>
          </div>

          <div class="privacy-item">
            <h2>6. Seus Direitos</h2>
            <p>
              Você tem o direito de acessar, corrigir, excluir ou restringir o
              processamento de suas informações pessoais. Entre em contato
              conosco para exercer esses direitos.
            </p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .hero-privacy {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 80px 0;
        text-align: center;
      }

      .hero-privacy h1 {
        font-size: 3rem;
        margin-bottom: 1rem;
      }

      .hero-privacy p {
        font-size: 1.2rem;
        opacity: 0.9;
      }

      .privacy-section {
        padding: 80px 0;
        background: #f7fafc;
      }

      .privacy-content {
        max-width: 800px;
        margin: 0 auto;
      }

      .privacy-item {
        background: white;
        padding: 2rem;
        margin-bottom: 2rem;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }

      .privacy-item h2 {
        color: #2d3748;
        margin-bottom: 1rem;
      }

      .privacy-item p {
        color: #4a5568;
        line-height: 1.6;
      }

      @media (max-width: 768px) {
        .hero-privacy h1 {
          font-size: 2rem;
        }

        .privacy-item {
          padding: 1.5rem;
        }
      }
    `
  ]
})
export class PoliticaPrivacidadeComponent {}

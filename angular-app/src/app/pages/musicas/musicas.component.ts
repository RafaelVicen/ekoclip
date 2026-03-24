import { Component } from '@angular/core';

@Component({
  selector: 'app-musicas',
  standalone: true,
  template: `
    <section class="hero-musicas">
      <div class="container">
        <div class="hero-content">
          <h1>Músicas Angolanas</h1>
          <p>
            Descubra e baixe as melhores músicas angolanas. De Kizomba a Hip
            Hop, temos tudo que você precisa.
          </p>
        </div>
      </div>
    </section>

    <section class="musicas-section">
      <div class="container">
        <div class="coming-soon">
          <h2>Em Breve</h2>
          <p>
            Estamos trabalhando para trazer a você a melhor coleção de músicas
            angolanas. Volte em breve!
          </p>
          <div class="features">
            <div class="feature">
              <h3>🎵 Músicas Exclusivas</h3>
              <p>Faixas exclusivas de artistas angolanos</p>
            </div>
            <div class="feature">
              <h3>🎧 Áudio de Qualidade</h3>
              <p>Downloads em alta qualidade</p>
            </div>
            <div class="feature">
              <h3>💰 Preços Acessíveis</h3>
              <p>Músicas a partir de 5.000 Kz</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .hero-musicas {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 80px 0;
        text-align: center;
      }

      .hero-musicas h1 {
        font-size: 3rem;
        margin-bottom: 1rem;
      }

      .hero-musicas p {
        font-size: 1.2rem;
        opacity: 0.9;
        max-width: 600px;
        margin: 0 auto;
      }

      .musicas-section {
        padding: 80px 0;
        background: #f7fafc;
        text-align: center;
      }

      .coming-soon h2 {
        font-size: 2.5rem;
        color: #2d3748;
        margin-bottom: 1rem;
      }

      .coming-soon p {
        font-size: 1.2rem;
        color: #4a5568;
        margin-bottom: 3rem;
        max-width: 600px;
        margin-left: auto;
        margin-right: auto;
      }

      .features {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
        max-width: 800px;
        margin: 0 auto;
      }

      .feature {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }

      .feature h3 {
        color: #2d3748;
        margin-bottom: 1rem;
      }

      .feature p {
        color: #4a5568;
      }
    `
  ]
})
export class MusicasComponent {}

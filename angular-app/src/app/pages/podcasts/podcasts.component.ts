import { Component } from '@angular/core';

@Component({
  selector: 'app-podcasts',
  standalone: true,
  template: `
    <section class="hero-podcasts">
      <div class="container">
        <div class="hero-content">
          <h1>Podcasts Angolanos</h1>
          <p>
            Entrevistas exclusivas com artistas, escritores e personalidades da
            cultura angolana.
          </p>
        </div>
      </div>
    </section>

    <section class="podcasts-section">
      <div class="container">
        <div class="coming-soon">
          <h2>Em Breve</h2>
          <p>
            Estamos preparando uma incrível coleção de podcasts sobre cultura
            angolana. Fique ligado!
          </p>
          <div class="features">
            <div class="feature">
              <h3>🎙️ Entrevistas Exclusivas</h3>
              <p>Conversas com artistas e criadores angolanos</p>
            </div>
            <div class="feature">
              <h3>🎧 Áudio Premium</h3>
              <p>Qualidade de estúdio profissional</p>
            </div>
            <div class="feature">
              <h3>📱 Multiplataforma</h3>
              <p>Disponível em todas as plataformas</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .hero-podcasts {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        color: white;
        padding: 80px 0;
        text-align: center;
      }

      .hero-podcasts h1 {
        font-size: 3rem;
        margin-bottom: 1rem;
      }

      .hero-podcasts p {
        font-size: 1.2rem;
        opacity: 0.9;
        max-width: 600px;
        margin: 0 auto;
      }

      .podcasts-section {
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
export class PodcastsComponent {}

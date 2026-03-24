import { Component } from '@angular/core';

@Component({
  selector: 'app-sobre',
  standalone: true,
  template: `
    <section class="hero-sobre">
      <div class="container">
        <div class="hero-content">
          <h1>Sobre o EkoClip</h1>
          <p>O eco da nova geração da cultura angolana</p>
        </div>
      </div>
    </section>

    <section class="sobre-section">
      <div class="container">
        <div class="sobre-content">
          <div class="missao">
            <h2>Nossa Missão</h2>
            <p>
              Conectar artistas, criadores e audiência através da música,
              literatura e mídia digital angolana, promovendo a cultura nacional
              e apoiando talentos locais.
            </p>
          </div>

          <div class="valores">
            <h2>Nossos Valores</h2>
            <div class="valores-grid">
              <div class="valor">
                <h3>🇦🇴 Autenticidade</h3>
                <p>Valorizamos a cultura angolana genuína e autêntica.</p>
              </div>
              <div class="valor">
                <h3>🎨 Criatividade</h3>
                <p>Incentivamos a inovação e expressão artística.</p>
              </div>
              <div class="valor">
                <h3>🤝 Comunidade</h3>
                <p>Construímos pontes entre artistas e público.</p>
              </div>
              <div class="valor">
                <h3>🌟 Qualidade</h3>
                <p>Oferecemos apenas o melhor conteúdo possível.</p>
              </div>
            </div>
          </div>

          <div class="equipe">
            <h2>Nossa Equipe</h2>
            <p>
              Uma equipe apaixonada por cultura angolana, composta por artistas,
              escritores, desenvolvedores e profissionais de marketing digital.
            </p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .hero-sobre {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        color: white;
        padding: 80px 0;
        text-align: center;
      }

      .hero-sobre h1 {
        font-size: 3rem;
        margin-bottom: 1rem;
      }

      .hero-sobre p {
        font-size: 1.2rem;
        opacity: 0.9;
        max-width: 600px;
        margin: 0 auto;
      }

      .sobre-section {
        padding: 80px 0;
        background: #f7fafc;
      }

      .sobre-content {
        max-width: 800px;
        margin: 0 auto;
      }

      .missao,
      .valores,
      .equipe {
        margin-bottom: 4rem;
      }

      .missao h2,
      .valores h2,
      .equipe h2 {
        color: #2d3748;
        margin-bottom: 1.5rem;
        text-align: center;
      }

      .missao p,
      .equipe p {
        font-size: 1.1rem;
        line-height: 1.6;
        color: #4a5568;
        text-align: center;
      }

      .valores-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 2rem;
      }

      .valor {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        text-align: center;
      }

      .valor h3 {
        color: #2d3748;
        margin-bottom: 1rem;
      }

      .valor p {
        color: #4a5568;
      }

      @media (max-width: 768px) {
        .hero-sobre h1 {
          font-size: 2rem;
        }

        .valores-grid {
          grid-template-columns: 1fr;
        }
      }
    `
  ]
})
export class SobreComponent {}

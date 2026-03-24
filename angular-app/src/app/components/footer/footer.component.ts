import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h3>EkoClip</h3>
            <p>
              O eco da nova geração da cultura angolana. Conectando artistas,
              criadores e audiência através da música, literatura e mídia
              digital.
            </p>
          </div>

          <div class="footer-section">
            <h3>Navegação</h3>
            <ul>
              <li><a routerLink="/">Início</a></li>
              <li><a routerLink="/musicas">Músicas</a></li>
              <li><a routerLink="/podcasts">Podcasts</a></li>
              <li><a routerLink="/livros">Livros</a></li>
              <li><a routerLink="/sobre-nos">Sobre Nós</a></li>
            </ul>
          </div>

          <div class="footer-section">
            <h3>Conteúdo</h3>
            <ul>
              <li><a routerLink="/musicas">Artistas Angolanos</a></li>
              <li><a routerLink="/podcasts">Entrevistas</a></li>
              <li><a routerLink="/livros">Literatura Nacional</a></li>
              <li><a routerLink="/contato">Contato</a></li>
            </ul>
          </div>

          <div class="footer-section">
            <h3>Legal</h3>
            <ul>
              <li>
                <a routerLink="/politica-privacidade"
                  >Política de Privacidade</a
                >
              </li>
              <li><a href="#" onclick="return false;">Termos de Uso</a></li>
              <li><a href="#" onclick="return false;">Direitos Autorais</a></li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          <p>
            &copy; 2024 EkoClip. Todos os direitos reservados. | Desenvolvido
            com ❤️ para a cultura angolana.
          </p>
        </div>
      </div>
    </footer>
  `,
  styles: [
    `
      .footer {
        background: #2d3748;
        color: white;
        padding: 60px 0 30px;
        margin-top: auto;
      }

      .footer-content {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 40px;
        margin-bottom: 40px;
      }

      .footer-section h3 {
        margin-bottom: 20px;
        color: #ff6b35;
        font-size: 1.2rem;
        font-weight: 700;
      }

      .footer-section p {
        color: #cbd5e0;
        line-height: 1.6;
        margin-bottom: 20px;
      }

      .footer-section ul {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .footer-section ul li {
        margin-bottom: 10px;
      }

      .footer-section a {
        color: #cbd5e0;
        text-decoration: none;
        transition: color 0.3s ease;
        font-size: 0.95rem;
      }

      .footer-section a:hover {
        color: #ff6b35;
      }

      .footer-bottom {
        border-top: 1px solid #4a5568;
        padding-top: 30px;
        text-align: center;
        color: #a0aec0;
        font-size: 0.9rem;
      }

      @media (max-width: 768px) {
        .footer {
          padding: 40px 0 20px;
        }

        .footer-content {
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 30px;
        }

        .footer-section h3 {
          font-size: 1.1rem;
        }
      }

      @media (max-width: 480px) {
        .footer-content {
          grid-template-columns: 1fr;
          gap: 20px;
        }

        .footer-section {
          text-align: center;
        }
      }
    `
  ]
})
export class FooterComponent {}

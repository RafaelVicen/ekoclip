import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <header class="header" [class.scrolled]="isScrolled">
      <nav class="nav container">
        <a routerLink="/" class="logo">EkoClip</a>
        <ul class="nav-links">
          <li>
            <a
              routerLink="/"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: true }"
              >Início</a
            >
          </li>
          <li>
            <a routerLink="/musicas" routerLinkActive="active">Músicas</a>
          </li>
          <li>
            <a routerLink="/podcasts" routerLinkActive="active">Podcasts</a>
          </li>
          <li><a routerLink="/livros" routerLinkActive="active">Livros</a></li>
          <li>
            <a routerLink="/sobre-nos" routerLinkActive="active">Sobre Nós</a>
          </li>
          <li>
            <a routerLink="/contato" routerLinkActive="active">Contato</a>
          </li>
        </ul>
        <button
          class="btn btn-secondary mobile-menu-toggle"
          (click)="toggleMobileMenu()"
        >
          <span class="hamburger" [class.active]="isMobileMenuOpen"></span>
        </button>
      </nav>

      <!-- Mobile Menu -->
      <div class="mobile-menu" [class.active]="isMobileMenuOpen">
        <ul class="mobile-nav-links">
          <li>
            <a
              routerLink="/"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: true }"
              (click)="closeMobileMenu()"
              >Início</a
            >
          </li>
          <li>
            <a
              routerLink="/musicas"
              routerLinkActive="active"
              (click)="closeMobileMenu()"
              >Músicas</a
            >
          </li>
          <li>
            <a
              routerLink="/podcasts"
              routerLinkActive="active"
              (click)="closeMobileMenu()"
              >Podcasts</a
            >
          </li>
          <li>
            <a
              routerLink="/livros"
              routerLinkActive="active"
              (click)="closeMobileMenu()"
              >Livros</a
            >
          </li>
          <li>
            <a
              routerLink="/sobre-nos"
              routerLinkActive="active"
              (click)="closeMobileMenu()"
              >Sobre Nós</a
            >
          </li>
          <li>
            <a
              routerLink="/contato"
              routerLinkActive="active"
              (click)="closeMobileMenu()"
              >Contato</a
            >
          </li>
        </ul>
      </div>
    </header>
  `,
  styles: [
    `
      .header {
        position: fixed;
        top: 0;
        width: 100%;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        transition: all 0.3s ease;
      }

      .header.scrolled {
        background: white;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      }

      .nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 0;
      }

      .logo {
        font-size: 1.8rem;
        font-weight: 700;
        color: #ff6b35;
        text-decoration: none;
      }

      .nav-links {
        display: flex;
        list-style: none;
        gap: 2rem;
        margin: 0;
        padding: 0;
      }

      .nav-links a {
        font-weight: 600;
        color: #2d3748;
        text-decoration: none;
        transition: color 0.3s ease;
        position: relative;
      }

      .nav-links a:hover,
      .nav-links a.active {
        color: #ff6b35;
      }

      .nav-links a.active::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 0;
        width: 100%;
        height: 2px;
        background: #ff6b35;
        border-radius: 1px;
      }

      .mobile-menu-toggle {
        display: none;
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.5rem;
      }

      .hamburger {
        display: block;
        width: 25px;
        height: 3px;
        background: #2d3748;
        position: relative;
        transition: background 0.3s ease;
      }

      .hamburger::before,
      .hamburger::after {
        content: '';
        position: absolute;
        width: 25px;
        height: 3px;
        background: #2d3748;
        transition: all 0.3s ease;
      }

      .hamburger::before {
        top: -8px;
      }

      .hamburger::after {
        top: 8px;
      }

      .hamburger.active {
        background: transparent;
      }

      .hamburger.active::before {
        top: 0;
        transform: rotate(45deg);
      }

      .hamburger.active::after {
        top: 0;
        transform: rotate(-45deg);
      }

      .mobile-menu {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        background: white;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        transform: translateY(-100%);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
      }

      .mobile-menu.active {
        transform: translateY(0);
        opacity: 1;
        visibility: visible;
      }

      .mobile-nav-links {
        list-style: none;
        padding: 1rem 0;
        margin: 0;
      }

      .mobile-nav-links li {
        border-bottom: 1px solid #e2e8f0;
      }

      .mobile-nav-links li:last-child {
        border-bottom: none;
      }

      .mobile-nav-links a {
        display: block;
        padding: 1rem 2rem;
        color: #2d3748;
        text-decoration: none;
        font-weight: 600;
        transition: background 0.3s ease;
      }

      .mobile-nav-links a:hover,
      .mobile-nav-links a.active {
        background: #f7fafc;
        color: #ff6b35;
      }

      @media (max-width: 768px) {
        .nav-links {
          display: none;
        }

        .mobile-menu-toggle {
          display: block;
        }

        .mobile-menu {
          display: block;
        }
      }
    `
  ]
})
export class HeaderComponent {
  isScrolled = false;
  isMobileMenuOpen = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }
}

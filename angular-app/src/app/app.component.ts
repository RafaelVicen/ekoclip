import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <app-header></app-header>
    <main>
      <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
  `,
  styles: [
    `
      main {
        min-height: calc(100vh - 200px);
      }
    `
  ],
  providers: [provideRouter(routes)]
})
export class AppComponent {
  title = 'EkoClip - O Eco da Nova Geração da Cultura Angolana';
}

import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LivrosComponent } from './pages/livros/livros.component';
import { MusicasComponent } from './pages/musicas/musicas.component';
import { PodcastsComponent } from './pages/podcasts/podcasts.component';
import { SobreComponent } from './pages/sobre/sobre.component';
import { ContatoComponent } from './pages/contato/contato.component';
import { PoliticaPrivacidadeComponent } from './pages/politica-privacidade/politica-privacidade.component';
import { DownloadComponent } from './pages/download/download.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'livros', component: LivrosComponent },
  { path: 'musicas', component: MusicasComponent },
  { path: 'podcasts', component: PodcastsComponent },
  { path: 'sobre-nos', component: SobreComponent },
  { path: 'contato', component: ContatoComponent },
  { path: 'politica-privacidade', component: PoliticaPrivacidadeComponent },
  { path: 'download/:ebook', component: DownloadComponent },
  { path: '**', redirectTo: '' }
];

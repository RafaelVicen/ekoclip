# EkoClip - O Portal da Cultura Digital Angolana

> O eco da nova geração da cultura angolana.

Este é o repositório oficial do código-fonte do website EkoClip, uma plataforma moderna e dinâmica dedicada ao entretenimento, cultura e mídia digital de Angola.

### 🚀 [Aceda ao site ao vivo aqui!](https://ekoclip.netlify.app/)

---

## 📝 Sobre o Projeto

O EkoClip foi criado para ser o ponto de encontro digital para a juventude angolana, reunindo as últimas notícias, os melhores cortes de podcasts, lançamentos musicais e a agenda de eventos culturais. O site reflete a energia, autenticidade e humor leve que caracterizam o conteúdo do canal.

## ✨ Funcionalidades Principais

- **Notícias e Destaques:** Uma secção "Em Alta" com as notícias e vídeos mais populares do momento.
- **Podcasts e Cortes:** Galeria de vídeos do YouTube com um sistema de filtros dinâmico para navegar entre programas como o Fly Podcast, Calado Show e conteúdos exclusivos.
- **Músicas e Downloads Monetizados:** Uma lista de músicas de artistas angolanos com páginas de download dedicadas, preparadas para monetização através de anúncios.
- **Agenda de Eventos:** Destaques dos principais eventos culturais e artísticos a acontecer em Angola.
- **Formulário de Contato Funcional:** Integrado com o serviço Formspree para receber mensagens e propostas de parceria diretamente no email.
- **Design Responsivo:** O site é totalmente compatível com qualquer tamanho de tela, desde telemóveis a monitores largos, graças a um menu "hambúrguer" e grids flexíveis.

## 💻 Tecnologias Utilizadas

Este é um site estático, construído com tecnologias web fundamentais, o que o torna extremamente rápido e seguro.

- **HTML5:** Para a estrutura e semântica do conteúdo.
- **CSS3:** Para o estilo, layout responsivo e animações subtis.
- **JavaScript (ES6):** Para a interatividade, como o filtro de podcasts e o menu móvel.
- **Git & GitHub:** Para controlo de versões e alojamento do código.
- **Netlify:** Para a hospedagem e publicação contínua (Continuous Deployment) do site.

## 🛠️ Como Executar o Projeto Localmente

Para explorar o código ou fazer modificações, siga estes passos:

1.  Clone o repositório para a sua máquina local:
    ```bash
    git clone [https://github.com/RafaelVicen/ekoclip.git](https://github.com/RafaelVicen/ekoclip.git)
    ```
2.  Navegue para a pasta do projeto:
    ```bash
    cd ekoclip
    ```
3.  Abra o ficheiro `index.html` no seu navegador de internet. E já está!

## 🔮 Planos Futuros

O EkoClip é um projeto em constante evolução. Os próximos passos planeados incluem:

- **Implementar "EkoCharts":** Um ranking semanal das músicas mais baixadas no site.
- **Criar uma "Zona de Talentos":** Um espaço para novos artistas enviarem as suas demos.
- **Automatizar a Adição de Conteúdo:** Evoluir a estrutura para um Headless CMS (como Strapi ou Sanity) para permitir a gestão de músicas e notícias através de um painel de administração, sem necessidade de editar o código manualmente.

## 👤 Autor

**Rafael Vicente**

- **GitHub:** [@RafaelVicen](https://github.com/RafaelVicen)

---

## 🚀 Modernização com Angular

O projeto EkoClip foi completamente modernizado com **Angular 17**, oferecendo uma experiência web mais avançada e escalável.

### ✨ Melhorias da Versão Angular

- **Componentes Standalone:** Arquitetura moderna com componentes independentes
- **TypeScript Completo:** Desenvolvimento type-safe e mais robusto
- **Design System Consistente:** Sistema de design unificado com SCSS e variáveis CSS
- **Performance Otimizada:** Lazy loading, code splitting e build otimizado
- **PWA Ready:** Preparado para Progressive Web App com service worker
- **SEO Aprimorado:** Meta tags dinâmicas e otimização para motores de busca
- **Mobile-First:** Design responsivo aprimorado para dispositivos móveis
- **Acessibilidade:** Conformidade com padrões WCAG 2.1

### 📁 Estrutura da Nova Versão

```
angular-app/
├── src/app/
│   ├── components/     # Componentes compartilhados (Header, Footer)
│   ├── pages/         # Páginas principais (Home, Livros, Música, etc.)
│   ├── services/      # Serviços para dados e APIs
│   ├── models/        # Interfaces TypeScript
│   └── guards/        # Proteção de rotas
├── netlify.toml       # Configuração de deploy
└── angular.json       # Configuração Angular CLI
```

### 🛠️ Como Executar a Versão Angular

1. **Instalar dependências:**

   ```bash
   cd angular-app
   npm install
   ```

2. **Executar em desenvolvimento:**

   ```bash
   npm start
   ```

3. **Build para produção:**
   ```bash
   npm run build
   ```

### 🔄 Migração

Para migrar da versão HTML estática para Angular:

```bash
# Executar script de migração
./migrate-to-angular.sh

# Ou seguir o guia completo
cat DEPLOY_GUIDE.md
```

### 📊 Comparação de Funcionalidades

| Funcionalidade            | HTML Estático | Angular Moderno |
| ------------------------- | ------------- | --------------- |
| Componentes Reutilizáveis | ❌            | ✅              |
| TypeScript                | ❌            | ✅              |
| Forms Reativos            | ❌            | ✅              |
| Lazy Loading              | ❌            | ✅              |
| PWA Support               | ⚠️ Básico     | ✅ Completo     |
| SEO Dinâmico              | ❌            | ✅              |
| Testes Automatizados      | ❌            | ✅              |
| Build Otimizado           | ⚠️ Manual     | ✅ Automático   |

---

# EkoClip - O Portal da Cultura Digital Angolana

> O eco da nova geração da cultura angolana.

Este é o repositório oficial do código-fonte do website **EkoClip**, uma plataforma moderna e dinâmica dedicada ao entretenimento, cultura e mídia digital de Angola.

**Site ao vivo:** [https://ekoclip.netlify.app/](https://ekoclip.netlify.app/)

---

## 📝 Sobre o Projeto

O EkoClip foi desenvolvido para ser o ponto de encontro digital para a juventude angolana, reunindo notícias, cortes de podcasts, lançamentos musicais e a agenda de eventos culturais. O site foi projetado para ser rápido, seguro e totalmente responsivo.

## ✨ Funcionalidades Principais

- **Conteúdo Dinâmico:** Uma secção de "Últimas Notícias" que é atualizada automaticamente a partir do Feed RSS do portal PlatinaLine, utilizando Funções Serverless do Netlify.
- **Podcasts e Cortes:** Galeria de vídeos do YouTube com um sistema de filtros dinâmico para navegar entre diferentes programas.
- **Músicas e Downloads Monetizados:** Uma lista de músicas de artistas angolanos com páginas de download dedicadas, preparadas para monetização através de blocos de anúncios do Google AdSense.
- **Design Responsivo:** A interface é 100% adaptável a qualquer tamanho de tela, desde telemóveis a desktops, com um menu "hambúrguer" para navegação móvel.
- **Ferramentas de Marketing Integradas:** O site está equipado com Google Tag Manager, Google Ads (Remarketing) e Meta Pixel para análise de tráfego e campanhas de marketing.

## 💻 Tecnologias Utilizadas

- **Front-End:** HTML5, CSS3, JavaScript (ES6)
- **Back-End (Serverless):** Funções Netlify (Node.js) para automação de conteúdo.
- **Controlo de Versões:** Git
- **Hospedagem de Código:** GitHub
- **Hospedagem e CI/CD:** Netlify
- **Análise e Marketing:** Google Tag Manager, Google Ads, Meta Pixel, Google AdSense
- **Formulários:** Formspree

## 🛠️ Como Executar o Projeto Localmente

1. Clone o repositório para a sua máquina local:

   ```bash
   git clone git@github.com:RafaelVicen/ekoclip.git
   ```

2. Navegue para a pasta do projeto:

   ```bash
   cd ekoclip
   ```

3. Abra o ficheiro `index.html` no seu navegador de internet.

---

## ⚙️ Estudo de Caso: A Implementação da Secção de Notícias Automáticas

A criação da secção de notícias representa a evolução do EkoClip de um site estático para uma plataforma de mídia dinâmica. Foi um processo que envolveu estratégia, programação, diagnóstico e, finalmente, uma solução elegante.

### 1. O Objetivo: Um Site Sempre Atualizado

O objetivo era claro: queríamos que a página inicial do EkoClip parecesse sempre "viva" e atualizada, sem a necessidade de editar o código manualmente todos os dias. A solução foi criar um "robô" que fosse buscar notícias de uma fonte credível automaticamente.

### 2. A Estratégia: O Caminho Correto e Profissional

Decidimos usar a forma ética e robusta: ler um **Feed RSS** de um portal de notícias. A fonte escolhida foi o **PlatinaLine** (`https://platinaline.com/feed/`). A arquitetura técnica foi a mais moderna:

- **Front-end:** Manter o site rápido e seguro no Netlify.
- **Back-end:** Utilizar uma **Função Serverless do Netlify** como o nosso "robô" para fazer o trabalho pesado.

### 3. A Implementação (Passo a Passo)

O trabalho foi dividido em três partes:

#### Parte A: Construir o "Robô" (A Função Netlify)

- **Estrutura:** Criámos a pasta `netlify/functions/` para alojar o nosso código serverless.
- **Código do Robô (`get-news.js`):** Programámos o robô para usar a biblioteca `rss-parser` para ler o Feed RSS do PlatinaLine, processar os dados e devolver uma lista limpa das últimas notícias.
- **Dependências (`package.json`):** Criámos um ficheiro para informar o Netlify sobre as ferramentas que o robô precisava, nomeadamente o `rss-parser`.
- **Configuração (`netlify.toml`):** Criámos um ficheiro para dizer ao Netlify onde encontrar os nossos robôs.

#### Parte B: Preparar o Site para Receber as Notícias (O Front-end)

- **O Espaço (`index.html`):** Adicionámos um `<div>` vazio (`news-feed-container`) para servir de "vitrine" para as notícias.
- **O Pedido (`script.js`):** Adicionámos um código JavaScript que, ao carregar a página, "telefona" para o nosso robô (`/.netlify/functions/get-news`) e pede as últimas notícias.
- **A Exibição (`script.js`):** Quando o robô respondia, o JavaScript construía dinamicamente o HTML para cada notícia e inseria-o na "vitrine".
- **O Design (`style.css`):** Adicionámos o CSS para garantir que a nova secção ficasse com um aspeto profissional.

### 4. O Desafio e o Diagnóstico: O Mistério das Imagens em Falta

Após a implementação, enfrentámos o nosso maior desafio: as notícias apareciam, mas as imagens não.

- **1ª Tentativa:** O robô procurou por tags `<img>` no texto. Os logs do Netlify mostraram: `URL da Imagem Encontrada: null`. Falhou.
- **2ª Tentativa:** Melhorámos o robô para procurar num campo especial (`enclosure`). Os logs mostraram o mesmo resultado. Falhou outra vez.
- **Diagnóstico Final:** Criámos uma versão de diagnóstico do robô com `console.log` para imprimir tudo o que o Feed enviava. Ao analisar os logs no painel do Netlify, a resposta tornou-se clara: o Feed RSS do PlatinaLine **não inclui a imagem principal da notícia** em nenhum campo.

### 5. A Solução Final: Um Design Elegante e Funcional

Com a certeza de que não podíamos obter as imagens, tomámos uma decisão de design informada: adaptar o site à realidade dos dados.

- **Simplificámos o Robô:** Retirámos a lógica de procura de imagens, tornando-o mais limpo.
- **Simplificámos o JavaScript e o CSS:** Refizemos o layout para um formato elegante, apenas com texto, usando uma borda lateral colorida para dar destaque visual.

### O Resultado

O resultado é uma secção de "Últimas Notícias" que se atualiza sozinha, mantendo o site dinâmico e relevante, implementada com tecnologias modernas e um design profissional perfeitamente adaptado aos dados disponíveis.

---

## 🔮 Planos Futuros

- **Implementar "EkoCharts":** Um ranking semanal das músicas mais baixadas no site.
- **Criar uma "Zona de Talentos":** Um espaço para novos artistas enviarem as suas demos.
- **Automatizar Adição de Músicas:** Evoluir a estrutura para um Headless CMS (como Strapi ou Sanity) para permitir a gestão de todo o conteúdo através de um painel de administração, sem necessidade de editar o código manualmente.

## 👤 Autor

Rafael Vicente

- **GitHub:** [@RafaelVicen](https://github.com/RafaelVicen)

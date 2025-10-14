document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA DO FILTRO DE PODCASTS ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const videoCards = document.querySelectorAll('.video-card');

    if (filterButtons.length > 0 && videoCards.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filterCategory = button.textContent;

                videoCards.forEach(card => {
                    const cardCategory = card.dataset.category;
                    if (filterCategory === 'Todos' || cardCategory === filterCategory) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // --- LÓGICA DO MENU HAMBÚRGUER ---
    const hamburger = document.querySelector('.hamburger');
    const mainNav = document.querySelector('.main-nav');

    if (hamburger && mainNav) {
        hamburger.addEventListener('click', () => {
            mainNav.classList.toggle('active');
        });
    }
});
// --- LÓGICA PARA BUSCAR NOTÍCIAS AUTOMATICAMENTE ---
document.addEventListener('DOMContentLoaded', () => {
    const newsContainer = document.getElementById('news-feed-container');

    // Só executa se encontrar o espaço para as notícias na página
    if (newsContainer) {
        // Mostra uma mensagem de "A carregar..."
        newsContainer.innerHTML = '<p>A carregar últimas notícias...</p>';

        // Pede as notícias ao nosso "robô" (a Função Netlify)
        fetch('/.netlify/functions/get-news')
            .then(response => response.json())
            .then(data => {
                // Limpa a mensagem "A carregar..."
                newsContainer.innerHTML = '';
                
                // Pega apenas nas 5 notícias mais recentes
                const latestNews = data.items.slice(0, 5);

                latestNews.forEach(item => {
                    // Cria o HTML para cada notícia
                    const newsItem = document.createElement('div');
                    newsItem.className = 'news-item';
                    newsItem.innerHTML = `
                        <h3><a href="${item.link}" target="_blank">${item.title}</a></h3>
                        <p>${item.contentSnippet || ''}</p>
                        <small>Fonte: ${item.isoDate ? new Date(item.isoDate).toLocaleDateString('pt-AO') : 'Recente'}</small>
                    `;
                    newsContainer.appendChild(newsItem);
                });
            })
            .catch(error => {
                // Se der erro, mostra uma mensagem
                newsContainer.innerHTML = '<p>Não foi possível carregar as notícias de momento.</p>';
                console.error('Erro ao buscar notícias:', error);
            });
    }
});
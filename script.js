// Ficheiro: script.js (Secção de Notícias Simplificada)

// --- LÓGICA PARA BUSCAR NOTÍCIAS AUTOMATICAMENTE ---
document.addEventListener('DOMContentLoaded', () => {
    // ... (o seu código do menu hambúrguer continua aqui) ...

    const newsContainer = document.getElementById('news-feed-container');

    if (newsContainer) {
        newsContainer.innerHTML = '<p>A carregar últimas notícias...</p>';

        fetch('/.netlify/functions/get-news')
            .then(response => response.json())
            .then(data => {
                newsContainer.innerHTML = '';
                const latestNews = data.items.slice(0, 5);

                latestNews.forEach(item => {
                    const newsItem = document.createElement('div');
                    newsItem.className = 'news-item';
                    
                    // HTML simplificado, sem a imagem
                    newsItem.innerHTML = `
                        <div class="news-item-content">
                            <h3><a href="${item.link}" target="_blank" rel="noopener noreferrer">${item.title}</a></h3>
                            <p>${item.contentSnippet || ''}</p>
                            <small>Fonte: PlatinaLine - ${item.isoDate ? new Date(item.isoDate).toLocaleDateString('pt-AO') : 'Recente'}</small>
                        </div>
                    `;
                    newsContainer.appendChild(newsItem);
                });
            })
            .catch(error => {
                newsContainer.innerHTML = '<p>Não foi possível carregar as notícias de momento.</p>';
            });
    }
});
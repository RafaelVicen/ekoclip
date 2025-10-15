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

// --- LÓGICA PARA O FORMULÁRIO DE PEDIDO DE EBOOK ---
document.addEventListener('DOMContentLoaded', () => {
    const ebookInput = document.getElementById('ebook-selecionado');
    if (ebookInput) {
        const params = new URLSearchParams(window.location.search);
        const ebookName = params.get('ebook');
        if (ebookName) {
            ebookInput.value = ebookName;
        }
    }
});

// --- LÓGICA PARA O FORMULÁRIO DE PEDIDO DE EBOOK ---
document.addEventListener('DOMContentLoaded', () => {
    const ebookInput = document.getElementById('ebook-selecionado');
    const priceDisplay = document.getElementById('ebook-price-display');

    // Só executa se estivermos na página de pedido
    if (ebookInput && priceDisplay) {
        const params = new URLSearchParams(window.location.search);
        const ebookName = params.get('ebook');
        const ebookPrice = params.get('price');

        // Preenche o campo escondido com o nome do ebook
        if (ebookName) {
            ebookInput.value = ebookName;
        }

        // Mostra o preço ao utilizador
        if (ebookPrice) {
            // Formata o número para ter o aspeto de moeda (ex: 5.000,00 Kz)
            const formattedPrice = new Intl.NumberFormat('pt-AO', {
                style: 'currency',
                currency: 'AOA'
            }).format(ebookPrice);

            priceDisplay.innerHTML = `Valor a Pagar: <strong>${formattedPrice}</strong>`;
        } else {
            priceDisplay.innerHTML = 'Valor não especificado. Por favor, volte à livraria.';
            priceDisplay.style.color = 'red';
        }
    }
});
// --- LÓGICA DO CRONÓMETRO DE DESCONTO ---
document.addEventListener('DOMContentLoaded', () => {
    const timerBanner = document.getElementById('discount-timer-banner');
    const countdownDisplay = document.getElementById('countdown-timer');
    const DURATION_IN_HOURS = 24; // Duração da oferta em horas

    function startTimer() {
        const endTime = new Date().getTime() + DURATION_IN_HOURS * 60 * 60 * 1000;
        localStorage.setItem('ekoClipDiscountEndTime', endTime);
        return endTime;
    }

    function updateTimer() {
        let endTime = localStorage.getItem('ekoClipDiscountEndTime');
        if (!endTime) {
            endTime = startTimer();
        }

        const now = new Date().getTime();
        const distance = endTime - now;

        if (distance > 0) {
            timerBanner.style.display = 'block';

            const hours = Math.floor((distance % (10 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            countdownDisplay.textContent = 
                ('0' + hours).slice(-2) + ":" + 
                ('0' + minutes).slice(-2) + ":" + 
                ('0' + seconds).slice(-2);
            
            // Ativa o modo de desconto no site
            document.body.classList.add('discount-active');

        } else {
            timerBanner.style.display = 'none';
            localStorage.removeItem('ekoClipDiscountEndTime');
            // Desativa o modo de desconto
            document.body.classList.remove('discount-active');
        }
    }

    // Atualiza o cronómetro a cada segundo
    setInterval(updateTimer, 1000);
    updateTimer(); // Chama uma vez para não haver atraso
});


// --- ATUALIZA A LÓGICA DO FORMULÁRIO DE PEDIDO DE EBOOK ---
document.addEventListener('DOMContentLoaded', () => {
    const ebookInput = document.getElementById('ebook-selecionado');
    const priceDisplay = document.getElementById('ebook-price-display');

    if (ebookInput && priceDisplay) {
        const params = new URLSearchParams(window.location.search);
        const ebookName = params.get('ebook');
        const ebookPrice = params.get('price');
        const originalPrice = params.get('original_price');

        if (ebookName) {
            ebookInput.value = ebookName;
        }

        // Mostra o preço (com ou sem desconto)
        let priceHtml = '';
        if (ebookPrice && originalPrice) {
            const formattedOriginalPrice = new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(originalPrice);
            const formattedDiscountPrice = new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(ebookPrice);
            priceHtml = `
                <span class="original-price" style="display: inline;">${formattedOriginalPrice}</span>
                Valor a Pagar: <strong>${formattedDiscountPrice}</strong>
            `;
        } else if (ebookPrice) {
            const formattedPrice = new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(ebookPrice);
            priceHtml = `Valor a Pagar: <strong>${formattedPrice}</strong>`;
        } else {
             priceHtml = 'Valor não especificado. Por favor, volte à livraria.';
             priceDisplay.style.color = 'red';
        }
        priceDisplay.innerHTML = priceHtml;
    }
});
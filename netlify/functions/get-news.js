// Ficheiro: netlify/functions/get-news.js (Código Melhorado)

const Parser = require('rss-parser');
const parser = new Parser();

// Função melhorada para extrair a primeira imagem do conteúdo HTML
function extractImageUrl(content) {
    if (!content) return null;
    
    // Tenta encontrar uma tag <img> com o atributo src="..."
    const match = content.match(/<img[^>]+src="([^">]+)"/);
    
    // Se encontrar, devolve o link da imagem. Se não, devolve null.
    return match ? match[1] : null;
}

exports.handler = async function(event, context) {
    const FEED_URL = 'https://platinaline.com/feed/';

    try {
        let feed = await parser.parseURL(FEED_URL);

        // Processa cada notícia para extrair os dados que queremos
        const processedItems = feed.items.map(item => {
            const imageUrl = extractImageUrl(item['content:encoded'] || item.content);
            
            // LINHA DE DIAGNÓSTICO: Isto vai aparecer nos logs do Netlify
            console.log(`Notícia: "${item.title}" >> URL da Imagem Encontrada: ${imageUrl}`);

            return {
                title: item.title,
                link: item.link,
                isoDate: item.isoDate,
                imageUrl: imageUrl, // O URL da imagem que encontrámos
                contentSnippet: item.contentSnippet ? item.contentSnippet.substring(0, 150) + '...' : ''
            };
        });

        return {
            statusCode: 200,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({
                items: processedItems
            })
        };
    } catch (error) {
        console.error("Erro ao buscar feed RSS:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Falha ao buscar as notícias do PlatinaLine.' })
        };
    }
};
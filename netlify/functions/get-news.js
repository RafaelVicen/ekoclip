// Ficheiro: netlify/functions/get-news.js (Código Final de Diagnóstico)

const Parser = require('rss-parser');
const parser = new Parser();

// Função com um "scanner" de imagens mais potente (regex melhorado)
function extractImageUrlFromContent(content) {
    if (!content) return null;
    // Este regex procura por src="...", src='...' e lida com espaços extras.
    const match = content.match(/<img[^>]+src\s*=\s*['"]([^'"]+)['"]/);
    return match ? match[1] : null;
}

exports.handler = async function(event, context) {
    const FEED_URL = 'https://platinaline.com/feed/';

    try {
        let feed = await parser.parseURL(FEED_URL);

        const processedItems = feed.items.map((item, index) => {
            let imageUrl = null;

            // Lógica melhorada:
            if (item.enclosure && item.enclosure.url) {
                imageUrl = item.enclosure.url;
            } else {
                imageUrl = extractImageUrlFromContent(item['content:encoded'] || item.content);
            }

            // ================== SUPER DIAGNÓSTICO ==================
            // Para a primeira notícia da lista, vamos imprimir todo o conteúdo que o robô está a ver.
            // Isto vai mostrar-nos todos os campos disponíveis.
            if (index === 0) {
                console.log("--- INÍCIO DO DIAGNÓSTICO DO PRIMEIRO ITEM ---");
                console.log(JSON.stringify(item, null, 2));
                console.log("--- FIM DO DIAGNÓSTICO ---");
            }
            // ========================================================
            
            console.log(`Notícia: "${item.title}" >> URL da Imagem Encontrada: ${imageUrl}`);

            return {
                title: item.title,
                link: item.link,
                isoDate: item.isoDate,
                imageUrl: imageUrl,
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
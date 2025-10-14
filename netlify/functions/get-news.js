// Ficheiro: netlify/functions/get-news.js (Código Final e Melhorado)

const Parser = require('rss-parser');
const parser = new Parser();

// A nossa função antiga para procurar dentro do texto (agora é o nosso Plano B)
function extractImageUrlFromContent(content) {
    if (!content) return null;
    const match = content.match(/<img[^>]+src="([^">]+)"/);
    return match ? match[1] : null;
}

exports.handler = async function(event, context) {
    const FEED_URL = 'https://platinaline.com/feed/';

    try {
        let feed = await parser.parseURL(FEED_URL);

        const processedItems = feed.items.map(item => {
            let imageUrl = null;

            // LÓGICA MELHORADA: Procura em dois sítios!
            // 1. Procura primeiro na "caixa especial" (enclosure), que é o mais fiável.
            if (item.enclosure && item.enclosure.url && item.enclosure.type.startsWith('image')) {
                imageUrl = item.enclosure.url;
            } 
            // 2. Se não encontrar, usa o nosso Plano B e procura dentro do texto.
            else {
                imageUrl = extractImageUrlFromContent(item['content:encoded'] || item.content);
            }

            // Linha de diagnóstico (vamos mantê-la por agora)
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
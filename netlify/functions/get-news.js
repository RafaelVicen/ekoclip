// Ficheiro: netlify/functions/get-news.js (Versão Final Simplificada)

const Parser = require('rss-parser');
const parser = new Parser();

exports.handler = async function(event, context) {
    const FEED_URL = 'https://platinaline.com/feed/';

    try {
        let feed = await parser.parseURL(FEED_URL);

        // Processa os itens, pegando apenas o que precisamos
        const processedItems = feed.items.map(item => ({
            title: item.title,
            link: item.link,
            isoDate: item.isoDate,
            // Pega num resumo mais curto
            contentSnippet: item.contentSnippet ? item.contentSnippet.substring(0, 200) + '...' : ''
        }));

        return {
            statusCode: 200,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({
                items: processedItems
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Falha ao buscar as notícias.' })
        };
    }
};
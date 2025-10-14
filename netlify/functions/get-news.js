// Ficheiro: netlify/functions/get-news.js

const Parser = require('rss-parser');
const parser = new Parser();

exports.handler = async function(event, context) {
    // URL ATUALIZADA PARA O PLATINALINE
    const FEED_URL = 'https://platinaline.com/feed/';

    try {
        let feed = await parser.parseURL(FEED_URL);

        // Devolve as notícias em formato JSON
        return {
            statusCode: 200,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({
                items: feed.items
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
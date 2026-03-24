// Ficheiro: netlify/functions/get-news.js
// Carrega notícias de feeds RSS (com fallbacks)

const Parser = require('rss-parser');
const parser = new Parser();

// Feeds RSS a tentar por ordem (o primeiro que funcionar é usado)
const FEED_URLS = [
  'https://feeds.bbci.co.uk/portuguese/rss.xml',
  'https://feeds.publico.pt/rss/ultimas',
  'https://observador.pt/feed/',
  'https://feeds.jn.pt/JN-ULTIMAS',
  'https://rss.dw.com/xml/rss-pt-all',
  'https://expresso.pt/rss/ultimas'
];

function extractImageUrlFromContent(content) {
  if (!content) return null;
  const match = content.match(/<img[^>]+src="([^">]+)"/);
  return match ? match[1] : null;
}

exports.handler = async function (event, context) {
  let feed = null;
  let lastError = null;

  for (const FEED_URL of FEED_URLS) {
    try {
      feed = await parser.parseURL(FEED_URL);
      if (feed && feed.items && feed.items.length > 0) break;
    } catch (err) {
      lastError = err;
      continue;
    }
  }

  if (!feed || !feed.items || feed.items.length === 0) {
    console.error('Todos os feeds falharam:', lastError);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Falha ao buscar as notícias.' })
    };
  }

  try {

    const processedItems = feed.items.map((item) => {
      let imageUrl = null;

      // LÓGICA MELHORADA: Procura em dois sítios!
      // 1. Procura primeiro na "caixa especial" (enclosure), que é o mais fiável.
      if (
        item.enclosure &&
        item.enclosure.url &&
        (item.enclosure.type || '').startsWith('image')
      ) {
        imageUrl = item.enclosure.url;
      }
      // 2. Se não encontrar, usa o nosso Plano B e procura dentro do texto.
      else {
        imageUrl = extractImageUrlFromContent(
          item['content:encoded'] || item.content
        );
      }

      // Linha de diagnóstico removida por segurança

      const snippet = item.contentSnippet || item.content || '';
      return {
        title: item.title || 'Sem título',
        link: item.link || item.guid || '#',
        isoDate: item.isoDate || item.pubDate,
        imageUrl: imageUrl,
        contentSnippet: snippet.length > 150 ? snippet.substring(0, 150) + '...' : snippet
      };
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'X-Content-Type-Options': 'nosniff'
      },
      body: JSON.stringify({
        items: processedItems
      })
    };
  } catch (error) {
    console.error('Erro ao buscar feed RSS:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        error: 'Falha ao buscar as notícias.'
      })
    };
  }
};

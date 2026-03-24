// CSP Violation Report Endpoint
// Este arquivo pode ser usado para coletar relatórios de violações de CSP

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed'
    };
  }

  try {
    const violation = JSON.parse(event.body);

    // Log da violação (em produção, envie para serviço de monitoramento)
    console.log('CSP Violation:', {
      documentUri: violation.documentURI,
      violatedDirective: violation.violatedDirective,
      originalPolicy: violation.originalPolicy,
      blockedUri: violation.blockedURI,
      timestamp: new Date().toISOString()
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true })
    };
  } catch (error) {
    console.error('Erro ao processar relatório CSP:', error);
    return {
      statusCode: 400,
      body: 'Bad Request'
    };
  }
};
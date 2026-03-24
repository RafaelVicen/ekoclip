// Arquivo de exemplo para configuração de ambiente
// Copie este arquivo para environment.ts e configure suas variáveis

export const environment = {
  production: false,

  // API Configuration
  apiUrl: 'https://ekoclip-api.netlify.app',

  // Application Configuration
  appName: 'EkoClip',
  appVersion: '1.0.0',

  // Feature Flags
  enableAnalytics: false,
  enableDebugMode: true,

  // External Services
  googleAnalyticsId: '',
  stripePublishableKey: '',

  // Social Media
  socialLinks: {
    instagram: 'https://instagram.com/ekoclip',
    youtube: 'https://youtube.com/@ekoclip',
    twitter: 'https://twitter.com/ekoclip',
  },

  // Contact Information
  contact: {
    email: 'contato@ekoclip.com',
    phone: '',
    address: '',
  },
};

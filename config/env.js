// Configurações de ambiente
export const config = {
  dev: {
    baseUrl: 'https://dev-api.example.com',
    timeout: 30000,
  },
  staging: {
    baseUrl: 'https://staging-api.example.com',
    timeout: 30000,
  },
  production: {
    baseUrl: 'https://api.example.com',
    timeout: 10000,
  },
};

// Obter ambiente da variável de ambiente ou usar dev como padrão
export const getConfig = () => {
  const env = __ENV.ENVIRONMENT || 'dev';
  return config[env];
};

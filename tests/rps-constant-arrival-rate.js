import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

// EXEMPLO 1: constant-arrival-rate
// Mantém uma taxa FIXA de requisições por segundo
// Útil para: Simular carga constante e previsível
export const options = {
  scenarios: {
    constant_rps: {
      executor: 'constant-arrival-rate',
      rate: 50,               // 50 requisições por segundo
      timeUnit: '1s',         // Por segundo
      duration: '1m',         // Durante 1 minuto
      preAllocatedVUs: 25,    // VUs pré-alocados (evita delay no início)
      maxVUs: 100,            // Máximo de VUs que podem ser criados
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<1000'],
    http_req_failed: ['rate<0.1'],
  },
};

export default function () {
  const response = http.get(`${BASE_URL}/posts`);
  
  check(response, {
    'status 200': (r) => r.status === 200,
    'tempo < 1s': (r) => r.timings.duration < 1000,
  });

  // Sem sleep - o K6 controla a taxa automaticamente
}

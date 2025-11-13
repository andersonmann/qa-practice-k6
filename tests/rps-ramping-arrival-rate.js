import http from 'k6/http';
import { check } from 'k6';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

// EXEMPLO 2: ramping-arrival-rate
// Taxa de requisições que aumenta/diminui gradualmente
// Útil para: Testes de rampa, encontrar ponto de saturação
export const options = {
  scenarios: {
    ramping_rps: {
      executor: 'ramping-arrival-rate',
      startRate: 10,          // Começa com 10 req/s
      timeUnit: '1s',
      preAllocatedVUs: 50,
      maxVUs: 300,
      stages: [
        { duration: '30s', target: 50 },   // Aumenta para 50 req/s
        { duration: '1m', target: 50 },    // Mantém 50 req/s
        { duration: '30s', target: 100 },  // Aumenta para 100 req/s
        { duration: '1m', target: 100 },   // Mantém 100 req/s
        { duration: '30s', target: 200 },  // Aumenta para 200 req/s
        { duration: '1m', target: 200 },   // Mantém 200 req/s
        { duration: '30s', target: 0 },    // Ramp-down
      ],
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
  });

  // Sem sleep - o executor controla a taxa
}

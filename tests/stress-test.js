import http from 'k6/http';
import { check, sleep } from 'k6';

// Teste de estresse - aumenta gradualmente até o limite
export const options = {
  stages: [
    { duration: '2m', target: 100 },  // Aumenta para 100 usuários
    { duration: '5m', target: 100 },  // Mantém 100 usuários
    { duration: '2m', target: 200 },  // Aumenta para 200 usuários
    { duration: '5m', target: 200 },  // Mantém 200 usuários
    { duration: '2m', target: 300 },  // Aumenta para 300 usuários
    { duration: '5m', target: 300 },  // Mantém 300 usuários
    { duration: '2m', target: 0 },    // Ramp-down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'],
    http_req_failed: ['rate<0.1'],
  },
};

export default function () {
  const response = http.get('https://test-api.k6.io/public/crocodiles/');

  check(response, {
    'status é 200': (r) => r.status === 200,
  });

  sleep(1);
}

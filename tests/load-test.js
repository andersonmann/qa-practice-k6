import http from 'k6/http';
import { check, sleep } from 'k6';

// Teste de carga - simula carga constante
export const options = {
  vus: 50,              // 50 usuários virtuais
  duration: '2m',       // Duração de 2 minutos
  thresholds: {
    http_req_duration: ['p(99)<1000'], // 99% das requests < 1s
    http_req_failed: ['rate<0.05'],    // Menos de 5% de erros
  },
};

export default function () {
  const response = http.get('https://test-api.k6.io/public/crocodiles/');

  check(response, {
    'status é 200': (r) => r.status === 200,
  });

  sleep(1);
}

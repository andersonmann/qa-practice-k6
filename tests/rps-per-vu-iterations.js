import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

// EXEMPLO 3: per-vu-iterations (Cálculo Manual de RPS)
// Cada VU executa um número fixo de iterações
// RPS = (VUs × Iterations) / Duration
// Exemplo: 100 req/s durante 60s = 6000 requisições totais
// Com 10 VUs: cada VU faz 600 iterações
export const options = {
  scenarios: {
    fixed_iterations: {
      executor: 'per-vu-iterations',
      vus: 10,                // 10 usuários virtuais
      iterations: 600,        // 600 iterações por VU
      maxDuration: '60s',     // Máximo de 60 segundos
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

  // Sleep pequeno para distribuir as requisições
  // 10 VUs × 600 iterações = 6000 req total
  // Se cada iteração demora ~0.1s, teremos ~100 req/s
  sleep(0.05);
}

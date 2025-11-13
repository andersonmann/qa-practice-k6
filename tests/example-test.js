import http from 'k6/http';
import { check, sleep } from 'k6';

// Configuração do teste
export const options = {
  stages: [
    { duration: '30s', target: 10 }, // Ramp-up para 10 usuários em 30s
    { duration: '1m', target: 10 },  // Mantém 10 usuários por 1 minuto
    { duration: '10s', target: 0 },  // Ramp-down para 0 usuários
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% das requisições devem ser < 500ms
    http_req_failed: ['rate<0.1'],    // Taxa de erro deve ser < 10%
  },
};

// Função principal do teste
export default function () {
  // Exemplo de requisição GET
  const response = http.get('https://test-api.k6.io/public/crocodiles/');

  // Validações
  check(response, {
    'status é 200': (r) => r.status === 200,
    'tempo de resposta < 500ms': (r) => r.timings.duration < 500,
    'resposta contém dados': (r) => r.body.length > 0,
  });

  sleep(1); // Pausa de 1 segundo entre iterações
}

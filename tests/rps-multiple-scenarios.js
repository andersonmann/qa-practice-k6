import http from 'k6/http';
import { check } from 'k6';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

// EXEMPLO BÔNUS: Múltiplos cenários rodando simultaneamente
// Combina diferentes padrões de carga no mesmo teste
export const options = {
  scenarios: {
    // Cenário 1: Carga constante de background (usuários normais)
    background_load: {
      executor: 'constant-arrival-rate',
      rate: 20,
      timeUnit: '1s',
      duration: '5m',
      preAllocatedVUs: 10,
      maxVUs: 50,
      exec: 'getPosts',           // Chama função específica
      startTime: '0s',
    },

    // Cenário 2: Pico de tráfego após 2 minutos
    spike_load: {
      executor: 'constant-arrival-rate',
      rate: 100,                  // 100 req/s durante o pico
      timeUnit: '1s',
      duration: '30s',            // Pico de 30 segundos
      preAllocatedVUs: 50,
      maxVUs: 150,
      exec: 'getPosts',
      startTime: '2m',            // Começa após 2 minutos
    },

    // Cenário 3: Rampa crescente após 3 minutos
    ramp_load: {
      executor: 'ramping-arrival-rate',
      startRate: 10,
      timeUnit: '1s',
      preAllocatedVUs: 20,
      maxVUs: 100,
      stages: [
        { duration: '1m', target: 50 },
        { duration: '30s', target: 0 },
      ],
      exec: 'createPost',         // Função diferente
      startTime: '3m',            // Começa após 3 minutos
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<1500'],
    http_req_failed: ['rate<0.1'],
  },
};

// Função para GET de posts
export function getPosts() {
  const response = http.get(`${BASE_URL}/posts`);
  check(response, {
    'GET status 200': (r) => r.status === 200,
  });
}

// Função para POST de posts
export function createPost() {
  const payload = JSON.stringify({
    title: 'Test',
    body: 'Test body',
    userId: 1,
  });

  const response = http.post(`${BASE_URL}/posts`, payload, {
    headers: { 'Content-Type': 'application/json' },
  });

  check(response, {
    'POST status 201': (r) => r.status === 201,
  });
}

// Função default (não será usada neste exemplo)
export default function () {
  // Vazia - os cenários chamam funções específicas
}

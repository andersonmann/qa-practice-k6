import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

export const options = {
  stages: [
    { duration: '30s', target: 20 },  // Ramp-up para 20 usuários
    { duration: '1m', target: 20 },   // Mantém 20 usuários
    { duration: '10s', target: 0 },   // Ramp-down
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'], // 95% das requests < 1s
    http_req_failed: ['rate<0.1'],     // Menos de 10% de erros
    checks: ['rate>0.95'],             // 95% dos checks devem passar
  },
};

export default function () {
  // Teste 1: Listar posts
  let response = http.get(`${BASE_URL}/posts`);
  check(response, {
    'GET /posts - status 200': (r) => r.status === 200,
    'GET /posts - tem dados': (r) => JSON.parse(r.body).length > 0,
  });
  sleep(1);

  // Teste 2: Buscar post específico
  response = http.get(`${BASE_URL}/posts/1`);
  check(response, {
    'GET /posts/1 - status 200': (r) => r.status === 200,
    'GET /posts/1 - tem título': (r) => JSON.parse(r.body).title !== undefined,
  });
  sleep(1);

  // Teste 3: Criar novo post
  const payload = JSON.stringify({
    title: 'Test Post',
    body: 'This is a test post from K6',
    userId: 1,
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  response = http.post(`${BASE_URL}/posts`, payload, params);
  check(response, {
    'POST /posts - status 201': (r) => r.status === 201,
    'POST /posts - retorna ID': (r) => JSON.parse(r.body).id !== undefined,
  });
  sleep(1);

  // Teste 4: Atualizar post
  const updatePayload = JSON.stringify({
    id: 1,
    title: 'Updated Title',
    body: 'Updated body',
    userId: 1,
  });

  response = http.put(`${BASE_URL}/posts/1`, updatePayload, params);
  check(response, {
    'PUT /posts/1 - status 200': (r) => r.status === 200,
  });
  sleep(1);

  // Teste 5: Deletar post
  response = http.del(`${BASE_URL}/posts/1`);
  check(response, {
    'DELETE /posts/1 - status 200': (r) => r.status === 200,
  });
  sleep(1);

  // Teste 6: Listar comentários
  response = http.get(`${BASE_URL}/posts/1/comments`);
  check(response, {
    'GET /comments - status 200': (r) => r.status === 200,
    'GET /comments - tem dados': (r) => JSON.parse(r.body).length > 0,
  });
  sleep(1);

  // Teste 7: Listar usuários
  response = http.get(`${BASE_URL}/users`);
  check(response, {
    'GET /users - status 200': (r) => r.status === 200,
    'GET /users - tem dados': (r) => JSON.parse(r.body).length === 10,
  });
  sleep(1);
}

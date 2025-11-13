# K6 Performance Tests

Estrutura de testes de performance usando K6.

## Estrutura do Projeto

```
k6-performance-tests/
├── tests/              # Scripts de teste
│   ├── example-test.js # Teste exemplo com ramp-up/ramp-down
│   ├── load-test.js    # Teste de carga
│   └── stress-test.js  # Teste de estresse
├── config/             # Arquivos de configuração
├── data/               # Dados para testes (CSV, JSON)
└── results/            # Relatórios de execução
```

## Como Executar

### Executar um teste simples
```powershell
k6 run tests/example-test.js
```

### Executar com saída detalhada
```powershell
k6 run --out json=results/output.json tests/example-test.js
```

### Executar com relatório HTML
```powershell
k6 run --out json=results/output.json tests/example-test.js
```

### Executar teste de carga
```powershell
k6 run tests/load-test.js
```

### Executar teste de estresse
```powershell
k6 run tests/stress-test.js
```

## Tipos de Testes

### 1. **Smoke Test** (Teste de Fumaça)
- VUs: 1-2
- Duração: 1-2 minutos
- Objetivo: Verificar se o sistema funciona sob carga mínima

### 2. **Load Test** (Teste de Carga)
- VUs: 10-100
- Duração: 5-30 minutos
- Objetivo: Verificar comportamento sob carga esperada

### 3. **Stress Test** (Teste de Estresse)
- VUs: Aumenta gradualmente até o limite
- Duração: 10-60 minutos
- Objetivo: Encontrar o ponto de quebra do sistema

### 4. **Spike Test** (Teste de Pico)
- VUs: Aumentos repentinos
- Duração: Curta
- Objetivo: Testar comportamento em picos súbitos

## Métricas Importantes

- `http_req_duration`: Tempo de resposta das requisições
- `http_req_failed`: Taxa de falha das requisições
- `iterations`: Número de iterações completadas
- `vus`: Usuários virtuais ativos

## Thresholds (Limites)

Defina critérios de sucesso/falha:
```javascript
thresholds: {
  http_req_duration: ['p(95)<500'],  // 95% < 500ms
  http_req_failed: ['rate<0.1'],     // < 10% de erros
}
```

## Recursos

- [Documentação K6](https://k6.io/docs/)
- [Exemplos K6](https://k6.io/docs/examples/)

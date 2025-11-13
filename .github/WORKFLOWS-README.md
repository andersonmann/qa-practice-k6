# GitHub Actions para K6 Performance Tests

Este projeto contém dois workflows do GitHub Actions para executar testes de performance automaticamente.

## 📋 Workflows Disponíveis

### 1. `k6-tests.yml` (Básico)
Workflow simples que executa testes básicos a cada push.

**Triggers:**
- Push para `main` ou `develop`
- Pull requests para `main`
- Execução manual via UI do GitHub

**Testes executados:**
- `example-test.js` - Teste básico
- `jsonplaceholder-test.js` - Teste completo da API
- `load-test.js` - Teste de carga

---

### 2. `k6-tests-advanced.yml` (Avançado)
Workflow completo com múltiplos jobs e execução paralela.

**Triggers:**
- Push para `main`
- Schedule diário (2am UTC)
- Execução manual com parâmetro de arquivo

**Jobs:**
1. **Smoke Test** - Teste rápido de validação
2. **Load Test** - Teste de carga (só roda se smoke test passar)
3. **RPS Tests** - Testes de RPS em paralelo (matriz)
4. **Summary** - Resumo de todos os testes

---

## 🚀 Como Usar

### Execução Automática
Os workflows rodam automaticamente quando você faz push:

```powershell
git add .
git commit -m "Update tests"
git push
```

### Execução Manual
1. Vá para **Actions** no GitHub
2. Selecione o workflow desejado
3. Clique em **Run workflow**
4. (Opcional) Especifique qual teste executar

---

## 📊 Visualizar Resultados

Após a execução:

1. Vá para **Actions** no repositório
2. Clique no workflow executado
3. Baixe os artifacts com os resultados JSON
4. Ou veja o resumo direto na página do workflow

---

## ⚙️ Configurações Avançadas

### Adicionar K6 Cloud Output

Edite os workflows e adicione suas credenciais:

```yaml
- name: Run with K6 Cloud
  env:
    K6_CLOUD_TOKEN: ${{ secrets.K6_CLOUD_TOKEN }}
  run: k6 run --out cloud tests/example-test.js
```

### Ajustar Schedule

Modificar a frequência de execução agendada:

```yaml
schedule:
  - cron: '0 */6 * * *'  # A cada 6 horas
  - cron: '0 0 * * 1'    # Toda segunda-feira
```

### Adicionar Notificações

Enviar notificações no Slack/Discord quando testes falharem:

```yaml
- name: Notify on Failure
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

---

## 🔒 Secrets Necessários (Opcional)

Se usar integrações externas, adicione em **Settings → Secrets**:

- `K6_CLOUD_TOKEN` - Token do K6 Cloud
- `SLACK_WEBHOOK` - Webhook do Slack
- `DISCORD_WEBHOOK` - Webhook do Discord

---

## 📈 Métricas Coletadas

Os workflows geram arquivos JSON com:
- Duração das requisições
- Taxa de erros
- Número de VUs
- Checks realizados
- Métricas HTTP detalhadas

---

## 🎯 Boas Práticas

1. **Use o workflow básico** para validação rápida em PRs
2. **Use o workflow avançado** para testes completos em main
3. **Schedule testes noturnos** para monitoramento contínuo
4. **Mantenha resultados** por 30 dias para análise histórica
5. **Configure alertas** para degradação de performance

---

## 🛠️ Troubleshooting

### Workflow não está rodando
- Verifique se os arquivos `.yml` estão em `.github/workflows/`
- Confirme que a branch tem permissões de Actions

### Testes falhando
- Revise os logs no Actions
- Baixe os artifacts para análise detalhada
- Verifique se a URL da API está acessível

### Timeout
- Aumente o timeout dos jobs:
  ```yaml
  timeout-minutes: 30
  ```

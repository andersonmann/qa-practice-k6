# Exemplos de Controle de RPS (Requisições Por Segundo) no K6

Este diretório contém exemplos de diferentes estratégias para controlar a taxa de requisições no K6.

## 📁 Arquivos de Exemplo

### 1️⃣ `rps-constant-arrival-rate.js`
**Taxa constante de requisições**
- Mantém exatamente 50 req/s durante todo o teste
- Ideal para: Simular carga constante e previsível
- K6 ajusta automaticamente o número de VUs necessários

**Executar:**
```powershell
k6 run tests/rps-constant-arrival-rate.js
```

**Resultado esperado:** 50 req/s × 60s = ~3.000 requisições totais

---

### 2️⃣ `rps-ramping-arrival-rate.js`
**Taxa crescente de requisições**
- Aumenta gradualmente de 10 → 50 → 100 → 200 req/s
- Ideal para: Encontrar ponto de saturação do sistema
- Simula crescimento de tráfego ao longo do tempo

**Executar:**
```powershell
k6 run tests/rps-ramping-arrival-rate.js
```

**Resultado esperado:** ~9.000 requisições totais ao longo de 5 minutos

---

### 3️⃣ `rps-per-vu-iterations.js`
**Cálculo manual de RPS**
- Controle indireto via VUs fixos e iterações
- 10 VUs × 600 iterações = 6.000 requisições
- Ideal para: Cenários onde você conhece o número exato de requisições

**Executar:**
```powershell
k6 run tests/rps-per-vu-iterations.js
```

**Fórmula:** RPS = (VUs × Iterations) / Duration

---

### 4️⃣ `rps-multiple-scenarios.js` ⭐
**Cenários combinados (AVANÇADO)**
- Roda 3 cenários simultaneamente:
  1. Carga de background constante (20 req/s)
  2. Pico de tráfego após 2min (100 req/s por 30s)
  3. Rampa crescente após 3min
- Ideal para: Simular tráfego realista com múltiplos padrões

**Executar:**
```powershell
k6 run tests/rps-multiple-scenarios.js
```

---

## 📊 Comparação Rápida

| Executor | RPS Fixo? | Crescimento? | Complexidade | Quando Usar |
|----------|-----------|--------------|--------------|-------------|
| `constant-arrival-rate` | ✅ Sim | ❌ Não | Baixa | Carga constante |
| `ramping-arrival-rate` | ❌ Não | ✅ Sim | Média | Teste de rampa |
| `per-vu-iterations` | ⚠️ Manual | ❌ Não | Baixa | Número fixo de requisições |
| **Múltiplos cenários** | ✅ Ambos | ✅ Ambos | Alta | Tráfego realista complexo |

---

## 🎯 Qual escolher?

- **Precisa de exatos X req/s?** → `constant-arrival-rate`
- **Quer aumentar carga gradualmente?** → `ramping-arrival-rate`
- **Sabe o total de requisições?** → `per-vu-iterations`
- **Quer simular cenário real complexo?** → Múltiplos cenários

---

## 📈 Visualizar Resultados

Para ver métricas detalhadas em tempo real:

```powershell
# Com saída JSON
k6 run --out json=results/rps-test.json tests/rps-constant-arrival-rate.js

# Com K6 Cloud (requer conta)
k6 run --out cloud tests/rps-constant-arrival-rate.js
```

---

## 💡 Dicas Importantes

1. **preAllocatedVUs:** Pré-aloca VUs para evitar delay inicial
2. **maxVUs:** Limite máximo para evitar esgotar recursos
3. **Sem sleep() em arrival-rate:** O executor controla a taxa automaticamente
4. **Monitorar recursos:** Alta taxa de RPS pode consumir muita CPU/memória local

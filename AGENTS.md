# Guia Base do Projeto

Este arquivo registra as definicoes centrais do repositorio `lab-esp`.

## Identidade do projeto

- `PROJECT_NAME`: lab-esp
- `PROJECT_GOAL`: criar uma base confiavel para testar eletronica, sensores e comunicacao com ESP32 de forma organizada e repetivel
- `NON_GOALS`: nao entregar o produto final industrial de medicao de excentricidade, nem focar em interface visual avancada, nuvem, app mobile ou automacoes complexas
- `SCOPE_BOUNDARIES`: validacao de firmware, comunicacao serial, rotinas de teste e experimentos futuros com sensores ligados ao projeto

## Stack e ambiente

- `LANG`: TypeScript
- `RUNTIME_VERSION`: Node.js 22 LTS
- `PKG_MANAGER`: npm
- `APP_ENTRYPOINT`: src/main.ts

## Qualidade

- `FORMATTER`: Prettier
- `LINTER`: ESLint
- `STATIC_ANALYSIS`: Semgrep
- `TYPECHECK`: TypeScript (`tsc`)

## Testes

- `TEST_RUNNER`: Vitest
- `TEST_TYPES`: unit, integration
- `COVERAGE_TARGET`: 80%

## CI e merge

- `CI_PROVIDER`: GitHub Actions
- `CI_STAGES`: format -> lint -> typecheck -> test -> security
- `MERGE_POLICY`: merge apenas com CI verde; revisao humana obrigatoria para mudancas relevantes

## Seguranca

- `SAST`: Semgrep
- `DEPENDENCY_AUDIT`: npm audit
- `SECRETS_SCAN`: Gitleaks
- `SBOM_POLICY`: TODO

## IA

- `AI_MODE`: assistido
- `HITL_POLICY`: toda mudanca relevante deve ser revisada por humano antes de ser aceita
- `LLM_PROVIDER`: OpenAI
- `MODEL`: GPT-5.4 Thinking
- `LOCAL_OR_API`: hibrido
- `TOKEN_BUDGET`: orcamento mensal definido

## Dados

- `DATA_CLASSIFICATION`: interno
- `NO_SEND_RULES`: nao enviar segredos, tokens, chaves, documentos privados, dados sensiveis nem informacoes tecnicas confidenciais sem revisao humana
- `REDACTION_RULES`: remover segredos, identificadores sensiveis e conteudo confidencial antes de compartilhar logs ou exemplos

## Sandbox

- `SANDBOX_STRATEGY`: execucao isolada em ambiente controlado e containerizado para qualquer modo agentic futuro
- `RW_PATHS`: diretorio do repositorio
- `NET_RULES`: internet limitada a documentacao oficial e fontes confiaveis; sem acesso livre a rede interna
- `CMD_ALLOWLIST`: comandos canonicos do repositorio e ferramentas aprovadas para validacao

## Deploy

- `DEPLOY_TARGET`: local + Docker
- `RELEASE_STRATEGY`: manual por branch principal ou por tag
- `ROLLBACK_STRATEGY`: voltar para a ultima versao estavel marcada por tag ou release anterior conhecida

## Comandos canonicos

- `./scripts/setup`
- `./scripts/format`
- `./scripts/lint`
- `./scripts/test`
- `./scripts/security`
- `./scripts/ci`
- `./scripts/deploy`
- `./scripts/rollback`

## Definition of Done da base

- `npm run build` funciona
- `./scripts/ci` passa
- testes unitarios e de integracao relevantes foram escritos
- cobertura minima relevante caminha para 80%
- documentacao e runbooks foram atualizados quando a estrutura mudou

## Hurdles e aprendizados

Preencher conforme o projeto evoluir:

- `[data] [problema] -> [como detectar] -> [como corrigir] -> [link relevante]`

# Convencoes do Repositorio

Este arquivo define combinados de organizacao e manutencao do projeto `lab-esp`.

## Organizacao geral

- `src/` para codigo principal
- `tests/` para testes automatizados
- `docs/` para explicacoes, arquitetura e operacao
- `prompts/` para modelos de instrucao reutilizaveis
- `scripts/` para comandos oficiais do projeto
- `infra/` para configuracoes de ambiente e deploy

## Stack adotada

- TypeScript com Node.js 22 LTS
- npm como gerenciador de pacotes
- Prettier para formatacao
- ESLint para lint
- TypeScript para typecheck
- Vitest para testes

## Regras de mudanca

- preferir mudancas pequenas e revisaveis
- evitar misturar refatoracao e funcionalidade nova no mesmo passo
- adicionar ou ajustar testes quando o comportamento mudar
- atualizar documentacao quando estrutura, processo ou contratos mudarem
- registrar decisoes relevantes em `docs/adr/`

## Regras de codigo

- usar `src/` para modulos de aplicacao
- usar `tests/` para testes
- evitar acoplamento direto entre logica de negocio e detalhes de hardware
- encapsular comunicacao serial e interacao com dispositivos em modulos dedicados
- expor contratos claros para testes de integracao com ESP32

## Regras de qualidade

- `npm run format:check` deve passar
- `npm run lint` deve passar
- `npm run typecheck` deve passar
- `npm run test:coverage` deve ser a referencia de cobertura

## Contratos de saida

Quando alguma automacao depender de um formato de resposta, preferir saidas estruturadas e validaveis.

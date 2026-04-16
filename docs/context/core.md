# Contexto Central

Voltar para o [indice mestre](../index.md).

## O que este projeto e

`lab-esp` e uma base de laboratorio para validar ESP32, comunicacao serial, sensores e rotinas de teste de forma organizada.

Ele existe para que firmware, comunicacao e experimentos sejam repetiveis, rastreaveis e seguros antes de qualquer evolucao para um sistema industrial mais complexo.

## O que sempre precisa estar claro

- objetivo do projeto: ver [README.md](../../README.md)
- definicoes oficiais: ver [AGENTS.md](../../AGENTS.md)
- regras de trabalho: ver [CONVENTIONS.md](../../CONVENTIONS.md)
- limites de IA: ver [POLICY_AI.md](../../POLICY_AI.md)
- decisoes ativas: ver [docs/decisions.md](../decisions.md)

## Stack atual

- TypeScript
- Node.js 22 LTS
- npm
- ESLint
- Prettier
- Vitest

## Limites desta fase

- nao focar em interface visual avancada
- nao depender de nuvem ou app mobile
- nao tentar entregar ainda o produto industrial final
- priorizar base de teste, confiabilidade e organizacao

## Areas tecnicas prioritarias

- comunicacao serial com ESP32
- validacao de firmware
- testes locais e testes de integracao
- instrumentacao para sensores do laboratorio
- organizacao de comandos, resultados e problemas recorrentes

## Contexto minimo para novas sessoes

- [AGENTS.md](../../AGENTS.md)
- [CONVENTIONS.md](../../CONVENTIONS.md)
- [POLICY_AI.md](../../POLICY_AI.md)
- [docs/context/loading-rules.md](./loading-rules.md)
- [docs/context/task-map.md](./task-map.md)
- [docs/session/current-state.md](../session/current-state.md)

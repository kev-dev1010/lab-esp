# Prompt de Bootstrap

## Objetivo

Iniciar uma sessao nova sem perder o fluxo oficial do projeto.

## Entradas

- contexto permanente
- estado atual da sessao
- tipo de tarefa pretendido

## Regras

1. validar `current-state.md` antes de qualquer outra acao relevante
2. identificar o tipo de tarefa no `task-map`
3. nao seguir sem `./scripts/ai-run bootstrap`
4. nao seguir sem `./scripts/ai-run task <tipo>`

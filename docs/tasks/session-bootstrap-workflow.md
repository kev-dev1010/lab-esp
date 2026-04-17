# Fluxo de Bootstrap de Sessao

Voltar para o [indice mestre](../index.md).

## Carregar antes de começar

- [README.md](../../README.md)
- [core.md](../context/core.md)
- [loading-rules.md](../context/loading-rules.md)
- [task-map.md](../context/task-map.md)
- [current-state.md](../session/current-state.md)

## Este fluxo deve responder

- qual e o objetivo atual
- em qual branch a sessao esta trabalhando
- qual tipo de tarefa sera executado
- quais arquivos precisam ser carregados antes de editar

## Passos obrigatorios

1. validar o contexto com `npm run context:check`
2. executar `./scripts/ai-run bootstrap`
3. ler `docs/session/current-state.md` antes de escolher a tarefa
4. selecionar a tarefa com `./scripts/ai-run task <tipo>`
5. carregar apenas os arquivos roteados pelo `task-map`
6. nao iniciar mudanca relevante antes de concluir os passos acima

## Prompt relacionado

- [prompts/bootstrap.md](../../prompts/bootstrap.md)

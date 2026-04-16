# Regras de Carregamento

Voltar para o [indice mestre](../index.md).

## Sempre carregar

- [AGENTS.md](../../AGENTS.md)
- [CONVENTIONS.md](../../CONVENTIONS.md)
- [POLICY_AI.md](../../POLICY_AI.md)
- [core.md](./core.md)
- [task-map.md](./task-map.md)
- [current-state.md](../session/current-state.md)

## Carregar por tarefa

- feature: [tasks/feature-workflow.md](../tasks/feature-workflow.md)
- bugfix: [tasks/bugfix-workflow.md](../tasks/bugfix-workflow.md)
- review: [tasks/review-workflow.md](../tasks/review-workflow.md)
- seguranca: [tasks/security-workflow.md](../tasks/security-workflow.md)
- hardware e serial: [tasks/hardware-workflow.md](../tasks/hardware-workflow.md)
- release: [tasks/release-workflow.md](../tasks/release-workflow.md)

## Carregar quando houver duvida recorrente

- comandos: [knowledge/commands.md](../knowledge/commands.md)
- problemas conhecidos: [knowledge/known-issues.md](../knowledge/known-issues.md)
- testes: [knowledge/testing.md](../knowledge/testing.md)
- serial e portas: [knowledge/serial-and-ports.md](../knowledge/serial-and-ports.md)
- sensores: [knowledge/sensors.md](../knowledge/sensors.md)

## Nao carregar por padrao

- [logbook/](../logbook/README.md)
- ADRs antigas
- historico detalhado de tentativas antigas

## Regra central

Use o [estado atual da sessao](../session/current-state.md) para saber onde o trabalho parou.

Use o [logbook](../logbook/README.md) apenas para reconstruir contexto historico quando o resumo atual nao for suficiente.

## Ordem recomendada de consulta

1. carregar contexto permanente
2. carregar estado atual da sessao
3. identificar o tipo de tarefa em [task-map.md](./task-map.md)
4. carregar apenas os arquivos do fluxo correspondente
5. consultar `knowledge/` quando houver duvida recorrente
6. consultar `logbook/` apenas se o estado atual nao explicar o passado relevante

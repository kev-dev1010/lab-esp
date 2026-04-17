# Estado Atual da Sessao

Voltar para o [indice mestre](../index.md).

## Objetivo atual

Fechar o modo assistido como fluxo oficial do projeto, com gate final consolidado, contrato da maquina local claro e sandbox tratado como opcional por necessidade.

## Branch ativa

- `test-context-validation`

## Onde estamos agora

- o bootstrap de nova sessao agora existe como fluxo oficial em `docs/context/task-map.md` e `docs/tasks/session-bootstrap-workflow.md`
- `./scripts/ai-run` virou o entrypoint oficial da automacao e grava estado local em `.ai/session-lock.json`
- `./scripts/ci` agora e apenas um wrapper para `./scripts/ai-run gates`, deixando o gate final sempre dentro do entrypoint oficial
- `./scripts/setup` agora valida os pre-requisitos obrigatorios da maquina antes de declarar o ambiente pronto
- `scripts/_ci-core` faz preflight, contexto e gates tecnicos, sempre chamado por `./scripts/ai-run gates`
- o contrato da maquina local agora esta documentado em `docs/knowledge/local-machine-contract.md`
- o papel opcional de sandbox e Docker no modo assistido agora esta documentado em `docs/knowledge/ai-operation-modes.md`
- os testes agora cobrem bootstrap explicito, roteamento de tarefa e enforcement local da sessao automatizada

## O que carregar na proxima sessao

- [README.md](../../README.md)
- [AGENTS.md](../../AGENTS.md)
- [CONVENTIONS.md](../../CONVENTIONS.md)
- [POLICY_AI.md](../../POLICY_AI.md)
- [docs/context/core.md](../context/core.md)
- [docs/context/loading-rules.md](../context/loading-rules.md)
- [docs/context/task-map.md](../context/task-map.md)
- [docs/knowledge/local-machine-contract.md](../knowledge/local-machine-contract.md)
- [docs/knowledge/ai-operation-modes.md](../knowledge/ai-operation-modes.md)
- [docs/tasks/session-bootstrap-workflow.md](../tasks/session-bootstrap-workflow.md)
- [docs/session/current-state.md](./current-state.md)

## O que nao carregar por padrao

- [logbook/](../logbook/README.md)

## Proximos passos provaveis

- colocar a maquina de trabalho dentro do contrato do projeto: Node.js 22 LTS, `npm`, `semgrep` e `gitleaks`
- decidir se o projeto realmente precisara de modo agentic no futuro antes de aprofundar a estrategia de sandbox
- evoluir de validacao minima de sandbox para isolamento agentico real apenas se `AI_MODE` mudar para `agentic`

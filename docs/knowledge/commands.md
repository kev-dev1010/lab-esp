# Comandos Usados

Voltar para o [indice mestre](../index.md).

## Comandos base do projeto

- `./scripts/setup`
- `npm run dev`
- `npm run context:server`
- `npm run context:check`
- `npm run build`
- `npm run lint`
- `npm run typecheck`
- `npm run test:coverage`
- `./scripts/ai-run bootstrap`
- `./scripts/ai-run task <tipo>`
- `./scripts/ai-run status`
- `./scripts/ai-run gates`
- `./scripts/ai-dry-run <tipo>`
- `./scripts/ci`
- `./scripts/security`

## Quando usar cada um

- `./scripts/setup`: caminho oficial para preparar a maquina e o repositorio antes do fluxo local; valida Node.js 22 LTS, `npm`, `semgrep` e `gitleaks`, instala dependencias npm e roda `npm run context:check`
- `npm run dev`: executar a entrada local da aplicacao
- `npm run build`: validar que o TypeScript compila
- `npm run context:server`: subir um servidor HTTP simples para inspecionar contexto, task-map, estado atual e validacoes basicas dos docs
- `npm run context:check`: falhar cedo quando o fluxo de contexto ou o enforcement local estiverem inconsistentes
- `npm run lint`: checar padrao de codigo
- `npm run typecheck`: validar tipos sem gerar build
- `npm run test:coverage`: rodar testes com cobertura
- `./scripts/ai-run bootstrap`: fazer o bootstrap obrigatorio da sessao automatizada
- `./scripts/ai-run task <tipo>`: travar a automacao no fluxo oficial de tarefa antes de qualquer mudanca relevante
- `./scripts/ai-run status`: mostrar se a sessao automatizada ja foi bootstrapada e qual tarefa esta ativa
- `./scripts/ai-run gates`: validar bootstrap e rodar os gates finais do projeto
- `./scripts/ai-dry-run <tipo>`: simular o roteamento de uma tarefa sem gravar estado local
- `./scripts/ci`: atalho compativel que delega obrigatoriamente para `./scripts/ai-run gates`
- `./scripts/security`: rodar auditoria de dependencias e checagens de seguranca, falhando se Semgrep, Gitleaks, `semgrep.yml` ou `.gitleaks.toml` estiverem ausentes

## Comando de manutencao

- `npm install`: atualizar dependencias quando isso for intencional; nao substitui `./scripts/setup` como preparo oficial do ambiente

## Pre-requisitos obrigatorios da maquina

- `npm`
- `node` 22 LTS
- `semgrep`
- `gitleaks`

Sem esses itens, a maquina nao esta pronta para executar o fluxo oficial local (`./scripts/setup`, `./scripts/security`, `./scripts/ai-run gates` e o wrapper `./scripts/ci`).

## Comandos que devem entrar aqui no futuro

- comandos de monitor serial
- comandos de upload de firmware
- comandos de reset de placa
- comandos de teste por sensor ou bancada

## Regra de documentacao

Se um comando passa a ser recorrente, ele deve entrar aqui com:

- proposito
- pre-requisitos
- exemplos de uso
- riscos ou observacoes

## Quando consultar este arquivo

- quando precisar lembrar um comando recorrente
- quando quiser documentar um comando novo que passou a fazer parte do fluxo

## Relacionados

- [local-machine-contract.md](./local-machine-contract.md)
- [ai-operation-modes.md](./ai-operation-modes.md)
- [testing.md](./testing.md)
- [serial-and-ports.md](./serial-and-ports.md)
- [task-map.md](../context/task-map.md)
- [current-state.md](../session/current-state.md)

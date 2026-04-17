# Contrato da Maquina Local

Voltar para o [indice mestre](../index.md).

## Objetivo

Definir quando a maquina local esta realmente pronta para executar o fluxo oficial do projeto.

## Uma maquina esta no contrato quando

- usa Node.js 22 LTS
- possui `npm`
- possui `semgrep`
- possui `gitleaks`
- consegue executar `./scripts/setup`
- consegue executar `npm run context:check`
- consegue executar `./scripts/ai-run gates`

## O que nao conta como maquina pronta

- conseguir rodar apenas `npm install`
- conseguir editar codigo, mas falhar nos gates locais
- depender de pular `./scripts/setup` ou de chamar comandos internos

## Comando oficial de preparo

- `./scripts/setup`

Esse comando e a entrada oficial para preparar a maquina e o repositorio no modo assistido.

Se ele falhar, a maquina ainda esta fora do contrato do projeto.

## Evidencia operacional

- `./scripts/setup` passa
- `./scripts/ai-run bootstrap` passa
- `./scripts/ai-run task <tipo>` passa
- `./scripts/ai-run gates` chega aos gates tecnicos do projeto

## Relacionados

- [commands.md](./commands.md)
- [ai-operation-modes.md](./ai-operation-modes.md)
- [current-state.md](../session/current-state.md)

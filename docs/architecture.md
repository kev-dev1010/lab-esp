# Arquitetura da Base

O projeto `lab-esp` foi organizado em camadas de responsabilidade.

## Camada 1: governanca

Arquivos da raiz definem regras, limites, stack, seguranca e estado atual do projeto.

## Camada 2: documentacao

`docs/` concentra explicacoes, decisoes e procedimentos permanentes.

## Camada 3: aplicacao

`src/` concentra o codigo principal da aplicacao em TypeScript.

## Camada 4: validacao

`tests/` concentra os testes, enquanto `scripts/` oferece os comandos de verificacao.

## Camada 5: automacao com IA

`prompts/` e `sandbox/` guardam modelos reutilizaveis e os limites para uma automacao futura mais forte.

## Camada 6: operacao e entrega

`infra/`, `Dockerfile` e `docs/runbooks/` sustentam ambientes, release e rollback.

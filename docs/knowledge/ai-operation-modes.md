# Modos de Operacao com IA

Voltar para o [indice mestre](../index.md).

## Modo assistido padrao

Este e o modo atual do projeto.

Nele:

- o humano continua no loop
- a automacao oficial passa por `./scripts/ai-run`
- bootstrap e selecao de tarefa sao obrigatorios
- o gate final oficial e `./scripts/ai-run gates`
- Docker nao e obrigatorio por padrao
- sandbox nao e obrigatorio por padrao

## Modo agentic futuro

Esse modo so deve existir quando o projeto realmente precisar de automacao com mais autonomia.

Nele:

- sandbox passa a ser exigencia de seguranca
- o escopo de escrita e rede precisa ser limitado
- comandos sensiveis precisam de governanca adicional

## Papel de sandbox e Docker

Sandbox e uma estrategia opcional por necessidade do projeto.

Docker nao e obrigatorio por padrao.

Eles podem ser uteis para reproducibilidade, isolamento ou operacao, mas nao devem ser tratados como requisito universal do modo assistido.

## Projetos com hardware real, serial ou dispositivos do host

Projetos que dependem de porta serial, dispositivos USB ou hardware real podem exigir execucao controlada no host.

Nesses casos:

- container pode ser inconveniente ou inviavel para o fluxo diario
- sandbox precisa ser avaliado com cuidado
- o projeto pode continuar no modo assistido sem isolamento total, desde que os guardrails locais estejam ativos

## Regra pratica

- modo assistido: fluxo oficial local + humano no loop
- modo agentic: so com necessidade real e isolamento apropriado

## Relacionados

- [local-machine-contract.md](./local-machine-contract.md)
- [../../POLICY_AI.md](../../POLICY_AI.md)
- [../../sandbox/README.md](../../sandbox/README.md)

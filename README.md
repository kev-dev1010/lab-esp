# lab-esp

Base confiavel para testar eletronica, sensores e comunicacao com ESP32 de forma organizada e repetivel.

O foco desta primeira fase e validar firmware, comunicacao serial, rotinas de teste e futuras experiencias com sensores ligados ao projeto de excentricidade de fio e cabo. Esta base nao busca entregar o produto industrial final, nem uma interface visual avancada, nuvem, app mobile ou automacoes complexas.

## Objetivo

- organizar um laboratorio de software para ESP32 com Node.js e TypeScript
- padronizar testes, comunicacao, scripts e verificacoes
- permitir crescimento controlado sem perder rastreabilidade
- manter a estrutura legivel tanto para pessoas tecnicas quanto nao tecnicas

## Comece por aqui

Se voce quer entender o repositorio sem entrar em detalhes tecnicos:

- `docs/index.md`
- `docs/guia-nao-tecnico.md`
- `docs/README.md`
- `docs/decisions.md`

Se voce quer comecar a desenvolver:

1. use Node.js 22 LTS
2. confirme que a maquina tem `npm`, `semgrep` e `gitleaks`
3. rode `./scripts/setup`
4. rode `./scripts/ai-run bootstrap`
5. rode `./scripts/ai-run task <tipo>`
6. rode `./scripts/ai-run gates`

## Pre-requisitos obrigatorios da maquina

- Node.js 22 LTS
- `npm`
- `semgrep`
- `gitleaks`

`./scripts/setup` valida esses pre-requisitos antes de instalar dependencias e falha se a maquina ainda nao consegue executar o fluxo oficial local.

## Modo assistido e sandbox

- o modo padrao do projeto e `assistido`
- Docker nao e obrigatorio por padrao
- sandbox nao e obrigatorio por padrao
- `./scripts/ai-run` organiza o fluxo oficial no host
- se o projeto precisar de automacao agentica no futuro, sandbox passa a ser uma decisao de seguranca, nao um requisito universal antecipado

Projetos com hardware real, porta serial ou dispositivos do host podem exigir execucao controlada fora de container.

## Stack definida

- linguagem: TypeScript
- runtime: Node.js 22 LTS
- gerenciador de pacotes: npm
- entrada principal da logica: `src/main.ts`
- wrapper de execucao local: `src/cli.ts`
- formatacao: Prettier
- lint: ESLint
- typecheck: TypeScript (`tsc`)
- testes: Vitest
- cobertura minima desejada: 80%
- CI: GitHub Actions

## Comandos principais

- `npm run dev`: executa a entrada principal em modo local
- `npm run build`: compila TypeScript para `dist/`
- `npm run context:check`: valida o fluxo de contexto e enforcement local
- `npm run format`: aplica formatacao
- `npm run format:check`: valida formatacao
- `npm run lint`: roda ESLint
- `npm run typecheck`: roda `tsc --noEmit`
- `npm run test`: roda testes
- `npm run test:coverage`: roda testes com cobertura
- `./scripts/setup`: valida pre-requisitos obrigatorios da maquina, instala dependencias npm e roda `npm run context:check`
- `./scripts/ai-run bootstrap`: faz o bootstrap obrigatorio da sessao automatizada
- `./scripts/ai-run task <tipo>`: obriga o roteamento da automacao via `task-map`
- `./scripts/ai-run gates`: valida bootstrap e executa os gates finais
- `./scripts/security`: roda auditoria npm e exige Semgrep, Gitleaks, `semgrep.yml` e `.gitleaks.toml`
- `./scripts/ci`: atalho compatível que delega obrigatoriamente para `./scripts/ai-run gates`

## Estrutura principal

- `src/`: codigo principal da aplicacao
- `tests/`: testes automatizados
- `docs/`: documentacao e procedimentos
- `prompts/`: modelos de instrucao para uso assistido de IA
- `scripts/`: comandos oficiais do projeto
- `sandbox/`: base para isolamento de uso agentico futuro
- `infra/`: organizacao dos ambientes e deploy

## Estado atual

Esta base ja esta pronta para iniciar desenvolvimento em TypeScript.

Ainda dependem de detalhamento futuro:

- desenho concreto dos modulos de comunicacao serial com ESP32
- contratos dos testes de hardware
- estrategia final de container de execucao
- tags e processo real de release

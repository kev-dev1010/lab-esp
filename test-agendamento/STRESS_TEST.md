# Stress Test da Fundacao

## Escopo

Validacao pratica da fundacao assistida antes e durante a implementacao do projeto temporario `test-agendamento/`.

## Status desta rodada

O bypass critico via `LAB_ESP_INTERNAL=1` foi corrigido.

- `assert-ci` e `mark-ci-passed` agora so aceitam execucao direta quando `NODE_ENV === "test"`.
- o fluxo oficial continua funcional porque `./scripts/ai-run gates` passou a chamar as funcoes exportadas sem expor os comandos internos.

## Bypasses encontrados

1. `LAB_ESP_INTERNAL=1 node --import tsx src/ai-flow.ts assert-ci` ainda permite chamar comandos internos sem passar por `./scripts/ai-run gates`.
2. `LAB_ESP_INTERNAL=1 node --import tsx src/ai-flow.ts mark-ci-passed` permite marcar a sessao como validada por variavel de ambiente.
3. `./scripts/format`, `./scripts/lint` e `./scripts/test` continuam executaveis diretamente, sem bootstrap nem task selection. Isso e um bypass operacional do fluxo assistido, embora o gate final oficial ainda seja `./scripts/ai-run gates`.

## Problemas de fluxo encontrados

1. `docs/session/current-state.md` estava com branch stale e bloqueava o bootstrap na branch real `test/all-scenarios-validation`.
2. A suite de testes estava acoplada a `test-context-validation`, o que quebrava o repositorio quando `current-state.md` era atualizado para a branch corrente.
3. `./scripts/ai-run gates` nao pode concluir neste ambiente porque o contrato exige Node.js 22 LTS e a maquina atual esta em `v25.9.0`.
4. O gate de seguranca tambem sofre com o ambiente: `semgrep` precisa gravar estado fora do workspace e falha dentro do sandbox se `HOME` nao for ajustado.

## Fluxo de nova sessao

- `bootstrap` voltou a funcionar depois da correcao minima em `current-state.md`.
- `feature`, `bugfix` e `review` rotearam corretamente por `task-map`.
- `status` e `dry-run` seguem uteis para orientar a sessao.

## Gates

- `format`: falhou com um arquivo JS mal formatado e voltou a passar apos limpeza.
- `lint`: falhou com probe deliberado e tambem revelou a necessidade de tratar os globais de browser/Node do projeto JS isolado.
- `test`: falhou com um teste quebrado proposital e voltou a passar depois da remocao do probe.
- `security`: `semgrep --error` falhou com `console.log` em `src/semgrep-probe.ts`. O `gitleaks` com probes sinteticos nao acusou vazamento no contexto atual, entao a verificacao pratica ficou parcial. O script oficial de seguranca continua bloqueado aqui pelo contrato de Node 22.

## Ergonomia

### Ajudou

- `task-map` deixa claro o pacote minimo de contexto por tipo de tarefa.
- `bootstrap` e `task` tornam o fluxo explicito e rastreavel.
- `current-state` e util quando esta alinhado com a branch real.

### Atrapalhou

- branch hardcoded em documentacao viva gera bloqueio desnecessario.
- acoplamento da suite a uma branch fixa reduz a confiabilidade do proprio repositorio.
- o gate oficial depende fortemente do contrato exato da maquina, entao qualquer desvio de Node trava a esteira inteira.

### Parece excesso

- exigir branch fixa em `current-state.md` sem mecanismo de sincronizacao automatica.
- expor comandos internos no binario e depender apenas de variavel de ambiente para impedir uso.

### Parece indispensavel

- `npm run context:check`
- `./scripts/ai-run bootstrap`
- `./scripts/ai-run task <tipo>`
- validacao final centralizada em `./scripts/ai-run gates`

## Veredito

A fundacao aguenta uso real simples, mas ainda nao esta blindada.

Ela foi suficiente para conduzir uma tarefa pratica completa sem baguncar o repositorio principal, desde que:

1. o estado da sessao esteja coerente com a branch real;
2. a suite nao dependa de branch hardcoded;
3. a maquina esteja no contrato certo;
4. o bypass por variavel de ambiente seja tratado em iteracao futura.

Resultado: modo assistido validado para uso pratico simples, mas com bypass residual e fragilidade operacional ainda aberta.

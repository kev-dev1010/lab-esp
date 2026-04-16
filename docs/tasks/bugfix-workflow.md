# Fluxo de Bugfix

Voltar para o [indice mestre](../index.md).

## Carregar antes de começar

- [core.md](../context/core.md)
- [current-state.md](../session/current-state.md)
- [known-issues.md](../knowledge/known-issues.md)
- [testing.md](../knowledge/testing.md)

## Este fluxo deve responder

- como reproduzir
- evidencias coletadas
- menor correcao viavel
- como evitar regressao

## Passos sugeridos

1. registrar sintoma e contexto
2. tentar reproduzir de forma confiavel
3. identificar se o bug e de software, integracao ou hardware
4. criar ou ajustar teste para capturar a regressao
5. corrigir com a menor mudanca possivel
6. validar com `./scripts/ci`
7. se o problema for recorrente, registrar em [known-issues.md](../knowledge/known-issues.md)

## Prompt relacionado

- [prompts/bugfix.md](../../prompts/bugfix.md)

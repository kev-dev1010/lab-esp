# Fluxo de Seguranca

Voltar para o [indice mestre](../index.md).

## Carregar antes de começar

- [core.md](../context/core.md)
- [current-state.md](../session/current-state.md)
- [commands.md](../knowledge/commands.md)
- [SECURITY.md](../../SECURITY.md)

## Este fluxo deve responder

- superficie de risco
- segredos e credenciais
- validacao de entrada
- logs e exposicao indevida

## Checklist minimo

- a mudanca introduz dado sensivel novo?
- existe risco de logar segredo ou identificador sensivel?
- entradas externas estao sendo validadas?
- algum comando perigoso pode ser executado sem validacao?
- a mudanca pede atualizacao em `POLICY_AI.md` ou `SECURITY.md`?

## Prompt relacionado

- [prompts/security_review.md](../../prompts/security_review.md)

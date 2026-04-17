# Fluxo de Release

Voltar para o [indice mestre](../index.md).

## Carregar antes de começar

- [session-bootstrap-workflow.md](./session-bootstrap-workflow.md)
- [current-state.md](../session/current-state.md)
- [runbooks/deploy.md](../runbooks/deploy.md)
- [runbooks/rollback.md](../runbooks/rollback.md)

## Este fluxo deve responder

- o que precisa estar validado
- como publicar
- como voltar atras
- o que registrar depois

## Checklist minimo

- `./scripts/ai-run gates` passou
- a versao ou tag foi definida
- o criterio de release esta claro
- rollback esta entendido antes da publicacao
- changelog e registros foram atualizados
- se a release mudou estrutura ou responsabilidades do projeto, `docs/guia-nao-tecnico.md` foi revisado

## Prompt relacionado

- [prompts/release_notes.md](../../prompts/release_notes.md)

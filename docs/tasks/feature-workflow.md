# Fluxo de Feature

Voltar para o [indice mestre](../index.md).

## Carregar antes de começar

- [core.md](../context/core.md)
- [current-state.md](../session/current-state.md)
- [testing.md](../knowledge/testing.md)

## Este fluxo deve responder

- criterio de aceitacao
- arquivos impactados
- testes a criar ou ajustar
- verificacoes finais

## Passos sugeridos

1. definir claramente o comportamento esperado
2. mapear os arquivos que provavelmente serao afetados
3. decidir quais testes automatizados cobrem a mudanca
4. decidir se existe parte dependente de hardware
5. implementar em mudancas pequenas
6. validar com `./scripts/ci`
7. atualizar documentacao se a feature mudar fluxo, comando ou estrutura
8. se algum arquivo ou diretorio foi adicionado, removido, renomeado ou teve sua responsabilidade alterada, atualizar tambem `docs/guia-nao-tecnico.md`

## Se envolver hardware

Consultar tambem:

- [hardware-workflow.md](./hardware-workflow.md)
- [serial-and-ports.md](../knowledge/serial-and-ports.md)
- [sensors.md](../knowledge/sensors.md)

## Prompt relacionado

- [prompts/feature.md](../../prompts/feature.md)

# Documentacao

Esta pasta reune os materiais que explicam como o repositorio esta organizado e como ele deve evoluir.

## Comece por aqui

- `index.md`: indice mestre de navegacao
- `guia-nao-tecnico.md`: explicacao simples do papel de cada pasta e arquivo
- `o-que-a-base-ja-faz.md`: resumo simples do que a base ja entrega e do que ainda falta
- `checklist-alinhamento-pdfs.md`: lista rastreavel do que ja foi absorvido dos PDFs e do que ainda falta
- `knowledge/local-machine-contract.md`: define o que significa uma maquina estar no contrato do projeto
- `knowledge/ai-operation-modes.md`: separa modo assistido atual, modo agentic futuro e papel opcional de sandbox/Docker
- `architecture.md`: visao estrutural do projeto
- `decisions.md`: indice rapido das principais decisoes

## Subpastas

- `context/` guarda o contexto que deve ou pode ser carregado em sessoes novas
- `knowledge/` guarda conhecimento recorrente por dominio
- `tasks/` guarda fluxos por tipo de trabalho
- `session/` guarda o estado vivo da sessao atual
- `logbook/` guarda historico cronologico, nao obrigatorio em toda sessao
- `adr/` guarda registros formais de decisoes importantes
- `runbooks/` guarda procedimentos operacionais

## Navegacao recomendada

- `index.md` para encontrar o arquivo certo por objetivo
- `context/` e `tasks/session-bootstrap-workflow.md` para bootstrap de novas sessoes
- `session/` para saber onde o trabalho esta agora
- `logbook/` apenas para historico e auditoria

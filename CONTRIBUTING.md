# Como Contribuir

Este repositorio foi preparado para crescer de forma organizada.

## Antes de mudar qualquer coisa

- entenda o objetivo da mudanca
- veja a documentacao em `docs/`
- confirme se a mudanca afeta testes, comunicacao com hardware ou seguranca

## Fluxo sugerido

1. preparar a mudanca
2. rodar `npm install` se for o primeiro setup
3. executar `./scripts/ci`
4. revisar impacto
5. atualizar documentacao se necessario

## Quando atualizar documentacao

- quando uma pasta ganhar nova responsabilidade
- quando um arquivo central mudar de funcao
- quando surgir um novo procedimento operacional
- quando houver uma decisao relevante de arquitetura
- quando um fluxo de teste com ESP32 mudar

## Onde registrar cada tipo de coisa

- explicacoes gerais: `docs/`
- decisoes: `docs/adr/`
- operacao: `docs/runbooks/`
- regras do projeto: arquivos da raiz

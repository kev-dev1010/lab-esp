# Checklist de Alinhamento com os PDFs

Este documento transforma as ideias principais dos PDFs de referencia em uma lista rastreavel do que ja foi coberto e do que ainda falta preencher no projeto.

## Como usar

- use este arquivo para acompanhar o quanto a base real ja esta alinhada com a fundacao proposta nos PDFs
- marque o que ja estiver realmente implementado, e nao apenas esbocado
- quando um item sair do papel e virar pratica real, atualize este checklist

## O que ja esta bem encaminhado

- [x] contexto versionado do projeto em arquivos centrais
- [x] prompts versionados em `prompts/`
- [x] gates de validacao local
- [x] CI basico no GitHub
- [x] postura inicial de seguranca
- [x] separacao entre contexto permanente, contexto por tarefa, estado atual e historico
- [x] preparacao para sandbox agentico futuro
- [x] documentacao navegavel por indice
- [x] bootstrap explicito de nova sessao
- [x] entrypoint unico de automacao para forcar bootstrap e selecao de tarefa
- [x] gate final oficial consolidado em `./scripts/ai-run gates`
- [x] contrato da maquina local explicitado
- [x] papel opcional de sandbox e Docker documentado

## O que ainda falta preencher com conteudo real

- [ ] registrar comandos reais de serial, firmware e bancada em `docs/knowledge/commands.md`
- [ ] registrar portas, baud rates e sintomas reais em `docs/knowledge/serial-and-ports.md`
- [ ] registrar sensores reais testados e observacoes em `docs/knowledge/sensors.md`
- [ ] registrar problemas recorrentes reais em `docs/knowledge/known-issues.md`
- [ ] preencher a estrategia de testes com casos reais do laboratorio em `docs/knowledge/testing.md`

## O que ainda falta sair de placeholder

- [ ] transformar `docs/runbooks/deploy.md` em procedimento real
- [ ] transformar `docs/runbooks/rollback.md` em procedimento real
- [ ] transformar `docs/runbooks/incident.md` em procedimento real
- [ ] definir `SBOM_POLICY` em `AGENTS.md`
- [x] deixar `scripts/ai-run` operacional
- [x] deixar `scripts/ai-jail-enable` operacional como validador minimo de sandbox
- [x] deixar `scripts/ai-dry-run` operacional

## O que ainda falta para o uso de IA ficar mais maduro

- [ ] fortalecer os prompts com formato de saida, criterios de pronto e evidencias obrigatorias
- [ ] criar uma camada de evals ou regressao de prompts
- [ ] definir se o projeto vai adotar saidas estruturadas com schema
- [ ] decidir se o baseline de seguranca no GitHub vai incluir CodeQL

## Quando este arquivo deve ser atualizado

- quando um item acima sair do papel
- quando surgir uma nova exigencia inspirada nos PDFs
- quando a estrutura do projeto mudar de forma relevante

## Relacionados

- [Guia nao tecnico](./guia-nao-tecnico.md)
- [O que a base ja faz](./o-que-a-base-ja-faz.md)
- [Indice mestre](./index.md)

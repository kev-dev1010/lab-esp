# Guia Nao Tecnico do Projeto

Este documento foi escrito para quem nao programa no dia a dia, mas precisa entender como o projeto esta organizado, onde cada assunto fica e como navegar pelos arquivos sem se perder.

## O que e o `lab-esp`

O `lab-esp` e uma base de trabalho para testes com ESP32, sensores e comunicacao serial.

Ele foi montado para que o time consiga:

- testar ideias com mais ordem
- repetir validacoes com menos improviso
- registrar o que funcionou e o que deu problema
- preparar o projeto para crescer sem virar bagunca

O projeto ainda nao e o produto final industrial. Nesta fase, ele e uma base de laboratorio e validacao.

## O que esta base ja entrega

Hoje o projeto ja oferece:

- uma organizacao clara de arquivos e pastas
- comandos principais para instalar, validar, testar e checar seguranca
- testes automatizados iniciais
- esteira de validacao local e no GitHub
- documentacao separada por tipo de uso
- modelos de prompt para tarefas recorrentes com IA
- um jeito de separar o que e contexto permanente, o que e tarefa atual e o que e historico
- preparacao para um uso futuro de IA com mais autonomia, mas com limites

Se voce quiser um resumo mais focado em capacidades e configuracoes, veja [o-que-a-base-ja-faz.md](./o-que-a-base-ja-faz.md).

## Como pensar a documentacao

A documentacao agora foi dividida em quatro camadas principais:

- contexto permanente: o que quase sempre precisa ser consultado
- contexto por tarefa: o que so entra quando a tarefa pede
- estado atual: onde o trabalho esta agora
- historico: o que aconteceu no passado

Essa separacao existe para evitar um problema comum: usar diario antigo como se fosse resumo atual.

## Onde comecar

Se voce quer se localizar rapido, use esta ordem:

1. [docs/index.md](./index.md): indice mestre da documentacao
2. [README.md](../README.md): visao geral do projeto
3. [AGENTS.md](../AGENTS.md): definicoes oficiais do projeto
4. [docs/session/current-state.md](./session/current-state.md): onde o trabalho esta agora

## O que cada grupo de arquivos faz

### Arquivos da raiz

Esses arquivos guardam as regras principais do projeto.

#### `README.md`

E a porta de entrada do projeto. Resume objetivo, stack, comandos e estado atual.

#### `AGENTS.md`

Guarda as definicoes oficiais do projeto: o que ele quer resolver, stack escolhida, regras de qualidade, seguranca, deploy e contexto minimo para novas sessoes.

#### `CONVENTIONS.md`

Guarda os combinados de organizacao e manutencao. E onde ficam as regras de como trabalhar neste repositorio.

#### `POLICY_AI.md`

Explica como IA pode ser usada aqui, o que nao pode ser enviado para modelos e quais limites devem existir.

#### `SECURITY.md`

Resume a postura de seguranca do projeto e quais ferramentas foram escolhidas.

#### `CHANGELOG.md`

Registra mudancas relevantes do projeto ao longo do tempo.

#### `CONTRIBUTING.md`

Explica como contribuir de forma organizada.

#### `.env.example`

Mostra quais configuracoes de ambiente podem existir, sem guardar valores reais.

#### `package.json`

E o centro da configuracao do projeto em Node.js. Ele define scripts e dependencias.

#### `tsconfig.json`, `eslint.config.js`, `.prettierrc.json`, `vitest.config.ts`

Esses arquivos definem como o projeto valida codigo, formata arquivos e roda testes.

#### `Dockerfile`

Prepara uma forma padronizada de executar o projeto em container.

## Pasta `docs/`

Esta e a biblioteca principal do projeto.

### `docs/index.md`

E o mapa principal da documentacao. Quem nao sabe por onde comecar deve abrir esse arquivo.

### `docs/README.md`

Resume como a documentacao foi dividida.

### `docs/guia-nao-tecnico.md`

Este arquivo. Ele ajuda pessoas nao tecnicas a entenderem o projeto.

### `docs/o-que-a-base-ja-faz.md`

Explica, em linguagem simples, o que a base ja entrega, o que esta configurado e o que ainda nao esta pronto.

### `docs/context/`

Guarda o contexto que tende a ser carregado com frequencia.

#### `docs/context/core.md`

Resume o projeto, o objetivo, os limites e a stack atual.

#### `docs/context/loading-rules.md`

Explica o que deve ser carregado sempre, o que deve ser carregado por tarefa e o que nao deve ser carregado por padrao.

#### `docs/context/task-map.md`

Funciona como um roteador. Ele diz quais arquivos consultar para cada tipo de trabalho.

### `docs/tasks/`

Guarda os fluxos por tipo de tarefa.

Ali ficam orientacoes para:

- implementar feature
- corrigir bug
- revisar mudanca
- revisar seguranca
- trabalhar com hardware e serial
- preparar release

### `docs/knowledge/`

Guarda conhecimento recorrente do projeto.

Ali devem entrar, com o tempo:

- comandos usados com frequencia
- problemas conhecidos
- estrategia de testes
- conhecimento sobre portas, serial e sensores
- glossario

### `docs/session/`

Guarda o estado vivo do trabalho atual.

#### `docs/session/current-state.md`

Mostra onde o projeto e a sessao estao agora.

Esse arquivo deve ser curto e direto.

#### `docs/session/update-template.md`

Serve como modelo para atualizar o estado da sessao.

### `docs/logbook/`

Guarda o historico cronologico.

Esse historico nao e a mesma coisa que o estado atual.

#### `docs/logbook/README.md`

Explica como o logbook deve ser usado.

#### `docs/logbook/entry-template.md`

Serve como modelo para registrar acontecimentos.

### `docs/runbooks/`

Guarda os procedimentos operacionais, como deploy, rollback e incidente.

Hoje esses arquivos existem, mas ainda precisam ser preenchidos com o fluxo real.

### `docs/adr/`

Guarda decisoes importantes de forma registrada.

## Pasta `prompts/`

Guarda modelos de prompt para tarefas recorrentes com IA.

Hoje existem prompts para:

- feature
- bugfix
- review
- seguranca
- release notes

Esses arquivos ajudam a padronizar como uma tarefa e pedida.

## Pasta `scripts/`

Esta pasta concentra os comandos oficiais do projeto.

### `scripts/setup`

Prepara o ambiente local.

### `scripts/format`

Valida formatacao.

### `scripts/lint`

Valida padrao e consistencia.

### `scripts/test`

Roda testes e cobertura.

### `scripts/security`

Roda checagens de seguranca.

### `scripts/ci`

Executa o fluxo principal de verificacao do projeto.

### `scripts/deploy` e `scripts/rollback`

Existem como base, mas ainda dependem da definicao operacional completa.

### `scripts/ai-dry-run`, `scripts/ai-run` e `scripts/ai-jail-enable`

Existem para preparar um uso mais controlado de IA no futuro.

## Pasta `src/`

Guarda o codigo principal da aplicacao.

### `src/main.ts`

Guarda a logica principal atual.

### `src/cli.ts`

Guarda a forma de executar o projeto localmente sem misturar isso com a logica principal.

## Pasta `tests/`

Guarda os testes automatizados.

Hoje ela ja inclui:

- um teste da base da aplicacao
- um teste da navegacao e integridade da documentacao

## Pasta `sandbox/`

Guarda a preparacao para uma futura automacao mais autonoma com IA em ambiente isolado.

## Pasta `infra/`

Organiza ambientes e responsabilidade de deploy.

## Pasta `.github/workflows/`

Guarda as automacoes do GitHub, como validacao continua e checagens de seguranca.

## Pasta `.devcontainer/`

Guarda um ambiente padronizado por container para desenvolvimento, se isso for usado.

## Como decidir qual arquivo abrir

- quer entender o projeto em alto nivel: `README.md`
- quer se localizar na documentacao: `docs/index.md`
- quer uma explicacao simples do projeto: `docs/guia-nao-tecnico.md`
- quer entender o que a base ja faz: `docs/o-que-a-base-ja-faz.md`
- quer ver definicoes oficiais: `AGENTS.md`
- quer ver regras do repositorio: `CONVENTIONS.md`
- quer ver limites de IA: `POLICY_AI.md`
- quer saber onde o trabalho esta agora: `docs/session/current-state.md`
- quer consultar historico antigo: `docs/logbook/`
- quer ver um procedimento operacional: `docs/runbooks/`

## Resumo final

Hoje o projeto ja tem uma base solida de organizacao, validacao, seguranca e documentacao.

O que falta agora nao e estrutura. O que falta e preencher varios desses arquivos com o conhecimento real da bancada, dos sensores, das portas, dos comandos e dos problemas encontrados no uso diario.

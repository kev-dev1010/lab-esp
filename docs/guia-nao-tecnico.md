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
- um bloco de estado atual da sessao, separado do historico bruto
- um servidor HTTP simples para inspecionar o sistema de contexto e validar a coerencia basica da documentacao
- preparacao para um uso futuro de IA com mais autonomia, mas com limites

Se voce quiser um resumo mais focado em capacidades e configuracoes, veja [o-que-a-base-ja-faz.md](./o-que-a-base-ja-faz.md).

Se voce quiser acompanhar o que ainda falta para ficar alinhado com os PDFs usados como referencia, veja [checklist-alinhamento-pdfs.md](./checklist-alinhamento-pdfs.md).

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

## Regra importante de manutencao

Sempre que o projeto ganhar, perder, renomear ou mudar a responsabilidade de um arquivo ou diretorio importante, este guia deve ser atualizado.

Em outras palavras: se a estrutura muda, o guia nao tecnico precisa refletir essa mudanca.

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

Agora ele tambem inclui scripts para subir um servidor de validacao de contexto e para validar o enforcement local do fluxo.

#### `tsconfig.json`, `eslint.config.js`, `.prettierrc.json`, `vitest.config.ts`

Esses arquivos definem como o projeto valida codigo, formata arquivos e roda testes.

#### `src/context-docs.ts`, `src/context-server.ts` e `src/ai-flow.ts`

Esses arquivos implementam um servidor simples que le a documentacao do projeto e responde endpoints para:

- saude do sistema
- resumo do contexto central
- simulacao de carregamento por tipo de tarefa
- leitura do estado atual
- validacao basica da consistencia dos arquivos Markdown

Eles agora tambem implementam o enforcement do fluxo de automacao:

- bootstrap obrigatorio de sessao
- roteamento obrigatorio por tipo de tarefa
- estado local da sessao automatizada
- falha dura quando o contexto versionado estiver inconsistente

#### `Dockerfile`

Prepara uma forma padronizada opcional de executar o projeto em container.

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

### `docs/checklist-alinhamento-pdfs.md`

Mostra, em formato de checklist, o que ja foi absorvido dos PDFs de referencia e o que ainda falta virar pratica real no projeto.

### `docs/context/`

Guarda o contexto que tende a ser carregado com frequencia.

#### `docs/context/core.md`

Resume o projeto, o objetivo, os limites e a stack atual.

#### `docs/context/loading-rules.md`

Explica o que deve ser carregado sempre, o que deve ser carregado por tarefa e o que nao deve ser carregado por padrao.

#### `docs/context/task-map.md`

Funciona como um roteador. Ele diz quais arquivos consultar para cada tipo de trabalho.

Agora ele tambem inclui o bootstrap explicito de nova sessao como um fluxo oficial.

### `docs/tasks/`

Guarda os fluxos por tipo de tarefa.

Ali ficam orientacoes para:

- bootstrap de nova sessao
- implementar feature
- corrigir bug
- revisar mudanca
- revisar seguranca
- trabalhar com hardware e serial
- preparar release

Esses fluxos agora tambem devem lembrar que mudancas estruturais do projeto precisam ser refletidas neste guia nao tecnico.

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

- bootstrap
- feature
- bugfix
- review
- seguranca
- release notes

Esses arquivos ajudam a padronizar como uma tarefa e pedida.

## Pasta `scripts/`

Esta pasta concentra os comandos oficiais do projeto.

### `scripts/setup`

Prepara o ambiente local de forma consistente com o fluxo oficial.

Agora ele:

- valida os pre-requisitos obrigatorios da maquina
- instala dependencias npm
- roda o gate inicial de contexto

Se Node.js 22 LTS, `npm`, `semgrep` ou `gitleaks` estiverem ausentes, ele falha em vez de fingir que o ambiente esta pronto.

### `scripts/format`

Valida formatacao.

### `scripts/lint`

Valida padrao e consistencia.

### `scripts/test`

Roda testes e cobertura.

### `scripts/security`

Roda checagens de seguranca.

Agora ele falha se as ferramentas obrigatorias ou os arquivos de configuracao do gate estiverem ausentes.

### `scripts/ci`

Agora ele nao executa mais a esteira por conta propria.

Ele existe como um atalho compativel que redireciona obrigatoriamente para `scripts/ai-run gates`.

O trabalho tecnico da esteira ficou concentrado em `scripts/_ci-core`, sempre chamado pelo gate oficial.

### `scripts/deploy` e `scripts/rollback`

Existem como base, mas ainda dependem da definicao operacional completa.

### `scripts/ai-dry-run`, `scripts/ai-run` e `scripts/ai-jail-enable`

Agora esses scripts deixaram de ser apenas preparacao:

- `scripts/ai-run` virou o entrypoint oficial da automacao
- `scripts/ai-dry-run` simula o roteamento sem gravar estado
- `scripts/ai-jail-enable` valida a configuracao minima de sandbox antes de qualquer uso agentico futuro

## Pasta `.ai/`

Pode aparecer localmente durante o uso de automacao.

Ela guarda um pequeno estado de sessao (`session-lock.json`) para impedir que a automacao pule bootstrap ou selecao de tarefa.

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

Ela nao e obrigatoria para o modo assistido atual.

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
- quer ver o que ainda falta em relacao aos PDFs: `docs/checklist-alinhamento-pdfs.md`
- quer ver definicoes oficiais: `AGENTS.md`
- quer ver regras do repositorio: `CONVENTIONS.md`
- quer ver limites de IA: `POLICY_AI.md`
- quer saber onde o trabalho esta agora: `docs/session/current-state.md`
- quer consultar historico antigo: `docs/logbook/`
- quer ver um procedimento operacional: `docs/runbooks/`

## Resumo final

Hoje o projeto ja tem uma base solida de organizacao, validacao, seguranca e documentacao.

O que falta agora nao e mais apenas estrutura documental. O fluxo principal de automacao ja tem enforcement local.

Os gaps restantes estao concentrados em conteudo operacional real e no futuro modo agentico completo.

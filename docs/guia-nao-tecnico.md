# Guia Nao Tecnico da Estrutura do Repositorio

Este documento foi escrito para quem nao programa no dia a dia, mas precisa entender como este repositorio esta organizado, onde cada assunto fica e qual arquivo procurar em cada situacao.

## O que este projeto faz

O projeto `lab-esp` e uma base de trabalho para testes com ESP32. Ele foi preparado para ajudar a validar firmware, comunicacao serial, sensores e rotinas de teste de forma organizada.

Ele ainda nao e o produto industrial final. Nesta fase, ele funciona como base de laboratorio e validacao.

## Como pensar esta estrutura

Este repositorio foi dividido em blocos de responsabilidade:

- arquivos da raiz explicam regras gerais e configuracoes principais
- `docs/` guarda explicacoes e procedimentos
- `src/` guarda o codigo principal
- `tests/` guarda os testes automatizados
- `scripts/` guarda os comandos oficiais
- `prompts/` guarda modelos de instrucao reutilizaveis
- `sandbox/` prepara o isolamento para automacao futura com IA
- `infra/` organiza ambientes e deploy

## Arquivos da raiz

### `README.md`

E a porta de entrada do projeto. Resume objetivo, stack escolhida, comandos e estado atual.

### `AGENTS.md`

Guarda as definicoes centrais do projeto. Mesmo tendo nome tecnico, ele funciona como ficha oficial das escolhas feitas.

### `CONVENTIONS.md`

Guarda os combinados de organizacao do repositorio e do codigo.

### `POLICY_AI.md`

Explica como IA pode ser usada e quais sao os limites de seguranca e revisao humana.

### `SECURITY.md`

Resume a postura de seguranca do projeto e as ferramentas adotadas para isso.

### `CONTRIBUTING.md`

Explica como contribuir de forma organizada.

### `CHANGELOG.md`

Registra mudancas importantes ao longo do tempo.

### `.env.example`

Mostra quais configuracoes podem existir no ambiente local, sem guardar valores reais.

### `.editorconfig`

Padroniza regras basicas de edicao de arquivos.

### `.gitignore`

Lista arquivos e pastas que nao devem entrar no versionamento.

### `.gitattributes`

Ajuda a manter consistencia tecnica entre arquivos versionados.

### `.tool-versions`

Registra a versao principal esperada de Node.js.

### `package.json`

E o arquivo central do projeto Node.js. Ele registra nome, scripts, dependencias e regras basicas de execucao.

### `tsconfig.json`

Define como o TypeScript deve ser validado e compilado.

### `eslint.config.js`

Define as regras de verificacao de qualidade do codigo.

### `.prettierrc.json`

Define as regras de formatacao automatica dos arquivos.

### `vitest.config.ts`

Define como os testes automatizados rodam e qual cobertura minima e desejada.

### `semgrep.yml`

Guarda a configuracao inicial de analise estatica de seguranca.

### `.gitleaks.toml`

Guarda a configuracao inicial do scanner de segredos.

### `Dockerfile`

Prepara uma imagem container para executar o projeto em ambiente controlado.

## Pasta `docs/`

E a biblioteca principal do repositorio.

### `docs/README.md`

Indice da documentacao.

### `docs/guia-nao-tecnico.md`

Este arquivo. O objetivo dele e facilitar leitura por quem nao e tecnico.

### `docs/architecture.md`

Explica a estrutura esperada do projeto e como as partes se conectam.

### `docs/decisions.md`

Resume as principais decisoes tomadas.

### `docs/adr/`

Guarda registros formais de decisoes relevantes.

### `docs/runbooks/`

Guarda procedimentos operacionais como deploy, rollback e incidentes.

## Pasta `src/`

Guarda o codigo principal da aplicacao.

### `src/main.ts`

E o ponto de entrada definido para o projeto.

### `src/cli.ts`

E o arquivo usado para executar a aplicacao localmente sem misturar essa responsabilidade com a logica principal.

## Pasta `tests/`

Guarda os testes automatizados.

### `tests/main.test.ts`

Teste inicial da base para confirmar que a estrutura esta funcionando.

## Pasta `scripts/`

E o centro operacional da base. Aqui ficam os comandos oficiais do projeto.

### `scripts/setup`

Prepara o ambiente local e instala dependencias.

### `scripts/format`

Aplica formatacao automatica.

### `scripts/lint`

Executa verificacoes de qualidade de codigo.

### `scripts/test`

Executa testes e cobertura.

### `scripts/security`

Executa verificacoes de seguranca.

### `scripts/ci`

Executa a sequencia principal de validacao do projeto.

### `scripts/deploy`

Reservado para publicacao controlada.

### `scripts/rollback`

Reservado para reversao de release.

### `scripts/ai-dry-run`

Reservado para simulacao de automacao com IA.

### `scripts/ai-run`

Reservado para execucao controlada de automacao com IA.

### `scripts/ai-jail-enable`

Reservado para ativar isolamento em um modo agentico futuro.

### `scripts/_lib.sh`

Biblioteca de apoio para os demais scripts.

## Pasta `prompts/`

Guarda modelos de instrucao para tarefas recorrentes com IA assistida.

## Pasta `sandbox/`

Guarda a preparacao para automacao futura com IA em ambiente isolado.

## Pasta `infra/`

Organiza ambientes e responsabilidade de deploy.

## Pasta `.github/workflows/`

Guarda as automacoes do GitHub, como validacao continua e checagens de seguranca.

## Pasta `.devcontainer/`

Guarda um ambiente padronizado por container para desenvolvimento, caso seja usado.

## Quando procurar cada lugar

- quer entender o projeto em alto nivel: `README.md`
- quer localizar responsabilidades de cada parte: `docs/guia-nao-tecnico.md`
- quer ver escolhas oficiais do projeto: `AGENTS.md`
- quer entender regras do repositorio: `CONVENTIONS.md`
- quer saber limites de uso de IA: `POLICY_AI.md`
- quer um procedimento operacional: `docs/runbooks/`
- quer saber como executar validacoes: `scripts/`
- quer ver historico de mudancas: `CHANGELOG.md`

# O Que a Base Ja Faz

Este documento explica, em linguagem simples, o que a base do projeto `lab-esp` ja entrega hoje, quais escolhas ja foram feitas e o que ainda depende de preenchimento futuro.

## Visao geral

Esta base foi montada para evitar que o projeto comece de forma improvisada.

Em vez de depender de memoria, conversas soltas ou arquivos espalhados, ela ja organiza:

- como o projeto e descrito
- como ele e validado
- como a documentacao e encontrada
- como o uso de IA e limitado
- como o time pode trabalhar com mais consistencia

## O que ela ja faz hoje

### 1. Organiza o projeto

A base ja separa:

- codigo
- testes
- comandos
- documentacao
- conhecimento recorrente
- estado atual da sessao
- historico cronologico

Isso evita que tudo vire uma unica pasta de anotações.

### 2. Deixa claro o que e regra do projeto

Os arquivos principais da raiz ja registram:

- objetivo do projeto
- limites desta fase
- stack escolhida
- regras de qualidade
- politica de seguranca
- politica de uso de IA

Isso reduz ambiguidade e retrabalho.

### 3. Ja tem validacao automatica

Hoje a base ja consegue validar:

- formatacao dos arquivos
- padrao e consistencia do codigo
- tipos
- testes
- cobertura
- auditoria basica de seguranca

Isso quer dizer que o projeto ja tem um caminho minimo para verificar se algo continua saudavel depois de uma mudanca.

### 4. Ja tem uma esteira local e no GitHub

Existe validacao local por comandos e validacao remota via GitHub Actions.

Na pratica, isso significa que o projeto ja nasceu com uma linha de defesa contra mudancas quebradas.

Agora a esteira local tambem falha cedo se o contexto versionado estiver incoerente.

E o `setup` agora nao declara mais o ambiente como pronto se a maquina ainda nao tiver os pre-requisitos obrigatorios dos gates locais.

O gate final local agora tambem passa obrigatoriamente por `./scripts/ai-run gates`, reduzindo a chance de pular bootstrap ou selecao de tarefa.

### 5. Ja tem uma forma de usar IA com mais ordem

A base ja separa:

- contexto que sempre deve ser consultado
- contexto que so entra quando a tarefa pede
- estado atual da sessao
- historico bruto
- prompts reutilizaveis

Essa organizacao foi inspirada nos PDFs de referencia e ajuda a economizar contexto em sessoes futuras.

Agora a automacao tambem precisa passar por um bootstrap explicito de sessao e por um roteamento de tarefa antes de seguir.

### 6. Ja se prepara para um uso futuro mais autonomo de IA

Mesmo com o projeto ainda em modo assistido, a base ja traz:

- pasta de sandbox
- scripts ligados a uso agentico futuro
- politica explicita de limites

Ou seja: a estrutura ja pensa em autonomia futura, mas sem fingir que isso esta pronto hoje.

Esse preparo nao significa que Docker ou sandbox sejam obrigatorios no modo assistido atual.

## O que ja esta configurado

### Stack

- TypeScript
- Node.js 22 LTS
- npm

### Qualidade

- Prettier
- ESLint
- TypeScript para validacao de tipos
- Vitest para testes
- cobertura alvo inicial de 80%

### Seguranca

- `npm audit`
- Semgrep
- Gitleaks

### Entrega e operacao

- Dockerfile
- devcontainer
- workflows do GitHub
- runbooks criados como base

### IA

- uso assistido como modo atual
- prompts versionados
- regras de dados e limites em `POLICY_AI.md`
- `./scripts/ai-run` como entrypoint unico da automacao
- bootstrap explicito de sessao antes de qualquer tarefa automatizada
- `./scripts/ai-run gates` como gate final oficial do modo assistido
- preparacao para modo agentico futuro com isolamento

## O que foi inspirado pelos PDFs e ja entrou na base

As referencias usadas para montar esta base giravam em torno de algumas ideias principais. Hoje estas ideias ja estao refletidas no projeto:

- contexto versionado
- regras claras do projeto
- prompts versionados
- testes e verificacoes como rede de seguranca
- seguranca desde o inicio
- pequenos passos validaveis
- documentacao viva
- separacao entre contexto atual e historico antigo
- um checklist rastreavel para acompanhar o que ainda falta absorver das referencias

## O que ainda nao esta pronto

A base esta pronta. O conteudo real do laboratorio ainda esta em evolucao.

As principais lacunas hoje sao:

- comandos reais de serial, firmware e bancada ainda precisam ser registrados
- portas, sensores e setups reais ainda precisam ser documentados
- problemas recorrentes ainda precisam ser promovidos para a base de conhecimento
- runbooks ainda precisam sair do modo de modelo e virar procedimento real
- o modo agentico ainda nao esta operacional, mesmo com a preparacao de sandbox
- sandbox e Docker ainda sao opcionais e dependem da necessidade real do projeto

## Como saber onde o projeto esta agora

Use:

- [docs/session/current-state.md](./session/current-state.md)

Esse arquivo deve responder rapidamente:

- qual e o objetivo atual
- onde o trabalho parou
- o que precisa ser carregado na proxima sessao
- o que nao precisa ser carregado por padrao

## Como saber o que aconteceu no passado

Use:

- [docs/logbook/README.md](./logbook/README.md)

e depois os arquivos do logbook.

Esse historico serve para registro e auditoria, nao para substituir o resumo vivo da sessao.

## Quando esta base estara realmente madura

Esta base estara madura quando a estrutura atual estiver preenchida com conhecimento real do laboratorio.

Em outras palavras: a fundacao ja existe. O proximo passo e transformar experiencia pratica em documentacao util.

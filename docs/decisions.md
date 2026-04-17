# Decisoes

Este arquivo serve como indice rapido das decisoes mais importantes do projeto.

## Decisoes atuais

- o projeto se chama `lab-esp`
- a stack inicial sera TypeScript com Node.js 22 LTS
- o gerenciador de pacotes sera `npm`
- o ponto de entrada sera `src/main.ts`
- formatacao sera feita com Prettier
- lint sera feito com ESLint
- typecheck sera feito com TypeScript
- testes serao executados com Vitest
- cobertura alvo inicial sera 80%
- CI sera feito com GitHub Actions
- merge so deve acontecer com CI verde e revisao humana nas mudancas relevantes
- seguranca usara `npm audit`, Semgrep e Gitleaks
- IA ficara em modo assistido
- uso agentico futuro exigira isolamento ou controle equivalente, sem tratar container como obrigatorio por padrao
- deploy alvo inicial sera local, com Docker opcional quando fizer sentido
- release sera manual por branch principal ou tag
- rollback sera para a ultima versao estavel marcada

## Proximas decisoes esperadas

- desenho dos modulos de comunicacao serial
- estrategia de testes com hardware conectado
- politica de tags e releases
- papel final de Docker no deploy ou no ambiente de desenvolvimento

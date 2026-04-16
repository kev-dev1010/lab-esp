# Comandos Usados

Voltar para o [indice mestre](../index.md).

## Comandos base do projeto

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run typecheck`
- `npm run test:coverage`
- `./scripts/ci`
- `./scripts/security`

## Quando usar cada um

- `npm install`: primeiro setup ou atualizacao de dependencias
- `npm run dev`: executar a entrada local da aplicacao
- `npm run build`: validar que o TypeScript compila
- `npm run lint`: checar padrao de codigo
- `npm run typecheck`: validar tipos sem gerar build
- `npm run test:coverage`: rodar testes com cobertura
- `./scripts/ci`: executar o fluxo principal de verificacao do projeto
- `./scripts/security`: rodar auditoria de dependencias e checagens de seguranca

## Comandos que devem entrar aqui no futuro

- comandos de monitor serial
- comandos de upload de firmware
- comandos de reset de placa
- comandos de teste por sensor ou bancada

## Regra de documentacao

Se um comando passa a ser recorrente, ele deve entrar aqui com:

- proposito
- pre-requisitos
- exemplos de uso
- riscos ou observacoes

## Quando consultar este arquivo

- quando precisar lembrar um comando recorrente
- quando quiser documentar um comando novo que passou a fazer parte do fluxo

## Relacionados

- [testing.md](./testing.md)
- [serial-and-ports.md](./serial-and-ports.md)
- [current-state.md](../session/current-state.md)

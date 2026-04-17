# Teste Agendamento

Projeto temporario para validar a fundacao em um caso simples e completo, isolado de `lab-esp`.

## Como rodar

1. executar `node test-agendamento/server.js`
2. abrir `http://localhost:4321`
3. usar `/cliente.html` para criar agendamentos
4. usar `/painel.html` para confirmar, desmarcar e responder clientes

## Estrutura

- `server.js`: servidor HTTP nativo + API + persistencia em JSON
- `data/db.json`: banco improvisado
- `public/`: paginas, estilos e JavaScript vanilla
- `STRESS_TEST.md`: relatorio temporario da missao

## Limitacoes

- persistencia local em arquivo unico
- sem autenticacao
- um slot representa um horario por vez
- sem controle de concorrencia entre multiplos processos

# Estrategia de Testes

Voltar para o [indice mestre](../index.md).

## Estado atual

- testes unitarios e de integracao
- Vitest como runner
- cobertura alvo inicial de 80%

## Como pensar os testes deste projeto

- teste unitario: valida logica pura sem depender de hardware
- teste de integracao: valida contratos entre modulos e fluxos reais da aplicacao
- teste com hardware: valida comunicacao serial, firmware e comportamento fisico da bancada

## Regra pratica

- se a regra puder ser validada sem ESP32 conectado, prefira teste automatizado
- se a validacao depender de placa, cabo, porta ou sensor, documente o procedimento e o resultado esperado
- sempre separar claramente o que e teste de software e o que e teste de bancada

## Evidencias desejadas

- comando usado
- resultado esperado
- resultado observado
- hardware envolvido, se houver

## Este arquivo deve responder

- que tipos de teste existem
- quando escrever cada tipo
- como testar software puro
- como testar fluxo com hardware

## Relacionados

- [feature-workflow.md](../tasks/feature-workflow.md)
- [bugfix-workflow.md](../tasks/bugfix-workflow.md)
- [hardware-workflow.md](../tasks/hardware-workflow.md)

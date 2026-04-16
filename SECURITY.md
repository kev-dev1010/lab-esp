# Seguranca

Este arquivo resume a postura inicial de seguranca do projeto `lab-esp`.

## Objetivo

Manter uma base segura para experimentacao com ESP32, comunicacao serial e automacao assistida por IA, sem perder controle sobre segredos, dependencias e execucao.

## Ferramentas definidas

- auditoria de dependencias: `npm audit`
- SAST: Semgrep
- scanner de segredos: Gitleaks

## Regras iniciais

- nao commitar segredos
- usar `.env.example` apenas como modelo
- manter gates de seguranca em `./scripts/security`
- aplicar as regras de `POLICY_AI.md`
- documentar deploy e rollback em `docs/runbooks/`

## Observacao operacional

`npm audit` roda localmente pelo script de seguranca.

Semgrep e Gitleaks foram preparados na base, mas podem exigir instalacao local ou execucao via CI dependendo do ambiente.

## Itens a detalhar depois

- politica de SBOM
- criterios de aceitacao para findings
- procedimentos de resposta para falhas de seguranca

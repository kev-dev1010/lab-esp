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

Semgrep e Gitleaks agora sao gates locais obrigatorios. Se a ferramenta nao estiver instalada, `./scripts/security` e `./scripts/ci` devem falhar.

`./scripts/security` tambem valida a presenca de `semgrep.yml` e `.gitleaks.toml`.

`./scripts/setup` so deve declarar o ambiente pronto depois de validar os pre-requisitos obrigatorios da maquina para esse gate.

## Itens a detalhar depois

- politica de SBOM
- criterios de aceitacao para findings
- procedimentos de resposta para falhas de seguranca

# Sandbox

Esta pasta guarda a base de isolamento para automacao com IA.

Enquanto o projeto estiver em modo assistido, ela funciona apenas como preparacao opcional.

Quando o modo agentico for adotado, esta pasta deve conter a configuracao real de limites de acesso e execucao.

Docker e container nao sao obrigatorios por padrao para todos os projetos.

Projetos com hardware real, porta serial ou acesso a dispositivos do host podem exigir execucao controlada fora de container.

Hoje `./scripts/ai-jail-enable` ja valida o minimo esperado dessa configuracao: escrita restrita ao projeto, rede bloqueada por padrao e allowlist versionada.

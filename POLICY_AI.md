# Politica de Uso de IA

Este documento define os limites de uso de IA no projeto `lab-esp`.

## Principios

- IA ajuda no trabalho, mas nao substitui validacao
- saida de modelo nao deve ser tratada como verdade por padrao
- toda mudanca relevante precisa de revisao humana
- o projeto deve continuar compreensivel sem depender de uma IA

## Dados que nao podem ser enviados a modelos

- segredos
- tokens
- chaves privadas
- credenciais
- documentos privados
- dados sensiveis
- informacoes tecnicas confidenciais sem revisao humana

## Modo de operacao

- modo atual: `assistido`
- humano no loop: obrigatorio
- modo `agentic`: somente no futuro, com sandbox ativo e politica mantida

## Regras para automacao agentica futura

- limitar escrita ao diretorio do projeto
- bloquear acesso livre a rede interna
- permitir internet apenas para documentacao oficial e fontes confiaveis aprovadas
- registrar comandos executados
- revisar comandos sensiveis antes de execucao real
- nunca executar saida de LLM diretamente como comando sem validacao

## Modelo e fornecedor

- provedor principal: OpenAI
- modelo principal: GPT-5.4 Thinking
- modo de uso: hibrido
- orcamento: mensal, definido externamente

## Registros e auditoria

- manter logs resumidos do que foi executado
- redigir ou remover dados sensiveis dos logs
- registrar decisoes importantes em documentacao permanente

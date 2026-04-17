#!/usr/bin/env bash
set -euo pipefail

log() {
  printf "[%s] %s\n" "$(date +%H:%M:%S)" "$*" >&2
}

fail() {
  log "ERROR: $*"
  exit 1
}

require_command() {
  local cmd="$1"
  local message="$2"

  if ! command -v "$cmd" >/dev/null 2>&1; then
    fail "$message"
  fi
}

require_file() {
  local file_path="$1"
  local message="$2"

  if [ ! -f "$file_path" ]; then
    fail "$message"
  fi
}

require_node_major() {
  local expected_major="$1"
  local current_version
  local current_major

  require_command node "Node.js ${expected_major} LTS e prerequisito obrigatorio da maquina para executar o fluxo oficial local."

  current_version="$(node --version)"
  current_major="${current_version#v}"
  current_major="${current_major%%.*}"

  if [ "$current_major" != "$expected_major" ]; then
    fail "Node.js ${expected_major} LTS e obrigatorio para o fluxo oficial local. Versao atual detectada: ${current_version}."
  fi
}

require_local_flow_prereqs() {
  require_node_major 22
  require_command npm "npm e prerequisito obrigatorio da maquina para executar os comandos oficiais do projeto."
  require_command semgrep "Semgrep e prerequisito obrigatorio da maquina para executar o fluxo oficial local."
  require_command gitleaks "Gitleaks e prerequisito obrigatorio da maquina para executar o fluxo oficial local."
}

require_security_gate_config() {
  require_file semgrep.yml "Arquivo semgrep.yml nao encontrado. O gate oficial de seguranca depende dele."
  require_file .gitleaks.toml "Arquivo .gitleaks.toml nao encontrado. O gate oficial de seguranca depende dele."
}

require_security_gate_prereqs() {
  require_local_flow_prereqs
  require_security_gate_config
}

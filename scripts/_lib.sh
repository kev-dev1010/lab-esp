#!/usr/bin/env bash
set -euo pipefail

log() {
  printf "[%s] %s\n" "$(date +%H:%M:%S)" "$*" >&2
}

fail() {
  log "ERROR: $*"
  exit 1
}

placeholder() {
  log "PLACEHOLDER: $*"
}

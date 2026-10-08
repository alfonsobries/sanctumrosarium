#!/bin/bash

# Metro en la red local, para que el dev client de un celular en la misma Wi-Fi
# cargue la app desde esta Mac.
#
# Uso (raíz):
#   pnpm play                    # Detecta la IP de la red
#   pnpm play 192.168.68.88      # Fija la IP

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

# shellcheck source=scripts/lib.sh
. "$ROOT/scripts/lib.sh"

require_setup
HOST="${1:-}"

export_free_port DEV_METRO_PORT 8083
export_dev_host "$HOST"

if [ -n "${DEV_HOST:-}" ]; then
    export REACT_NATIVE_PACKAGER_HOSTNAME="$DEV_HOST"
fi

cd app
exec npx expo start --port "$DEV_METRO_PORT"

#!/bin/bash

# Todo el entorno local con `composer dev` (php artisan dev): API en la red local,
# logs y Metro, con la app apuntando a la API por la IP de esta Mac.
#
# Uso (raíz):
#   pnpm play                    # Detecta la IP de la red
#   pnpm play 192.168.68.88      # Fija API y Expo a esta IP

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

# shellcheck source=scripts/lib.sh
. "$ROOT/scripts/lib.sh"

require_setup
HOST="${1:-}"

export_free_port DEV_PORT 8020
export_free_port DEV_METRO_PORT 8083
export_dev_host "$HOST"

cd api
php artisan migrate --force --no-interaction >/dev/null
exec composer dev

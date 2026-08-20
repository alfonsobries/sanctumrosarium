#!/bin/bash

# Dev client local (EAS local, sin cola cloud). Salida en app/build/.
#
# Uso (raíz):
#   pnpm ios:build
#   pnpm android:build
#
# Primera vez: credenciales
#   cd app && npx eas-cli credentials -p ios

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PLATFORM="${1:-ios}"

cd "$ROOT/app"

mkdir -p build

EAS=(npx --yes eas-cli@latest)

case "$PLATFORM" in
  ios)
    echo "Building iOS dev client → build/latest.ipa"
    "${EAS[@]}" build \
      --platform ios \
      --profile local \
      --local \
      --non-interactive \
      --output ./build/latest.ipa
    echo ""
    echo "Listo: app/build/latest.ipa"
    echo "Instalar: pnpm ios:install"
    ;;
  android)
    echo "Building Android dev client → build/latest.apk"
    "${EAS[@]}" build \
      --platform android \
      --profile local \
      --local \
      --non-interactive \
      --output ./build/latest.apk
    echo ""
    echo "Listo: app/build/latest.apk"
    echo "Instalar: pnpm android:install"
    ;;
  *)
    echo "Uso: pnpm ios:build | pnpm android:build"
    exit 1
    ;;
esac

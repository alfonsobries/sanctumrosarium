#!/bin/bash

# Dev client compilado en esta Mac (EAS local, sin cola en la nube). Salida en
# app/build/. El dev client carga el JavaScript de Metro, que `pnpm play`
# levanta con la IP LAN ya inyectada (EXPO_PUBLIC_API_URL).
#
# Uso (raíz):
#   pnpm ios:build
#   pnpm android:build
#

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PLATFORM="${1:-ios}"
# local: dev client that loads JavaScript from Metro. preview: self-contained release build.
PROFILE="${2:-local}"

cd "$ROOT/app"
mkdir -p build

EAS=(npx --yes eas-cli@latest)

case "$PLATFORM" in
  ios)
    ARTIFACT=build/latest.ipa
    ;;
  android)
    ARTIFACT=build/latest.apk
    ;;
  *)
    echo "Uso: pnpm ios:build | pnpm android:build"
    exit 1
    ;;
esac

# El dev client carga el JavaScript de Metro: no hay bundle ni símbolos que subir a Sentry.
export SENTRY_DISABLE_AUTO_UPLOAD=true

echo "Compilando el dev client ($PLATFORM) → app/$ARTIFACT"
"${EAS[@]}" build \
  --platform "$PLATFORM" \
  --profile "$PROFILE" \
  --local \
  --freeze-credentials \
  --non-interactive \
  --output "./$ARTIFACT"

echo ""
echo "Listo: app/$ARTIFACT"
echo "Instalar: pnpm $PLATFORM:install · luego: pnpm play"

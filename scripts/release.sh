#!/bin/bash

# Build de tienda y envío a TestFlight / Play. El binario se compila **en esta
# máquina** (EAS local, sin cola cloud) y solo el envío toca los servidores de
# Apple y Google.
#
# Uso (raíz):
#   pnpm ios:release:build    # solo el binario → app/build/sanctumrosarium.ipa
#   pnpm ios:release:submit   # sube ese binario a TestFlight
#   pnpm ios:release          # los dos

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PLATFORM="${1:-}"
ACTION="${2:-all}"

case "$PLATFORM" in
  ios)
    ARTIFACT="build/sanctumrosarium.ipa"
    ;;
  android)
    ARTIFACT="build/sanctumrosarium.aab"
    ;;
  *)
    echo "Uso: scripts/release.sh <ios|android> [build|submit|all]"
    exit 1
    ;;
esac

cd "$ROOT/app"

mkdir -p build

EAS=(npx --yes eas-cli@latest)

build() {
  echo "Compilando producción ($PLATFORM) en esta máquina → app/$ARTIFACT"
  # --freeze-credentials: usa las credenciales que ya viven en EAS sin
  # sincronizar nada con Apple, que es lo que deja el build sin preguntas.
  "${EAS[@]}" build \
    --platform "$PLATFORM" \
    --profile production \
    --local \
    --output "./$ARTIFACT" \
    --freeze-credentials \
    --non-interactive
}

submit() {
  if [ ! -f "$ARTIFACT" ]; then
    echo "No existe app/$ARTIFACT. Corre el build primero."
    exit 1
  fi

  echo "Subiendo app/$ARTIFACT"
  "${EAS[@]}" submit \
    --platform "$PLATFORM" \
    --profile production \
    --path "./$ARTIFACT" \
    --non-interactive
}

case "$ACTION" in
  build) build ;;
  submit) submit ;;
  all)
    build
    submit
    ;;
  *)
    echo "Acción desconocida: $ACTION (build, submit o all)"
    exit 1
    ;;
esac

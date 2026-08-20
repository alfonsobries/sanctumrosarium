#!/bin/bash

# Instala el último dev client en un aparato USB.
#
# Uso (raíz):
#   pnpm ios:install
#   pnpm android:install

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PLATFORM="${1:-ios}"

cd "$ROOT/app"

case "$PLATFORM" in
  ios)
    IPA=build/latest.ipa
    if [ ! -f "$IPA" ]; then
      echo "No hay $IPA — corre: pnpm ios:build"
      exit 1
    fi
    if command -v ios-deploy >/dev/null 2>&1; then
      ios-deploy --bundle "$IPA"
    elif command -v xcrun >/dev/null 2>&1; then
      # Fallback: devicectl (Xcode 15+)
      UDID=$(xcrun xctrace list devices 2>/dev/null | awk -F'[()]' '/iPhone|iPad/{print $(NF-1); exit}')
      if [ -z "$UDID" ]; then
        echo "No hay iPhone/iPad conectado (o falta ios-deploy: brew install ios-deploy)"
        exit 1
      fi
      xcrun devicectl device install app --device "$UDID" "$IPA"
    else
      echo "Instala ios-deploy: brew install ios-deploy"
      exit 1
    fi
    echo "Instalado. Luego: pnpm app"
    ;;
  android)
    APK=build/latest.apk
    if [ ! -f "$APK" ]; then
      echo "No hay $APK — corre: pnpm android:build"
      exit 1
    fi
    ADB="${ANDROID_HOME:-$HOME/Library/Android/sdk}/platform-tools/adb"
    if [ ! -x "$ADB" ]; then
      ADB=adb
    fi
    if ! "$ADB" devices | grep -qE $'\tdevice$'; then
      echo "No hay Android en modo device."
      "$ADB" devices
      exit 1
    fi
    "$ADB" install -r "$APK"
    echo "Instalado. Luego: pnpm app"
    ;;
  *)
    echo "Uso: pnpm ios:install | pnpm android:install"
    exit 1
    ;;
esac

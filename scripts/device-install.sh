#!/bin/bash

# Instala el último dev client en un aparato conectado por USB o por Wi-Fi.
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
      echo "No hay $IPA. Corre: pnpm ios:build"
      exit 1
    fi
    # devicectl instala por cable o por Wi-Fi: basta que el aparato esté emparejado
    # y alcanzable en la misma red (Xcode > Window > Devices and Simulators >
    # "Connect via network").
    UDID=$(xcrun devicectl list devices 2>/dev/null | grep -E 'iPhone|iPad' | grep -E 'connected|available' | grep -oE '[0-9A-F]{8}(-[0-9A-F]{4}){3}-[0-9A-F]{12}' | head -1)
    if [ -z "$UDID" ]; then
      echo "No hay iPhone o iPad alcanzable por cable ni por Wi-Fi."
      echo "Emparéjalo una vez con cable y activa \"Connect via network\" en Xcode > Window > Devices and Simulators."
      exit 1
    fi
    xcrun devicectl device install app --device "$UDID" "$IPA"
    ;;
  android)
    APK=build/latest.apk
    if [ ! -f "$APK" ]; then
      echo "No hay $APK. Corre: pnpm android:build"
      exit 1
    fi
    ADB="${ANDROID_HOME:-$HOME/Library/Android/sdk}/platform-tools/adb"
    [ -x "$ADB" ] || ADB=adb
    # Por Wi-Fi: ANDROID_ADB_HOST=192.168.X.X:PUERTO (Depuración inalámbrica del celular).
    if [ -n "${ANDROID_ADB_HOST:-}" ]; then
      "$ADB" connect "$ANDROID_ADB_HOST"
    fi
    if ! "$ADB" devices | grep -qE $'\tdevice$'; then
      echo "No hay Android conectado en modo device (cable o ANDROID_ADB_HOST)."
      "$ADB" devices
      exit 1
    fi
    "$ADB" install -r "$APK"
    ;;
  *)
    echo "Uso: pnpm ios:install | pnpm android:install"
    exit 1
    ;;
esac

echo "Instalado. Luego: pnpm play"

#!/bin/bash

# Cambia la apariencia (dark/light) de los dispositivos de desarrollo que
# estén corriendo: simulador de iOS booteado y emulador de Android conectado.
#
# Uso: pnpm dark | pnpm light

MODE=$1

if [ "$MODE" != "dark" ] && [ "$MODE" != "light" ]; then
  echo "Uso: pnpm dark | pnpm light"
  exit 1
fi

ADB="$HOME/Library/Android/sdk/platform-tools/adb"

if xcrun simctl list devices booted 2>/dev/null | grep -q Booted; then
  xcrun simctl ui booted appearance "$MODE"
  echo "iOS simulator → $MODE"
fi

if [ -x "$ADB" ] && "$ADB" devices 2>/dev/null | grep -qE 'device$'; then
  if [ "$MODE" = "dark" ]; then
    "$ADB" shell cmd uimode night yes >/dev/null
  else
    "$ADB" shell cmd uimode night no >/dev/null
  fi
  echo "Android emulator → $MODE"
fi

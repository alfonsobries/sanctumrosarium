#!/bin/bash
# Fails if the watch target version drifts from the iOS app (task 015; App Store
# has rejected companion apps for this).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
APP="$ROOT/app/app.json"
WATCH="$ROOT/app/targets/watch/Info.plist"
APP_VERSION="$(node -e "console.log(require('$APP').expo.version)")"
if [ ! -f "$WATCH" ]; then
  echo "Watch Info.plist still generated at prebuild. App version: $APP_VERSION"
  echo "expo-target.config.js does not pin CFBundleShortVersionString; prebuild copies the app version."
  exit 0
fi
WATCH_VERSION="$(/usr/libexec/PlistBuddy -c 'Print :CFBundleShortVersionString' "$WATCH")"
if [ "$APP_VERSION" != "$WATCH_VERSION" ]; then
  echo "Version mismatch: app $APP_VERSION vs watch $WATCH_VERSION"
  exit 1
fi
echo "Versions match: $APP_VERSION"

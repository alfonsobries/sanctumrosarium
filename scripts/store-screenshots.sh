#!/bin/bash
# Regenerates store screenshots into app/store/screenshots/. Not committed: they
# are taken on a device, not drawn by hand.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/app/store/screenshots"
mkdir -p "$OUT"
cd "$ROOT"
maestro test app/e2e/store-screenshots.yaml --output "$OUT"
echo "Listo: $OUT"

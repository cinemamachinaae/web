#!/bin/bash
set -e
PROJECT_DIR="$HOME/Desktop/web"
OUT_NAME="cinema_machina_deploy_ready_FINAL"
rm -rf "$HOME/Desktop/$OUT_NAME"
mkdir -p "$HOME/Desktop/$OUT_NAME"
cp -R "$PROJECT_DIR"/* "$HOME/Desktop/$OUT_NAME"/
cd "$HOME/Desktop"
rm -f "${OUT_NAME}.zip"
zip -r "${OUT_NAME}.zip" "$OUT_NAME"
echo "Created: $HOME/Desktop/${OUT_NAME}.zip"

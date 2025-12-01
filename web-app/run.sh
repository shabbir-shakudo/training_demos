#!/usr/bin/env bash
set -euo pipefail

# Ensure script runs from its directory
cd "$(dirname "$0")"

PORT="${PORT:-3000}"
echo "Starting web-app on port $PORT"

# Run the Node.js app
node index.js

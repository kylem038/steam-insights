#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$SCRIPT_DIR"

echo "=== E2E test run — starting ==="

docker compose \
  -f docker-compose.yml \
  -f docker-compose.dev.yml \
  -f docker-compose.e2e.yml \
  up --force-recreate --abort-on-container-exit --exit-code-from playwright

EXIT_CODE=$?

echo "=== Restoring dev services ==="
docker compose -f docker-compose.yml -f docker-compose.dev.yml \
  up -d --force-recreate frontend

exit $EXIT_CODE

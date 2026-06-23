#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

echo "=== Frontend Tests ==="
docker compose -f docker-compose.yml -f docker-compose.dev.yml run --rm frontend npm test

echo ""
echo "=== Backend Tests ==="
docker compose -f docker-compose.yml -f docker-compose.dev.yml run --rm backend npm test

echo ""
echo "All tests passed."

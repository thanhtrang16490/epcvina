#!/bin/bash

set -e

MOBILE_API_URL="${EXPO_PUBLIC_API_URL:-https://app.epcvina.com/api/mobile}"

echo "Testing EPCVINA mobile gateway: $MOBILE_API_URL"
curl -sS -X POST "$MOBILE_API_URL/query" \
  -H "Content-Type: application/json" \
  --data '{"table":"products","action":"select","columns":"id,name,price,stock","modifiers":[{"method":"limit","args":[5]}]}'
echo

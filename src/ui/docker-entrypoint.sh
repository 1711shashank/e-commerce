#!/bin/sh
set -eu

catalog_url="${CATALOG_SERVICE_URL:-http://127.0.0.1:8002}/api/products/"
auth_url="${AUTH_SERVICE_URL:-http://127.0.0.1:8001}/api/auth/login/"

wait_for() {
  name="$1"
  url="$2"
  echo "Waiting for ${name} at ${url}..."
  while true; do
    if node -e "
      const http = require('http');
      const url = new URL(process.argv[1]);
      const req = http.request(
        { hostname: url.hostname, port: url.port, path: url.pathname + url.search, method: 'GET', timeout: 2000 },
        (res) => process.exit(res.statusCode < 500 ? 0 : 1),
      );
      req.on('error', () => process.exit(1));
      req.on('timeout', () => { req.destroy(); process.exit(1); });
      req.end();
    " "$url"; then
      sleep 1
      if node -e "
        const http = require('http');
        const url = new URL(process.argv[1]);
        const req = http.request(
          { hostname: url.hostname, port: url.port, path: url.pathname + url.search, method: 'GET', timeout: 2000 },
          (res) => process.exit(res.statusCode < 500 ? 0 : 1),
        );
        req.on('error', () => process.exit(1));
        req.on('timeout', () => { req.destroy(); process.exit(1); });
        req.end();
      " "$url"; then
        break
      fi
    fi
    sleep 1
  done
  echo "${name} is ready."
}

wait_for "catalog-service" "$catalog_url"
wait_for "auth-service" "$auth_url"

exec node server.js

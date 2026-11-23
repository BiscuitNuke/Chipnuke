#!/usr/bin/env bash
# Runs web and api from one image on a private network, like compose does.
set -euo pipefail

image=${1:-chipnuke-check}
tag=${GITHUB_RUN_ID:-local}-${GITHUB_RUN_ATTEMPT:-1}
net=chipnuke-net-$tag
web=chipnuke-web-$tag
api=chipnuke-api-$tag
cleanup() {
    local status=$?
    set +e
    if [ "$status" -ne 0 ]; then
        echo "Container smoke test failed (exit $status)."
        for c in "$web" "$api"; do echo "== $c"; docker inspect --format '{{json .State}}' "$c"; docker logs "$c"; done
    fi
    docker rm -f "$web" "$api" >/dev/null 2>&1
    docker network rm "$net" >/dev/null 2>&1
    exit "$status"
}
trap cleanup EXIT

hardening=(--read-only --cap-drop ALL --security-opt no-new-privileges --pids-limit 100 --memory 128m)
docker network create "$net" >/dev/null
docker run -d --name "$api" --network "$net" --network-alias api "${hardening[@]}" \
    --tmpfs /data:rw,size=8m,uid=101,gid=101 --entrypoint python3 "$image" -u /api/api.py >/dev/null
docker run -d --name "$web" --network "$net" "${hardening[@]}" \
    --tmpfs /tmp:rw,size=32m,mode=1777 -p 127.0.0.1:8089:8080 "$image" >/dev/null

origin=http://127.0.0.1:8089
ready=false
for attempt in {1..15}; do
    if curl --fail --silent --connect-timeout 1 --max-time 2 "$origin/healthz" >/dev/null \
        && curl --fail --silent --connect-timeout 1 --max-time 2 "$origin/api/healthz" >/dev/null; then
        ready=true
        break
    fi
    for c in "$web" "$api"; do
        if [ "$(docker inspect --format '{{.State.Running}}' "$c")" != true ]; then echo "$c exited." >&2; exit 1; fi
    done
    sleep 1
done
[ "$ready" = true ] || { echo 'Containers did not become ready.' >&2; exit 1; }

limits=(--connect-timeout 2 --max-time 5)
for route in / /posts/ /posts/hello-world/ /shrines/ /shrines/fpv-quad/ /now/ /guestbook/ /links/ /brand/mark.svg /api/hits /api/guestbook; do
    curl "${limits[@]}" --fail --silent --show-error "$origin$route" >/dev/null
done
test "$(curl "${limits[@]}" -s -o /dev/null -w '%{http_code}' "$origin/posts")" = 301
for route in /route-must-not-exist-827491 /posts/does-not-exist/ /_next/static/missing.js /api/nope; do
    test "$(curl "${limits[@]}" -s -o /dev/null -w '%{http_code}' "$origin$route")" = 404
done

# Counter counts once per visitor per day. Guestbook holds new entries for approval.
curl "${limits[@]}" -s -X POST "$origin/api/hits" | grep -q '"count": 1'
curl "${limits[@]}" -s -X POST "$origin/api/hits" | grep -q '"count": 1'
test "$(curl "${limits[@]}" -s -o /dev/null -w '%{http_code}' -X POST -H 'Content-Type: application/json' \
    -d '{"name":"smoke","message":"hello"}' "$origin/api/guestbook")" = 202
curl "${limits[@]}" -s "$origin/api/guestbook" | grep -q '"entries": \[\]'
docker exec "$api" python3 /api/api.py approve 1 | grep -q approved
curl "${limits[@]}" -s "$origin/api/guestbook" | grep -q '"name": "smoke"'

test "$(docker exec "$web" id -u)" != 0
test "$(docker exec "$api" id -u)" != 0
docker exec "$web" nginx -t
echo 'Smoke test passed.'

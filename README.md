# chipnuke

chipnuke is Kieran's personal site for builds, prints, car projects, and other non-work topics. The site looks like an old personal homepage. It runs on a modern stack.

## Stack

- Next.js 16 static export (`output: "export"`, trailing slash). React 19. TypeScript 7. CI uses Node 24.
- GSAP 3 for the SCRAM button, the draggable window, and the cursor sparks. No smooth scroll.
- Silkscreen pixel font (`@fontsource/silkscreen`) for headings. Verdana for body text.
- `api/api.py`: hit counter and guestbook. Python standard library and SQLite.
- Runtime: `nginxinc/nginx-unprivileged`, read-only root, all capabilities dropped. The api service uses the same image.

## Add content

| Type | Location | Front matter |
|---|---|---|
| Post | `content/posts/<slug>.md` | `title`, `date` (YYYY-MM-DD), `summary`, `tags` |
| Shrine | `content/shrines/<slug>.md` | `title`, `part` (for example `U5`), `date`, `summary`, `tags` |
| Now | `content/now.md` | `updated` |
| 88x31 button | `public/buttons/` and the list in `app/components/buttons.tsx` | none |

Shrines sort by `part`. Posts sort by `date`, newest first.

## Run locally

```sh
npm ci
npm run dev
```

The counter and the guestbook need the api. Without the api, they show "offline". To run the api locally:

```sh
DB_PATH=/tmp/chipnuke.db PORT=8081 python3 api/api.py
```

## Deploy

The flow is the same as KSWU:

1. Push a branch and open a pull request. CI job `validate` builds the export, runs a leak scan, builds the image, and runs `deploy/smoke-container.sh`.
2. Merge to `main`.
3. CI job `publish-image` pushes `ghcr.io/biscuitnuke/chipnuke:sha-<sha>-<run>-<attempt>` and pins it in `deploy/compose.yaml`.
4. Dockhand Git sync redeploys stack `chipnuke`.

### First-time setup

1. Merge to `main` one time, so that CI publishes an image. The `unpublished` tag in `deploy/compose.yaml` does not exist.
2. In Dockhand, create a Git stack `chipnuke`: repository `BiscuitNuke/Chipnuke`, branch `main`, Compose path `deploy/compose.yaml`. Set Git sync to `*/15 * * * *`.
3. Set the stack variables:

| Variable | Effect |
|---|---|
| `CHIPNUKE_BIND_IP` | Host private address for Caddy. The default is loopback, which the gateway cannot reach. |
| `CHIPNUKE_PORT` | Published port. Default `8089`. |
| `CHIPNUKE_GUESTBOOK_WEBHOOK` | Discord webhook URL. The api posts each new guestbook entry there. Empty turns notifications off. |
| `CHIPNUKE_IP_SALT` | A random string. The api hashes visitor addresses with it. The api keeps no raw addresses. |

4. Let only the Caddy gateway reach the published port.
5. Set the domain in `lib/site.ts` and in `deploy/Caddyfile.snippet`. Add the snippet to the gateway, set `CHIPNUKE_UPSTREAM`, and point DNS at the gateway.

## Guestbook moderation

New entries are not public until you approve them. Run these commands on the Docker host:

```sh
docker exec chipnuke-api-1 python3 /api/api.py list
docker exec chipnuke-api-1 python3 /api/api.py approve <id>
docker exec chipnuke-api-1 python3 /api/api.py reject <id>
```

Limits: 3 entries per visitor per hour, 500 characters per message, 4 KB per request, 30 api requests per minute per address. The form has a hidden honeypot field. The counter counts each visitor one time per day.

## Rules

- Public-safe output only. No internal addresses, VLANs, ports, or hostnames. CI runs the leak scan on `out/`.
- Site text: Kieran's voice. Docs: STE.

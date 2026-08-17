This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## /network — personal CRM

A hidden dashboard for keeping in touch with everyone worth keeping in touch
with. Not linked from anywhere on the site, `noindex`, and blocked in
`robots.txt`. Run `npm run dev` and open
[http://localhost:3000/network](http://localhost:3000/network).

**Storage.** One driver, two homes. With no `TURSO_DATABASE_URL` set it is a
local SQLite file at `data/network.db` (gitignored, never deployed). Set
`TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` and the same code talks to Turso
instead, which speaks the same SQLite dialect. Production needs the hosted
option: Vercel's filesystem is ephemeral, so a local file there is wiped on
every cold start.

**Locking it.** Set `NETWORK_PASSPHRASE` and `/network` redirects to a
passphrase screen; the session cookie lasts 30 days. Leave it empty and the
dashboard is open in dev and returns 404 in production, so an unconfigured
deploy cannot expose it.

### Going live

```bash
# 1. Create the hosted database
brew install tursodatabase/tap/turso
turso auth signup
turso db create parthgoda-network
turso db show parthgoda-network --url          # -> TURSO_DATABASE_URL
turso db tokens create parthgoda-network       # -> TURSO_AUTH_TOKEN

# 2. Tell Vercel about it (or paste them into the dashboard)
vercel login
vercel env add NETWORK_PASSPHRASE production
vercel env add NETWORK_SECRET production
vercel env add TURSO_DATABASE_URL production
vercel env add TURSO_AUTH_TOKEN production
vercel --prod

# 3. Load your people into the hosted copy
TURSO_DATABASE_URL=... TURSO_AUTH_TOKEN=... npm run network:import -- people.csv
```

The schema creates itself on first connection, so there is no migration step.
Leave the Turso variables out of `.env.local` and local dev keeps using the
local file, which is the sane way to work: experiment locally, and only point
at the hosted copy when you mean to.

**Reminder emails.**

```bash
npm run network:remind -- --dry-run   # print the digest, send nothing
npm run network:remind                # send it
npm run network:remind -- --soon      # include people due in the next 2 weeks
npm run network:remind -- --force     # ignore the per-person cooldown
```

Set `NETWORK_EMAIL_TO` plus either `RESEND_API_KEY` or
`SMTP_HOST`/`SMTP_USER`/`SMTP_PASS` (a Gmail app password works). With no mail
credentials the script prints the digest instead of sending it. Nobody gets
flagged twice inside `NETWORK_COOLDOWN_DAYS` (default 7), so a weekly cron will
not nag you about the same person every run.

The script reads the same env as the app, so with the Turso variables exported
it reminds you about the hosted copy. Weekly, Monday at 9am, via `crontab -e`:

```
0 9 * * 1 cd /Users/parthgoda/Downloads/parthgoda.com && /Users/parthgoda/.local/bin/npm run network:remind >> /tmp/network-remind.log 2>&1
```

**Bulk import.** Copy `scripts/network-import-template.csv`, fill it in, then:

```bash
npm run network:import -- people.csv --dry-run
npm run network:import -- people.csv
```

Rows match on name + email, so re-running the same file updates instead of
duplicating.

## /case-log — case interview practice log

A hidden dashboard for logging every case you practice, taken or given. Same
treatment as `/network`: unlinked, `noindex`, blocked in `robots.txt`. Open
[http://localhost:3000/case-log](http://localhost:3000/case-log).

**What it tracks.** One row per rep: the prompt, the case type, who ran it, the
source casebook, format and length, plus a 1–5 score on the five things
partners actually grade — structure, math, insight, synthesis, presence. Leave a
dimension blank and it stays blank; averages ignore it rather than counting a
zero. Every case also takes a "what worked", a single "fix before the next one",
and comma-separated drill tags.

**What it tells you.** The dashboard ranks the five dimensions worst-first so an
overall 7/10 cannot hide a 3 in math, tracks the last five reps against the five
before them, counts reps per week and your practice streak, breaks scores down
by case type and by partner, lists case types you have never attempted, surfaces
recurring drill tags, and reads your last few "fix next time" notes back to you.
A case detail page shows what you had said you would fix going into that rep.

**Storage.** Same two-homes driver as `/network`: a local SQLite file at
`data/case-log.db` (gitignored) with no Turso variables set, Turso in
production. It reuses `TURSO_DATABASE_URL`/`TURSO_AUTH_TOKEN` by default — the
table names do not collide — or set `CASELOG_TURSO_DATABASE_URL` and
`CASELOG_TURSO_AUTH_TOKEN` to give it a separate database. The schema creates
itself on first connection.

**Locking it.** Set `CASELOG_PASSPHRASE` (and `CASELOG_SECRET` for the cookie
salt) and `/case-log` redirects to a passphrase screen for 30 days at a time.
Leave it empty and the log is open in dev and returns **404 in production**, so
an unconfigured deploy cannot expose it — which also means a production deploy
without `CASELOG_PASSPHRASE` set makes the route look missing rather than broken:

```bash
vercel env add CASELOG_PASSPHRASE production
vercel env add CASELOG_SECRET production
vercel --prod
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

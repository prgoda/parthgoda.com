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

A public dashboard of every case practiced, taken or given, linked from the main
nav. Anyone can read it; only the PIN holder can write to it. Open
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

**Who can write.** Reading is open to everyone. Adding, editing and deleting
need a 4-digit PIN: set `CASELOG_PIN` (plus `CASELOG_SECRET` for the cookie
salt), then hit **Unlock** in the case-log header and type it. The writer cookie
lasts 30 days; **Lock** clears it.

Enforcement lives in two places on purpose. `proxy.ts` redirects the write
*screens* to `/case-log/unlock`, and every mutating server action re-checks the
cookie through `canWrite()` in `lib/case-log/session.ts`. Only the second one is
security — server actions are callable by anyone who reads the page's JS, so
hiding a button proves nothing. Keep that check in any new action.

With no `CASELOG_PIN` set, writing is open in dev and **closed in production**,
so an unconfigured deploy is read-only rather than a public whiteboard.

```bash
vercel env add CASELOG_PIN production
vercel env add CASELOG_SECRET production
vercel --prod
```

A 4-digit PIN is a 10,000-value space with no rate limiting in front of it. It
stops drive-by edits and casual visitors, not somebody who decides to script it.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

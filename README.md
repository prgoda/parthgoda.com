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

Everything lives in a local SQLite file at `data/network.db`, which is
gitignored and never deployed. Point `NETWORK_DB_PATH` somewhere else if you
want it in iCloud or Dropbox for backup.

**Locking it.** Set `NETWORK_PASSPHRASE` in `.env.local` and `/network`
redirects to a passphrase screen; the session cookie lasts 30 days. Leave it
empty and the dashboard is open, which is fine while it only runs on localhost.
Do not deploy this to Vercel with the passphrase unset.

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

Weekly, Monday at 9am, via `crontab -e`:

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

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

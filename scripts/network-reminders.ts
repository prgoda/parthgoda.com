#!/usr/bin/env tsx
/**
 * Emails you the people you owe a message.
 *
 *   npm run network:remind              send (or dry-run if no mail creds)
 *   npm run network:remind -- --dry-run print the digest, never send
 *   npm run network:remind -- --force   ignore the per-person cooldown
 *   npm run network:remind -- --soon    include people due in the next 2 weeks
 *
 * Cron it once a week and the list stays honest.
 */
import { loadEnv } from "./_env";
import { getDb, query } from "../lib/network/db";
import { dashboardStats, listPeople } from "../lib/network/queries";
import { buildDigest } from "../lib/network/digest";
import { sendMail, detectTransport } from "../lib/network/mailer";
import { todayISO, addDays } from "../lib/network/cadence";

// Nothing opens the database until the first query, so this still lands first.
loadEnv();

const argv = process.argv.slice(2);
const has = (flag: string) => argv.includes(flag);

function flagValue(flag: string): string | undefined {
  const i = argv.indexOf(flag);
  return i !== -1 ? argv[i + 1] : undefined;
}

async function main() {
  const dryRun = has("--dry-run");
  const force = has("--force");
  const includeSoon = has("--soon") || has("--include-due-soon");
  const cooldownDays = Number(
    flagValue("--cooldown") ?? process.env.NETWORK_COOLDOWN_DAYS ?? 7,
  );

  const to = flagValue("--to") ?? process.env.NETWORK_EMAIL_TO;
  const from =
    process.env.NETWORK_EMAIL_FROM ?? process.env.SMTP_USER ?? "onboarding@resend.dev";
  const baseUrl = (process.env.NETWORK_BASE_URL ?? "http://localhost:3000").replace(
    /\/$/,
    "",
  );
  const today = todayISO();

  // Who is on the hook today.
  const candidates = (await listPeople({ sort: "urgency" })).filter(
    (p) => p.status === "overdue" || (includeSoon && p.status === "due-soon"),
  );

  // Skip anyone already nagged about inside the cooldown window.
  const cutoff = addDays(today, -Math.max(0, cooldownDays));
  const recentlyNagged = new Set(
    (
      await query<{ person_id: number }>(
        "SELECT DISTINCT person_id FROM reminder_log WHERE sent_on > ?",
        [cutoff],
      )
    ).map((r) => r.person_id),
  );

  const people = force
    ? candidates
    : candidates.filter((p) => !recentlyNagged.has(p.id));

  if (people.length === 0 && !force) {
    console.log(
      candidates.length === 0
        ? "Nobody is due. No email sent."
        : `All ${candidates.length} due people were flagged within the last ${cooldownDays} days. No email sent. Use --force to send anyway.`,
    );
    return;
  }

  const stats = await dashboardStats();
  const digest = buildDigest({
    people,
    summary: {
      totalPeople: stats.totalPeople,
      peopleReachedThisYear: stats.peopleReachedThisYear,
      overdue: stats.overdue,
      dueSoon: stats.dueSoon,
    },
    baseUrl,
    today,
  });

  const transport = detectTransport();
  if (dryRun || transport === "dry-run" || !to) {
    console.log(digest.text);
    console.log("\n" + "-".repeat(60));
    if (!to) console.log("No NETWORK_EMAIL_TO set, so this was a dry run.");
    else if (dryRun) console.log(`Dry run. Would have emailed ${to}.`);
    else
      console.log(
        "No mail transport configured. Set RESEND_API_KEY, or SMTP_HOST + SMTP_USER + SMTP_PASS.",
      );
    return;
  }

  await sendMail({
    to,
    from,
    subject: digest.subject,
    text: digest.text,
    html: digest.html,
  });

  const db = await getDb();
  const now = new Date().toISOString();
  await db.batch(
    people.map((p) => ({
      sql: "INSERT INTO reminder_log (person_id, sent_on, created_at) VALUES (?, ?, ?)",
      args: [p.id, today, now],
    })),
    "write",
  );

  console.log(
    `Sent ${people.length} reminder${people.length === 1 ? "" : "s"} to ${to} via ${transport}.`,
  );
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});

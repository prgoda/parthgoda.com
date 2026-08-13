import {
  closenessLabel,
  formatDate,
  humanGap,
  cadenceLabel,
} from "./cadence";
import type { PersonWithStatus } from "./types";

export interface DigestInput {
  people: PersonWithStatus[];
  /** Headline numbers, so the email doubles as a weekly pulse. */
  summary: {
    totalPeople: number;
    peopleReachedThisYear: number;
    overdue: number;
    dueSoon: number;
  };
  baseUrl: string;
  today: string;
}

export interface Digest {
  subject: string;
  text: string;
  html: string;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** "Overdue by 3 months" / "Due in 4 days". */
function urgencyLine(p: PersonWithStatus): string {
  if (p.days_overdue >= 0) {
    return p.days_overdue === 0
      ? "Due today"
      : `Overdue by ${humanGap(p.days_overdue).replace(" ago", "")}`;
  }
  return `Due ${humanGap(p.days_overdue)}`;
}

function contactLine(p: PersonWithStatus): string[] {
  const bits: string[] = [];
  if (p.email) bits.push(p.email);
  if (p.phone) bits.push(p.phone);
  return bits;
}

function contextLine(p: PersonWithStatus): string {
  const bits: string[] = [closenessLabel(p.closeness)];
  if (p.role && p.company) bits.push(`${p.role} at ${p.company}`);
  else if (p.company) bits.push(p.company);
  else if (p.role) bits.push(p.role);
  if (p.where_met) bits.push(`met: ${p.where_met}${p.met_year ? ` (${p.met_year})` : ""}`);
  bits.push(cadenceLabel(p.cadence_days).toLowerCase());
  return bits.join(" · ");
}

function lastTouchLine(p: PersonWithStatus): string {
  if (!p.last_contact) return "No contact logged yet.";
  const base = `Last spoke ${formatDate(p.last_contact)} (${humanGap(p.days_since_contact ?? 0)})`;
  return p.awaiting_reply ? `${base}. Still waiting on a reply.` : `${base}.`;
}

export function buildDigest({
  people,
  summary,
  baseUrl,
  today,
}: DigestInput): Digest {
  const count = people.length;
  const subject =
    count === 0
      ? "Network: all clear this week"
      : `Network: ${count} ${count === 1 ? "person" : "people"} to reach out to`;

  // ── plain text ────────────────────────────────────────────────────────────
  const textLines: string[] = [];
  textLines.push(subject.toUpperCase());
  textLines.push(formatDate(today));
  textLines.push("");
  textLines.push(
    `${summary.totalPeople} people tracked · ${summary.peopleReachedThisYear} reached this year · ${summary.overdue} overdue · ${summary.dueSoon} due soon`,
  );
  textLines.push("");

  if (count === 0) {
    textLines.push("Nobody is overdue. Enjoy it.");
  } else {
    people.forEach((p, i) => {
      textLines.push(`${i + 1}. ${p.name}: ${urgencyLine(p)}`);
      textLines.push(`   ${contextLine(p)}`);
      const contacts = contactLine(p);
      if (contacts.length) textLines.push(`   ${contacts.join(" · ")}`);
      textLines.push(`   ${lastTouchLine(p)}`);
      if (p.notes) textLines.push(`   Note: ${p.notes.split("\n")[0]}`);
      textLines.push(`   ${baseUrl}/network/people/${p.id}`);
      textLines.push("");
    });
  }
  textLines.push(`Open the dashboard: ${baseUrl}/network`);

  // ── html ──────────────────────────────────────────────────────────────────
  const cards = people
    .map((p) => {
      const contacts = contactLine(p)
        .map((c) =>
          c.includes("@")
            ? `<a href="mailto:${escapeHtml(c)}" style="color:#18181b;">${escapeHtml(c)}</a>`
            : `<a href="tel:${escapeHtml(c.replace(/\s/g, ""))}" style="color:#18181b;">${escapeHtml(c)}</a>`,
        )
        .join(" &nbsp;·&nbsp; ");

      const accent = p.days_overdue >= 90 ? "#b91c1c" : p.days_overdue >= 0 ? "#c2410c" : "#a16207";

      return `
      <tr><td style="padding:0 0 12px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
               style="border:1px solid #e4e4e7;border-radius:10px;border-left:3px solid ${accent};">
          <tr><td style="padding:16px 18px;">
            <div style="font:600 11px/1 -apple-system,Segoe UI,sans-serif;letter-spacing:.09em;text-transform:uppercase;color:${accent};margin-bottom:8px;">
              ${escapeHtml(urgencyLine(p))}
            </div>
            <div style="font:700 18px/1.3 Georgia,serif;color:#18181b;margin-bottom:6px;">
              <a href="${baseUrl}/network/people/${p.id}" style="color:#18181b;text-decoration:none;">${escapeHtml(p.name)}</a>
            </div>
            <div style="font:400 13px/1.5 -apple-system,Segoe UI,sans-serif;color:#71717a;margin-bottom:8px;">
              ${escapeHtml(contextLine(p))}
            </div>
            <div style="font:400 13px/1.6 -apple-system,Segoe UI,sans-serif;color:#3f3f46;">
              ${escapeHtml(lastTouchLine(p))}
            </div>
            ${
              p.notes
                ? `<div style="font:400 13px/1.6 -apple-system,Segoe UI,sans-serif;color:#3f3f46;margin-top:6px;padding-left:10px;border-left:2px solid #e4e4e7;">${escapeHtml(
                    p.notes.split("\n")[0],
                  )}</div>`
                : ""
            }
            ${
              contacts
                ? `<div style="font:400 13px/1.6 -apple-system,Segoe UI,sans-serif;color:#71717a;margin-top:10px;">${contacts}</div>`
                : ""
            }
          </td></tr>
        </table>
      </td></tr>`;
    })
    .join("");

  const html = `<!doctype html>
<html><body style="margin:0;padding:24px 12px;background:#fafafa;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">

  <tr><td style="padding-bottom:4px;font:600 11px/1 -apple-system,Segoe UI,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#a1a1aa;">
    Keep in touch · ${escapeHtml(formatDate(today))}
  </td></tr>
  <tr><td style="padding-bottom:18px;font:700 28px/1.2 Georgia,serif;color:#18181b;">
    ${count === 0 ? "Nobody is overdue" : `${count} ${count === 1 ? "person" : "people"} worth a message`}
  </td></tr>

  <tr><td style="padding:14px 18px;margin-bottom:20px;background:#f4f4f5;border-radius:10px;font:400 13px/1.6 -apple-system,Segoe UI,sans-serif;color:#3f3f46;">
    <strong style="color:#18181b;">${summary.totalPeople}</strong> people tracked &nbsp;·&nbsp;
    <strong style="color:#18181b;">${summary.peopleReachedThisYear}</strong> reached this year &nbsp;·&nbsp;
    <strong style="color:#18181b;">${summary.overdue}</strong> overdue &nbsp;·&nbsp;
    <strong style="color:#18181b;">${summary.dueSoon}</strong> due soon
  </td></tr>
  <tr><td style="height:20px;"></td></tr>

  ${cards || `<tr><td style="font:400 15px/1.6 -apple-system,Segoe UI,sans-serif;color:#3f3f46;">Your list is clear. Nothing is overdue today.</td></tr>`}

  <tr><td style="padding-top:12px;">
    <a href="${baseUrl}/network" style="display:inline-block;padding:11px 20px;background:#18181b;color:#ffffff;border-radius:8px;font:600 13px/1 -apple-system,Segoe UI,sans-serif;text-decoration:none;">Open the dashboard</a>
  </td></tr>
  <tr><td style="padding-top:22px;font:400 11px/1.6 -apple-system,Segoe UI,sans-serif;color:#a1a1aa;">
    Sent by your own machine. Log the conversation after you have it so the clock resets.
  </td></tr>

</table>
</td></tr></table>
</body></html>`;

  return { subject, text: textLines.join("\n"), html };
}

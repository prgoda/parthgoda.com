#!/usr/bin/env tsx
/**
 * Bulk-loads people from a CSV so you can dump a contact export in one go.
 *
 *   npm run network:import -- people.csv
 *   npm run network:import -- people.csv --dry-run
 *
 * Recognised columns (any order, extras ignored, header case-insensitive):
 *   name, email, phone, linkedin, company, role, location, gender,
 *   where_met, met_year, closeness, cadence_days, tags, notes, last_contact
 *
 * Matching on name + email means re-running the same file updates rather than
 * duplicates.
 */
import fs from "fs";
import path from "path";
import { loadEnv } from "./_env";
import { queryOne } from "../lib/network/db";
import {
  createPerson,
  logInteraction,
  updatePerson,
  type PersonInput,
} from "../lib/network/queries";
import { defaultCadenceFor } from "../lib/network/cadence";
import { GENDERS, type Closeness, type Gender } from "../lib/network/types";

loadEnv();

/** Minimal RFC-4180 reader: quoted fields, doubled quotes, embedded newlines. */
function parseCsv(input: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];

    if (quoted) {
      if (ch === '"') {
        if (input[i + 1] === '"') {
          field += '"';
          i++;
        } else quoted = false;
      } else field += ch;
      continue;
    }

    if (ch === '"') quoted = true;
    else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && input[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      if (row.some((c) => c.trim() !== "")) rows.push(row);
      row = [];
    } else field += ch;
  }

  row.push(field);
  if (row.some((c) => c.trim() !== "")) rows.push(row);
  return rows;
}

function normaliseHeader(h: string): string {
  return h.trim().toLowerCase().replace(/[\s-]+/g, "_");
}

function toGender(raw: string | undefined): Gender {
  const v = raw?.trim().toLowerCase() ?? "";
  if (v.startsWith("f") || v === "woman") return "female";
  if (v.startsWith("m") || v === "man") return "male";
  if (v.startsWith("n") || v === "nb" || v === "enby") return "nonbinary";
  return (GENDERS as readonly string[]).includes(v) ? (v as Gender) : "unspecified";
}

function toClose(raw: string | undefined): Closeness {
  const n = Number(raw);
  if (Number.isFinite(n) && n >= 1 && n <= 5) return Math.round(n) as Closeness;
  const word = raw?.trim().toLowerCase() ?? "";
  const byWord: Record<string, Closeness> = {
    inner: 1,
    "inner circle": 1,
    close: 2,
    active: 3,
    periphery: 4,
    distant: 5,
  };
  return byWord[word] ?? 3;
}

/** Accepts YYYY-MM-DD, DD/MM/YYYY and YYYY. Anything else is ignored. */
function toDate(raw: string | undefined): string | null {
  const v = raw?.trim();
  if (!v) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
  const dmy = v.match(/^(\d{1,2})[/.](\d{1,2})[/.](\d{4})$/);
  if (dmy) {
    return `${dmy[3]}-${dmy[2].padStart(2, "0")}-${dmy[1].padStart(2, "0")}`;
  }
  if (/^\d{4}$/.test(v)) return `${v}-01-01`;
  return null;
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const file = args.find((a) => !a.startsWith("--"));

  if (!file) {
    console.error("Usage: npm run network:import -- <file.csv> [--dry-run]");
    process.exit(1);
  }

  const full = path.resolve(process.cwd(), file);
  if (!fs.existsSync(full)) {
    console.error(`No such file: ${full}`);
    process.exit(1);
  }

  const rows = parseCsv(fs.readFileSync(full, "utf-8"));
  if (rows.length < 2) {
    console.error("That CSV has a header but no rows.");
    process.exit(1);
  }

  const headers = rows[0].map(normaliseHeader);
  const FIND_EXISTING =
    "SELECT id FROM people WHERE LOWER(name) = LOWER(?) AND COALESCE(LOWER(email),'') = COALESCE(LOWER(?),'')";

  let created = 0;
  let updated = 0;
  let backfilled = 0;
  const skipped: string[] = [];

  for (const raw of rows.slice(1)) {
    const cell = (key: string): string | undefined => {
      const i = headers.indexOf(key);
      const v = i === -1 ? undefined : raw[i]?.trim();
      return v === "" ? undefined : v;
    };

    const name = cell("name") ?? cell("full_name");
    if (!name) {
      skipped.push(raw.join(","));
      continue;
    }

    const closeness = toClose(cell("closeness"));
    const cadenceRaw = Number(cell("cadence_days"));
    const email = cell("email") ?? null;

    const person: PersonInput = {
      name,
      gender: toGender(cell("gender")),
      email,
      phone: cell("phone") ?? null,
      linkedin: cell("linkedin") ?? null,
      company: cell("company") ?? null,
      role: cell("role") ?? cell("title") ?? null,
      location: cell("location") ?? cell("city") ?? null,
      where_met: cell("where_met") ?? cell("how_we_met") ?? null,
      met_year: Number(cell("met_year")) || null,
      closeness,
      cadence_days:
        Number.isFinite(cadenceRaw) && cadenceRaw > 0
          ? Math.round(cadenceRaw)
          : defaultCadenceFor(closeness),
      tags: cell("tags") ?? null,
      notes: cell("notes") ?? null,
      snooze_until: null,
    };

    const existing = await queryOne<{ id: number }>(FIND_EXISTING, [
      name,
      email,
    ]);

    if (dryRun) {
      if (existing) updated++;
      else created++;
      continue;
    }

    let id: number;
    if (existing) {
      await updatePerson(existing.id, person);
      id = existing.id;
      updated++;
    } else {
      id = await createPerson(person);
      created++;
    }

    // A "last contacted" column becomes one backfilled interaction, but only
    // for fresh rows, so re-imports do not stack duplicate history.
    const last = toDate(cell("last_contact") ?? cell("last_contacted"));
    if (last && !existing) {
      await logInteraction({
        person_id: id,
        occurred_on: last,
        direction: "outbound",
        channel: "other",
        responded: 1,
        note: "Backfilled from CSV import.",
      });
      backfilled++;
    }
  }

  console.log(
    `${dryRun ? "[dry run] " : ""}${created} added, ${updated} updated, ${backfilled} with history backfilled.`,
  );
  if (skipped.length) {
    console.log(`${skipped.length} row(s) skipped for having no name.`);
  }
  if (dryRun) console.log("Nothing was written. Drop --dry-run to commit.");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});

"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CASELOG_COOKIE, passphrase, tokenFor } from "@/lib/case-log/auth";
import {
  createCase,
  deleteCase,
  updateCase,
  type CaseInput,
} from "@/lib/case-log/queries";
import { parseDrills } from "@/lib/case-log/scoring";
import {
  CASE_TYPES,
  FIRMS,
  FORMATS,
  ROLES,
  STYLES,
  type CaseType,
  type Firm,
  type Format,
  type Role,
  type Score,
  type Style,
} from "@/lib/case-log/types";
import { todayISO } from "@/lib/dates";

// ── form helpers ────────────────────────────────────────────────────────────

function str(fd: FormData, key: string): string | null {
  const v = fd.get(key);
  if (typeof v !== "string") return null;
  const trimmed = v.trim();
  return trimmed === "" ? null : trimmed;
}

function num(fd: FormData, key: string): number | null {
  const v = str(fd, key);
  if (v === null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function oneOf<T extends string>(
  fd: FormData,
  key: string,
  allowed: readonly T[],
  fallback: T,
): T {
  const v = str(fd, key);
  return v !== null && (allowed as readonly string[]).includes(v)
    ? (v as T)
    : fallback;
}

function optionalOneOf<T extends string>(
  fd: FormData,
  key: string,
  allowed: readonly T[],
): T | null {
  const v = str(fd, key);
  return v !== null && (allowed as readonly string[]).includes(v)
    ? (v as T)
    : null;
}

/** Blank stays blank: an unscored dimension is data, not a zero. */
function score(fd: FormData, key: string): Score | null {
  const n = num(fd, key);
  if (n === null) return null;
  const clamped = Math.min(5, Math.max(1, Math.round(n)));
  return clamped as Score;
}

function id(fd: FormData): number | null {
  const n = num(fd, "id");
  return n !== null && Number.isInteger(n) && n > 0 ? n : null;
}

function refresh(caseId?: number) {
  revalidatePath("/case-log");
  revalidatePath("/case-log/cases");
  if (caseId) revalidatePath(`/case-log/cases/${caseId}`);
}

function readCase(fd: FormData): CaseInput {
  const drills = parseDrills(str(fd, "drills"));
  const minutes = num(fd, "minutes");
  const date = str(fd, "practiced_on");

  return {
    // A future date is almost always a typo in the date picker.
    practiced_on: date && date <= todayISO() ? date : todayISO(),
    title: str(fd, "title") ?? "Untitled case",
    prompt: str(fd, "prompt"),
    source: str(fd, "source"),
    firm: optionalOneOf<Firm>(fd, "firm", FIRMS),
    style: oneOf<Style>(fd, "style", STYLES, "unsure"),
    case_type: oneOf<CaseType>(fd, "case_type", CASE_TYPES, "other"),
    industry: str(fd, "industry"),
    partner: str(fd, "partner"),
    role: oneOf<Role>(fd, "role", ROLES, "interviewee"),
    format: oneOf<Format>(fd, "format", FORMATS, "video"),
    minutes: minutes !== null && minutes > 0 ? Math.round(minutes) : null,
    structure: score(fd, "structure"),
    math: score(fd, "math"),
    insight: score(fd, "insight"),
    synthesis: score(fd, "synthesis"),
    presence: score(fd, "presence"),
    went_well: str(fd, "went_well"),
    to_fix: str(fd, "to_fix"),
    drills: drills.length ? drills.join(", ") : null,
    notes: str(fd, "notes"),
  };
}

// ── cases ───────────────────────────────────────────────────────────────────

export async function createCaseAction(fd: FormData) {
  const newId = await createCase(readCase(fd));
  refresh(newId);
  redirect(`/case-log/cases/${newId}`);
}

export async function updateCaseAction(fd: FormData) {
  const caseId = id(fd);
  if (!caseId) redirect("/case-log/cases");
  await updateCase(caseId, readCase(fd));
  refresh(caseId);
  redirect(`/case-log/cases/${caseId}`);
}

export async function deleteCaseAction(fd: FormData) {
  const caseId = id(fd);
  if (caseId) {
    await deleteCase(caseId);
    refresh();
  }
  redirect("/case-log/cases");
}

// ── lock ────────────────────────────────────────────────────────────────────

export async function loginAction(fd: FormData) {
  const secret = passphrase();
  const attempt = str(fd, "passphrase") ?? "";
  const next = str(fd, "next") ?? "/case-log";

  if (!secret || attempt !== secret) {
    redirect(
      `/case-log/login?error=1${
        next !== "/case-log" ? `&next=${encodeURIComponent(next)}` : ""
      }`,
    );
  }

  const jar = await cookies();
  jar.set(CASELOG_COOKIE, await tokenFor(secret), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  redirect(next.startsWith("/case-log") ? next : "/case-log");
}

export async function logoutAction() {
  const jar = await cookies();
  jar.delete(CASELOG_COOKIE);
  redirect("/case-log/login");
}

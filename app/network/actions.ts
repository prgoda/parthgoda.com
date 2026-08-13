"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { NETWORK_COOKIE, passphrase, tokenFor } from "@/lib/network/auth";
import { addDays, defaultCadenceFor, todayISO } from "@/lib/network/cadence";
import {
  createPerson,
  deleteInteraction,
  deletePerson,
  logInteraction,
  markResponded,
  setArchived,
  snoozePerson,
  updatePerson,
  type PersonInput,
} from "@/lib/network/queries";
import {
  CHANNELS,
  DIRECTIONS,
  GENDERS,
  type Channel,
  type Closeness,
  type Direction,
  type Gender,
} from "@/lib/network/types";

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
  return v !== null && (allowed as readonly string[]).includes(v) ? (v as T) : fallback;
}

function refresh(personId?: number) {
  revalidatePath("/network");
  revalidatePath("/network/people");
  if (personId) revalidatePath(`/network/people/${personId}`);
}

function readPerson(fd: FormData): PersonInput {
  const gender = oneOf<Gender>(fd, "gender", GENDERS, "unspecified");
  const closenessRaw = num(fd, "closeness") ?? 3;
  const closeness = (Math.min(5, Math.max(1, Math.round(closenessRaw))) as Closeness);
  const cadence = num(fd, "cadence_days");

  return {
    name: str(fd, "name") ?? "Unnamed",
    gender,
    email: str(fd, "email"),
    phone: str(fd, "phone"),
    linkedin: str(fd, "linkedin"),
    company: str(fd, "company"),
    role: str(fd, "role"),
    location: str(fd, "location"),
    where_met: str(fd, "where_met"),
    met_year: num(fd, "met_year"),
    closeness,
    cadence_days:
      cadence && cadence > 0 ? Math.round(cadence) : defaultCadenceFor(closeness),
    tags: str(fd, "tags"),
    notes: str(fd, "notes"),
    snooze_until: str(fd, "snooze_until"),
  };
}

// ── people ──────────────────────────────────────────────────────────────────

export async function createPersonAction(fd: FormData) {
  const input = readPerson(fd);
  if (!str(fd, "name")) return;
  const id = createPerson(input);

  // Optional "we last spoke on" shortcut on the add form.
  const lastSpoke = str(fd, "last_contact");
  if (lastSpoke) {
    logInteraction({
      person_id: id,
      occurred_on: lastSpoke,
      direction: "outbound",
      channel: oneOf<Channel>(fd, "last_channel", CHANNELS, "other"),
      responded: 1,
      note: "Backfilled when the contact was added.",
    });
  }

  refresh(id);
  redirect(`/network/people/${id}`);
}

export async function updatePersonAction(fd: FormData) {
  const id = num(fd, "id");
  if (!id) return;
  updatePerson(id, readPerson(fd));
  refresh(id);
  redirect(`/network/people/${id}`);
}

export async function deletePersonAction(fd: FormData) {
  const id = num(fd, "id");
  if (!id) return;
  deletePerson(id);
  refresh();
  redirect("/network/people");
}

export async function archiveAction(fd: FormData) {
  const id = num(fd, "id");
  if (!id) return;
  setArchived(id, str(fd, "archived") === "1");
  refresh(id);
}

export async function snoozeAction(fd: FormData) {
  const id = num(fd, "id");
  if (!id) return;
  const days = num(fd, "days") ?? 30;
  snoozePerson(id, days > 0 ? addDays(todayISO(), days) : null);
  refresh(id);
}

// ── interactions ────────────────────────────────────────────────────────────

export async function logInteractionAction(fd: FormData) {
  const personId = num(fd, "person_id");
  if (!personId) return;
  logInteraction({
    person_id: personId,
    occurred_on: str(fd, "occurred_on") ?? todayISO(),
    direction: oneOf<Direction>(fd, "direction", DIRECTIONS, "outbound"),
    channel: oneOf<Channel>(fd, "channel", CHANNELS, "other"),
    responded: fd.get("responded") ? 1 : 0,
    note: str(fd, "note"),
  });
  refresh(personId);
}

/** One-click "spoke to them today" from the dashboard and list views. */
export async function quickLogAction(fd: FormData) {
  const personId = num(fd, "person_id");
  if (!personId) return;
  logInteraction({
    person_id: personId,
    occurred_on: todayISO(),
    direction: "outbound",
    channel: oneOf<Channel>(fd, "channel", CHANNELS, "other"),
    responded: 0,
    note: null,
  });
  refresh(personId);
}

export async function markRespondedAction(fd: FormData) {
  const id = num(fd, "id");
  const personId = num(fd, "person_id");
  if (!id) return;
  markResponded(id, str(fd, "responded") === "1");
  refresh(personId ?? undefined);
}

export async function deleteInteractionAction(fd: FormData) {
  const id = num(fd, "id");
  const personId = num(fd, "person_id");
  if (!id) return;
  deleteInteraction(id);
  refresh(personId ?? undefined);
}

// ── session ─────────────────────────────────────────────────────────────────

export async function loginAction(fd: FormData) {
  const secret = passphrase();
  const attempt = str(fd, "passphrase") ?? "";
  const next = str(fd, "next") ?? "/network";

  if (!secret || attempt !== secret) {
    redirect(`/network/login?error=1${next !== "/network" ? `&next=${encodeURIComponent(next)}` : ""}`);
  }

  const jar = await cookies();
  jar.set(NETWORK_COOKIE, await tokenFor(secret), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  redirect(next.startsWith("/network") ? next : "/network");
}

export async function logoutAction() {
  const jar = await cookies();
  jar.delete(NETWORK_COOKIE);
  redirect("/network/login");
}

"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CADENCE_PRESETS,
  CLOSENESS_TIERS,
  GENDER_LABELS,
  cadenceLabel,
  defaultCadenceFor,
  todayISO,
} from "@/lib/network/cadence";
import {
  CHANNELS,
  GENDERS,
  type Closeness,
  type Person,
} from "@/lib/network/types";
import { buttonClass, Card, ghostButtonClass } from "./ui";

const labelClass =
  "block text-[11px] font-semibold uppercase tracking-widest text-zinc-500 mb-1.5";
const inputClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors focus:border-zinc-900";

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  type = "text",
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  placeholder?: string;
  type?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className={labelClass} htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        className={inputClass}
      />
      {hint && <p className="mt-1 text-xs text-zinc-400">{hint}</p>}
    </div>
  );
}

export default function PersonForm({
  action,
  person,
  submitLabel,
}: {
  action: (fd: FormData) => void | Promise<void>;
  person?: Person;
  submitLabel: string;
}) {
  const [closeness, setCloseness] = useState<Closeness>(person?.closeness ?? 3);
  const [cadence, setCadence] = useState<number>(
    person?.cadence_days ?? defaultCadenceFor(person?.closeness ?? 3),
  );
  // Once the cadence is set by hand, changing the tier stops overwriting it.
  const [cadenceTouched, setCadenceTouched] = useState(
    Boolean(person && person.cadence_days !== defaultCadenceFor(person.closeness)),
  );

  function pickCloseness(value: Closeness) {
    setCloseness(value);
    if (!cadenceTouched) setCadence(defaultCadenceFor(value));
  }

  return (
    <form action={action} className="space-y-6">
      {person && <input type="hidden" name="id" value={person.id} />}

      <Card className="p-5 md:p-6">
        <h2 className="font-serif text-lg font-bold mb-4">Who they are</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Field label="Name" name="name" defaultValue={person?.name} placeholder="Full name" />
          </div>
          <Field label="Email" name="email" type="email" defaultValue={person?.email} />
          <Field label="Phone" name="phone" defaultValue={person?.phone} placeholder="+91 ..." />
          <Field label="Company" name="company" defaultValue={person?.company} />
          <Field label="Role" name="role" defaultValue={person?.role} />
          <Field label="Location" name="location" defaultValue={person?.location} placeholder="City" />
          <Field label="LinkedIn" name="linkedin" defaultValue={person?.linkedin} placeholder="URL or handle" />
          <div>
            <label className={labelClass} htmlFor="gender">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              defaultValue={person?.gender ?? "unspecified"}
              className={inputClass}
            >
              {GENDERS.map((g) => (
                <option key={g} value={g}>
                  {GENDER_LABELS[g]}
                </option>
              ))}
            </select>
          </div>
          <Field
            label="Tags"
            name="tags"
            defaultValue={person?.tags}
            placeholder="mentor, investor, army"
            hint="Comma separated."
          />
        </div>
      </Card>

      <Card className="p-5 md:p-6">
        <h2 className="font-serif text-lg font-bold mb-4">How you know them</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <Field
              label="Where you met"
              name="where_met"
              defaultValue={person?.where_met}
              placeholder="Formlabs, IIM Bangalore, Army, a wedding in Goa"
            />
          </div>
          <Field
            label="Year met"
            name="met_year"
            type="number"
            defaultValue={person?.met_year}
            placeholder="2019"
          />
        </div>
        <div className="mt-4">
          <label className={labelClass} htmlFor="notes">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            defaultValue={person?.notes ?? ""}
            placeholder="What they are working on, what you owe them, what to ask about next time."
            className={`${inputClass} resize-y leading-relaxed`}
          />
          <p className="mt-1 text-xs text-zinc-400">
            The first line shows up in your reminder emails.
          </p>
        </div>
      </Card>

      <Card className="p-5 md:p-6">
        <h2 className="font-serif text-lg font-bold mb-1">How often to reach out</h2>
        <p className="text-sm text-zinc-500 mb-4">
          Pick a tier and the cadence fills itself in. Override it whenever the
          tier is not quite right.
        </p>

        <input type="hidden" name="closeness" value={closeness} />
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {CLOSENESS_TIERS.map((tier) => {
            const active = tier.value === closeness;
            return (
              <button
                key={tier.value}
                type="button"
                onClick={() => pickCloseness(tier.value)}
                className={`rounded-lg border p-3 text-left transition-colors ${
                  active
                    ? "border-zinc-900 bg-zinc-900 text-white"
                    : "border-zinc-200 bg-white hover:border-zinc-400"
                }`}
              >
                <div className="text-sm font-semibold">{tier.label}</div>
                <div
                  className={`mt-1 text-xs leading-snug ${active ? "text-zinc-300" : "text-zinc-500"}`}
                >
                  {tier.blurb}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="cadence_days">
              Reach out every (days)
            </label>
            <input
              id="cadence_days"
              name="cadence_days"
              type="number"
              min={1}
              value={cadence}
              onChange={(e) => {
                setCadence(Number(e.target.value));
                setCadenceTouched(true);
              }}
              className={inputClass}
            />
            <p className="mt-1 text-xs text-zinc-400">{cadenceLabel(cadence)}</p>
          </div>
          <div>
            <span className={labelClass}>Quick picks</span>
            <div className="flex flex-wrap gap-1.5">
              {CADENCE_PRESETS.map((p) => (
                <button
                  key={p.days}
                  type="button"
                  onClick={() => {
                    setCadence(p.days);
                    setCadenceTouched(true);
                  }}
                  className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                    cadence === p.days
                      ? "border-zinc-900 bg-zinc-900 text-white"
                      : "border-zinc-300 text-zinc-600 hover:border-zinc-500"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {!person && (
        <Card className="p-5 md:p-6">
          <h2 className="font-serif text-lg font-bold mb-1">
            When did you last speak?
          </h2>
          <p className="text-sm text-zinc-500 mb-4">
            Optional. Fills in one past interaction so the clock starts from the
            right place instead of today.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="last_contact">
                Date
              </label>
              <input
                id="last_contact"
                name="last_contact"
                type="date"
                max={todayISO()}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="last_channel">
                How
              </label>
              <select id="last_channel" name="last_channel" className={inputClass}>
                {CHANNELS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>
      )}

      <div className="flex items-center gap-3">
        <button type="submit" className={buttonClass}>
          {submitLabel}
        </button>
        <Link
          href={person ? `/network/people/${person.id}` : "/network/people"}
          className={ghostButtonClass}
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

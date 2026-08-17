"use client";

import Link from "next/link";
import { useState } from "react";
import { SCORE_LABELS } from "@/lib/case-log/scoring";
import {
  CASE_TYPES,
  CASE_TYPE_LABELS,
  DIMENSIONS,
  DIMENSION_META,
  FIRMS,
  FIRM_LABELS,
  FORMATS,
  FORMAT_LABELS,
  ROLES,
  ROLE_LABELS,
  STYLES,
  STYLE_LABELS,
  type CaseEntry,
  type Dimension,
  type Role,
  type Score,
} from "@/lib/case-log/types";
import { todayISO } from "@/lib/dates";
import {
  buttonClass,
  Card,
  ghostButtonClass,
  inputClass,
  labelClass,
} from "./ui";

const MINUTE_PRESETS = [20, 30, 40, 45, 60];

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  type = "text",
  hint,
  max,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  placeholder?: string;
  type?: string;
  hint?: string;
  max?: string;
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
        max={max}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        className={inputClass}
      />
      {hint && <p className="mt-1 text-xs text-zinc-400">{hint}</p>}
    </div>
  );
}

function TextArea({
  label,
  name,
  defaultValue,
  placeholder,
  rows = 3,
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  placeholder?: string;
  rows?: number;
  hint?: string;
}) {
  return (
    <div>
      <label className={labelClass} htmlFor={name}>
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        className={`${inputClass} resize-y leading-relaxed`}
      />
      {hint && <p className="mt-1 text-xs text-zinc-400">{hint}</p>}
    </div>
  );
}

/**
 * One row per dimension: five buttons and a clear. Clicking is faster than
 * typing five numbers, and the row stays honest about what was left unscored.
 */
function ScoreRow({
  dimension,
  value,
  onChange,
}: {
  dimension: Dimension;
  value: Score | null;
  onChange: (value: Score | null) => void;
}) {
  const meta = DIMENSION_META[dimension];
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-zinc-100 py-3 first:border-t-0">
      <div className="min-w-44 flex-1">
        <div className="text-sm font-semibold text-zinc-800">{meta.label}</div>
        <div className="text-xs text-zinc-500 leading-snug">{meta.blurb}</div>
      </div>

      <input type="hidden" name={dimension} value={value ?? ""} />
      <div className="flex items-center gap-1.5">
        {([1, 2, 3, 4, 5] as Score[]).map((n) => {
          const active = value === n;
          return (
            <button
              key={n}
              type="button"
              title={SCORE_LABELS[n]}
              aria-pressed={active}
              onClick={() => onChange(active ? null : n)}
              className={`h-9 w-9 rounded-lg border text-sm font-semibold transition-colors ${
                active
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-zinc-200 bg-white text-zinc-500 hover:border-zinc-400 hover:text-zinc-900"
              }`}
            >
              {n}
            </button>
          );
        })}
        <span className="ml-1 w-24 text-xs text-zinc-500">
          {value === null ? "Not scored" : SCORE_LABELS[value]}
        </span>
      </div>
    </div>
  );
}

export default function CaseForm({
  action,
  entry,
  submitLabel,
}: {
  action: (fd: FormData) => void | Promise<void>;
  entry?: CaseEntry;
  submitLabel: string;
}) {
  const [role, setRole] = useState<Role>(entry?.role ?? "interviewee");
  const [minutes, setMinutes] = useState<string>(
    entry?.minutes ? String(entry.minutes) : "",
  );
  const [scores, setScores] = useState<Record<Dimension, Score | null>>({
    structure: entry?.structure ?? null,
    math: entry?.math ?? null,
    insight: entry?.insight ?? null,
    synthesis: entry?.synthesis ?? null,
    presence: entry?.presence ?? null,
  });

  const filled = DIMENSIONS.filter((d) => scores[d] !== null);
  const average =
    filled.length === 0
      ? null
      : filled.reduce((sum, d) => sum + (scores[d] as number), 0) /
        filled.length;

  return (
    <form action={action} className="space-y-6">
      {entry && <input type="hidden" name="id" value={entry.id} />}

      <Card className="p-5 md:p-6">
        <h2 className="font-serif text-lg font-bold mb-4">The case</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <Field
              label="Title"
              name="title"
              defaultValue={entry?.title}
              placeholder="Coffee chain losing margin in tier-2 cities"
            />
          </div>
          <Field
            label="Date"
            name="practiced_on"
            type="date"
            max={todayISO()}
            defaultValue={entry?.practiced_on ?? todayISO()}
          />

          <div>
            <label className={labelClass} htmlFor="case_type">
              Case type
            </label>
            <select
              id="case_type"
              name="case_type"
              defaultValue={entry?.case_type ?? "profitability"}
              className={inputClass}
            >
              {CASE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {CASE_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </div>
          <Field
            label="Industry"
            name="industry"
            defaultValue={entry?.industry}
            placeholder="QSR, pharma, airlines"
          />
          <Field
            label="Source"
            name="source"
            defaultValue={entry?.source}
            placeholder="Kellogg 2024 casebook, Victor Cheng, live with an AC"
          />

          <div className="md:col-span-3">
            <TextArea
              label="Prompt"
              name="prompt"
              defaultValue={entry?.prompt}
              placeholder="Paste the prompt verbatim. Future you will want to re-run this cold."
              rows={3}
            />
          </div>
        </div>
      </Card>

      <Card className="p-5 md:p-6">
        <h2 className="font-serif text-lg font-bold mb-4">The rep</h2>

        <input type="hidden" name="role" value={role} />
        <div className="grid gap-2 sm:grid-cols-2">
          {ROLES.map((r) => {
            const active = r === role;
            return (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`rounded-lg border p-3 text-left transition-colors ${
                  active
                    ? "border-zinc-900 bg-zinc-900 text-white"
                    : "border-zinc-200 bg-white hover:border-zinc-400"
                }`}
              >
                <div className="text-sm font-semibold">{ROLE_LABELS[r]}</div>
                <div
                  className={`mt-1 text-xs leading-snug ${active ? "text-zinc-300" : "text-zinc-500"}`}
                >
                  {r === "interviewee"
                    ? "You were the candidate. Score it below."
                    : "You ran it for someone else. Still a rep, no self-score."}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Field
            label={role === "interviewee" ? "Who gave it" : "Who you gave it to"}
            name="partner"
            defaultValue={entry?.partner}
            placeholder="Name"
            hint="Same spelling every time and the partner stats hold together."
          />
          <div>
            <label className={labelClass} htmlFor="firm">
              Firm style
            </label>
            <select
              id="firm"
              name="firm"
              defaultValue={entry?.firm ?? ""}
              className={inputClass}
            >
              <option value="">Not specific</option>
              {FIRMS.map((f) => (
                <option key={f} value={f}>
                  {FIRM_LABELS[f]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="style">
              Who drove
            </label>
            <select
              id="style"
              name="style"
              defaultValue={entry?.style ?? "unsure"}
              className={inputClass}
            >
              {STYLES.map((s) => (
                <option key={s} value={s}>
                  {STYLE_LABELS[s]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="format">
              Format
            </label>
            <select
              id="format"
              name="format"
              defaultValue={entry?.format ?? "video"}
              className={inputClass}
            >
              {FORMATS.map((f) => (
                <option key={f} value={f}>
                  {FORMAT_LABELS[f]}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className={labelClass} htmlFor="minutes">
              Minutes
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <input
                id="minutes"
                name="minutes"
                type="number"
                min={1}
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                className={`${inputClass} max-w-32`}
              />
              {MINUTE_PRESETS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMinutes(String(m))}
                  className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                    minutes === String(m)
                      ? "border-zinc-900 bg-zinc-900 text-white"
                      : "border-zinc-300 text-zinc-600 hover:border-zinc-500"
                  }`}
                >
                  {m}m
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {role === "interviewee" && (
        <Card className="p-5 md:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-1">
            <h2 className="font-serif text-lg font-bold">The score</h2>
            <div className="text-right">
              <div className="font-serif text-2xl font-bold text-zinc-900">
                {average === null ? "—" : `${(average * 2).toFixed(1)}/10`}
              </div>
              <div className="text-xs text-zinc-500">
                {filled.length}/5 dimensions
              </div>
            </div>
          </div>
          <p className="text-sm text-zinc-500 mb-3">
            Leave a row blank if it never came up. Blank is not a zero, and the
            averages ignore it.
          </p>
          <div>
            {DIMENSIONS.map((d) => (
              <ScoreRow
                key={d}
                dimension={d}
                value={scores[d]}
                onChange={(value) =>
                  setScores((prev) => ({ ...prev, [d]: value }))
                }
              />
            ))}
          </div>
        </Card>
      )}

      {/* Scores still submit when the role is interviewer, so switching back
          and forth in one sitting does not silently discard them. */}
      {role === "interviewer" &&
        DIMENSIONS.map((d) => (
          <input key={d} type="hidden" name={d} value={scores[d] ?? ""} />
        ))}

      <Card className="p-5 md:p-6">
        <h2 className="font-serif text-lg font-bold mb-1">The feedback</h2>
        <p className="text-sm text-zinc-500 mb-4">
          Write it now, while it stings. The dashboard reads these back to you.
        </p>
        <div className="space-y-4">
          <TextArea
            label="What worked"
            name="went_well"
            defaultValue={entry?.went_well}
            placeholder="Structure landed in 90 seconds. Caught the mix shift in exhibit 2 without prompting."
            rows={3}
          />
          <TextArea
            label="Fix before the next one"
            name="to_fix"
            defaultValue={entry?.to_fix}
            placeholder="One thing. The one that would have moved this from a 3 to a 4."
            rows={2}
            hint="This is the line that shows up on the dashboard until you log the next case."
          />
          <Field
            label="Drill tags"
            name="drills"
            defaultValue={entry?.drills}
            placeholder="math setup, exhibit so-what, breakeven"
            hint="Comma separated. Repeats surface as a pattern once you have a few cases in."
          />
          <TextArea
            label="Notes"
            name="notes"
            defaultValue={entry?.notes}
            placeholder="The structure you used, the numbers, the recommendation you gave."
            rows={5}
          />
        </div>
      </Card>

      <div className="flex items-center gap-3">
        <button type="submit" className={buttonClass}>
          {submitLabel}
        </button>
        <Link
          href={entry ? `/case-log/cases/${entry.id}` : "/case-log/cases"}
          className={ghostButtonClass}
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

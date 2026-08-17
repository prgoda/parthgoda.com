"use client";

import { useState } from "react";
import { SCORE_LABELS } from "@/lib/case-log/scoring";
import {
  CASE_TYPES,
  CASE_TYPE_LABELS,
  DIMENSIONS,
  DIMENSION_META,
  FORMATS,
  FORMAT_LABELS,
  type Dimension,
  type Score,
} from "@/lib/case-log/types";
import { todayISO } from "@/lib/dates";
import { buttonClass, Card, inputClass, labelClass } from "./ui";

/**
 * The caser's view. Deliberately shorter than the owner's form: no firm style,
 * no drill tags, no source. Someone doing you a favour after a 40-minute case
 * should be able to finish this in under a minute.
 */
export default function FeedbackForm({
  action,
  token,
}: {
  action: (fd: FormData) => void | Promise<void>;
  token: string;
}) {
  const [scores, setScores] = useState<Record<Dimension, Score | null>>({
    structure: null,
    math: null,
    insight: null,
    synthesis: null,
    presence: null,
  });

  const filled = DIMENSIONS.filter((d) => scores[d] !== null);
  const average =
    filled.length === 0
      ? null
      : filled.reduce((sum, d) => sum + (scores[d] as number), 0) /
        filled.length;

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="token" value={token} />

      <Card className="p-5 md:p-6">
        <h2 className="font-serif text-lg font-bold mb-4">The basics</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="partner">
              Your name
            </label>
            <input
              id="partner"
              name="partner"
              autoFocus
              placeholder="So I know who to thank"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="practiced_on">
              Date of the case
            </label>
            <input
              id="practiced_on"
              name="practiced_on"
              type="date"
              max={todayISO()}
              defaultValue={todayISO()}
              className={inputClass}
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass} htmlFor="title">
              What was the case?
            </label>
            <input
              id="title"
              name="title"
              placeholder="Coffee chain losing margin in tier-2 cities"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="case_type">
              Type of case
            </label>
            <select
              id="case_type"
              name="case_type"
              defaultValue="profitability"
              className={inputClass}
            >
              {CASE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {CASE_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="format">
              How did we do it?
            </label>
            <select
              id="format"
              name="format"
              defaultValue="video"
              className={inputClass}
            >
              {FORMATS.filter((f) => f !== "solo").map((f) => (
                <option key={f} value={f}>
                  {FORMAT_LABELS[f]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      <Card className="p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-1">
          <h2 className="font-serif text-lg font-bold">How did I do?</h2>
          <div className="text-right">
            <div className="font-serif text-2xl font-bold text-zinc-900">
              {average === null ? "—" : `${(average * 2).toFixed(1)}/10`}
            </div>
            <div className="text-xs text-zinc-500">{filled.length}/5 scored</div>
          </div>
        </div>
        <p className="text-sm text-zinc-500 mb-3">
          1 is rough, 5 is offer-worthy. Skip any that never came up — a blank is
          more useful to me than a guess.
        </p>

        <div>
          {DIMENSIONS.map((d) => {
            const meta = DIMENSION_META[d];
            const value = scores[d];
            return (
              <div
                key={d}
                className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-zinc-100 py-3 first:border-t-0"
              >
                <div className="min-w-44 flex-1">
                  <div className="text-sm font-semibold text-zinc-800">
                    {meta.label}
                  </div>
                  <div className="text-xs text-zinc-500 leading-snug">
                    {meta.blurb}
                  </div>
                </div>

                <input type="hidden" name={d} value={value ?? ""} />
                <div className="flex items-center gap-1.5">
                  {([1, 2, 3, 4, 5] as Score[]).map((n) => {
                    const active = value === n;
                    return (
                      <button
                        key={n}
                        type="button"
                        title={SCORE_LABELS[n]}
                        aria-pressed={active}
                        onClick={() =>
                          setScores((prev) => ({
                            ...prev,
                            [d]: active ? null : n,
                          }))
                        }
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
                    {value === null ? "Skipped" : SCORE_LABELS[value]}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="p-5 md:p-6">
        <h2 className="font-serif text-lg font-bold mb-1">In your words</h2>
        <p className="text-sm text-zinc-500 mb-4">
          This is the part I will actually re-read before the next one.
        </p>
        <div className="space-y-4">
          <div>
            <label className={labelClass} htmlFor="went_well">
              What worked
            </label>
            <textarea
              id="went_well"
              name="went_well"
              rows={3}
              placeholder="Structure landed fast, caught the mix shift without prompting..."
              className={`${inputClass} resize-y leading-relaxed`}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="to_fix">
              The one thing to fix
            </label>
            <textarea
              id="to_fix"
              name="to_fix"
              rows={2}
              placeholder="If you only tell me one thing, make it this."
              className={`${inputClass} resize-y leading-relaxed`}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="notes">
              Anything else
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              placeholder="Optional."
              className={`${inputClass} resize-y leading-relaxed`}
            />
          </div>
        </div>
      </Card>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className={buttonClass}>
          Send feedback
        </button>
        <span className="text-xs text-zinc-400">
          This goes onto a public page, so keep it to the case.
        </span>
      </div>
    </form>
  );
}

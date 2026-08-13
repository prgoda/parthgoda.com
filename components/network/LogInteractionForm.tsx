"use client";

import { useState } from "react";
import { logInteractionAction } from "@/app/network/actions";
import { todayISO } from "@/lib/network/cadence";
import { CHANNELS, DIRECTIONS, type Direction } from "@/lib/network/types";
import { buttonClass, Card } from "./ui";

const inputClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors focus:border-zinc-900";
const labelClass =
  "block text-[11px] font-semibold uppercase tracking-widest text-zinc-500 mb-1.5";

export default function LogInteractionForm({ personId }: { personId: number }) {
  const [direction, setDirection] = useState<Direction>("outbound");
  // Remount the form after each submit so the fields clear.
  const [key, setKey] = useState(0);

  return (
    <Card className="p-5">
      <h2 className="font-serif text-lg font-bold mb-4">Log a conversation</h2>
      <form
        key={key}
        action={async (fd) => {
          await logInteractionAction(fd);
          setDirection("outbound");
          setKey((k) => k + 1);
        }}
        className="space-y-4"
      >
        <input type="hidden" name="person_id" value={personId} />

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className={labelClass} htmlFor="occurred_on">
              When
            </label>
            <input
              id="occurred_on"
              name="occurred_on"
              type="date"
              defaultValue={todayISO()}
              max={todayISO()}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="channel">
              How
            </label>
            <select id="channel" name="channel" className={inputClass}>
              {CHANNELS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <span className={labelClass}>Who started it</span>
            <div className="flex rounded-lg border border-zinc-300 overflow-hidden">
              {DIRECTIONS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDirection(d)}
                  className={`flex-1 px-3 py-2 text-xs font-semibold capitalize transition-colors ${
                    direction === d
                      ? "bg-zinc-900 text-white"
                      : "bg-white text-zinc-500 hover:text-zinc-900"
                  }`}
                >
                  {d === "outbound" ? "I did" : "They did"}
                </button>
              ))}
            </div>
            <input type="hidden" name="direction" value={direction} />
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="note">
            What was said
          </label>
          <textarea
            id="note"
            name="note"
            rows={2}
            placeholder="Optional. Something you want to remember next time."
            className={`${inputClass} resize-y`}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          {direction === "outbound" ? (
            <label className="flex items-center gap-2 text-sm text-zinc-600">
              <input
                type="checkbox"
                name="responded"
                value="1"
                className="h-4 w-4 rounded border-zinc-300 accent-zinc-900"
              />
              They replied
            </label>
          ) : (
            <span className="text-sm text-zinc-400">
              Inbound, so a reply is implied.
            </span>
          )}
          <button type="submit" className={buttonClass}>
            Log it
          </button>
        </div>
      </form>
    </Card>
  );
}

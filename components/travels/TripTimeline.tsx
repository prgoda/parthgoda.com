import { formatTripDate, legKm, place } from "@/lib/travels/summary";
import type { Leg, Stay, Trip } from "@/lib/travels/types";

type Entry =
  | { kind: "leg"; date: string; leg: Leg }
  | { kind: "stay"; date: string; stay: Stay };

function entries(trip: Trip): Entry[] {
  const rows: Entry[] = [
    ...trip.legs.map((leg) => ({ kind: "leg" as const, date: leg.date, leg })),
    ...trip.stays.map((stay) => ({ kind: "stay" as const, date: stay.from, stay })),
  ];
  // Stays start where a flight lands, so they sort after the leg that day.
  return rows.sort(
    (a, b) =>
      a.date.localeCompare(b.date) ||
      (a.kind === b.kind ? 0 : a.kind === "leg" ? -1 : 1),
  );
}

function ModeIcon({ leg }: { leg: Leg }) {
  if (leg.modeUnknown) {
    return (
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
        <circle cx="6" cy="12" r="2" />
        <circle cx="12" cy="12" r="2" />
        <circle cx="18" cy="12" r="2" />
      </svg>
    );
  }
  return leg.mode === "flight" ? (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5L21 16z" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M12 2c-4 0-8 .5-8 4v9.5A3.5 3.5 0 0 0 7.5 19L6 20.5v.5h12v-.5L16.5 19a3.5 3.5 0 0 0 3.5-3.5V6c0-3.5-4-4-8-4zM7.5 17A1.5 1.5 0 1 1 9 15.5 1.5 1.5 0 0 1 7.5 17zm3.5-7H6V6h5zm2 0V6h5v4zm3.5 7a1.5 1.5 0 1 1 1.5-1.5 1.5 1.5 0 0 1-1.5 1.5z" />
    </svg>
  );
}

function LegRow({ leg }: { leg: Leg }) {
  const from = place(leg.from);
  const to = place(leg.to);
  const km = legKm(leg);

  return (
    <li className="relative pl-9 pb-7 last:pb-0">
      <span
        className={`absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-white ${
          leg.unbooked
            ? "border border-dashed border-zinc-400 bg-white text-zinc-400"
            : "bg-zinc-900 text-white"
        }`}
      >
        <ModeIcon leg={leg} />
      </span>
      <span className="absolute left-3 top-8 bottom-0 w-px bg-zinc-200" />

      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className="font-serif text-lg font-bold text-zinc-900">
          {from.name} to {to.name}
        </h3>
        <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
          {leg.dateLabel ?? formatTripDate(leg.date)}
          {leg.dateEstimated && "*"}
        </span>
      </div>

      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-zinc-600">
        {leg.unbooked ? (
          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">
            Not booked yet
          </span>
        ) : (
          <>
            {leg.depart && leg.arrive && (
              <span className="tabular-nums">
                {leg.depart} to {leg.arrive}
                {leg.arriveDate && (
                  <span className="text-zinc-400"> next day</span>
                )}
              </span>
            )}
            {leg.number && (
              <>
                <span className="text-zinc-300">·</span>
                <span>
                  {leg.carrier} {leg.number}
                </span>
              </>
            )}
          </>
        )}
        <span className="text-zinc-300">·</span>
        <span className="tabular-nums text-zinc-500">
          {km.toLocaleString("en-GB")} km
        </span>
      </div>

      {leg.note && (
        <p className="mt-1.5 text-sm leading-relaxed text-zinc-500">{leg.note}</p>
      )}
    </li>
  );
}

function StayRow({ stay }: { stay: Stay }) {
  return (
    <li className="relative pl-9 pb-7 last:pb-0">
      <span className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full border border-zinc-300 bg-white ring-4 ring-white">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-zinc-500" fill="currentColor" aria-hidden="true">
          <path d="M4 5v14h2v-3h12v3h2v-8a3 3 0 0 0-3-3h-7V5H4zm3 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" />
        </svg>
      </span>
      <span className="absolute left-3 top-8 bottom-0 w-px bg-zinc-200" />

      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className="font-serif text-lg font-bold text-zinc-900">{stay.name}</h3>
        <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
          {formatTripDate(stay.from)}
        </span>
      </div>
      <p className="mt-1 text-sm text-zinc-600">
        {place(stay.placeId).name} · {stay.nights}{" "}
        {stay.nights === 1 ? "night" : "nights"}
      </p>
    </li>
  );
}

export default function TripTimeline({ trip }: { trip: Trip }) {
  const rows = entries(trip);
  const hasEstimate = trip.legs.some((l) => l.dateEstimated);

  return (
    <div>
      <ul className="relative">
        {rows.map((row, i) =>
          row.kind === "leg" ? (
            <LegRow key={i} leg={row.leg} />
          ) : (
            <StayRow key={i} stay={row.stay} />
          ),
        )}
      </ul>
      {hasEstimate && (
        <p className="mt-4 border-t border-zinc-100 pt-4 text-xs text-zinc-400">
          * The Chicago to Belize booking did not show a date. It is placed the
          morning after the San Francisco flight lands, which is the only slot
          the rest of the itinerary leaves for it.
        </p>
      )}
    </div>
  );
}

import type { Metadata } from "next";
import TripMap, { MapLegend } from "@/components/travels/TripMap";
import TripTimeline from "@/components/travels/TripTimeline";
import { TRIPS } from "@/lib/travels/data";
import {
  formatKm,
  formatTripDate,
  place,
  tripStats,
} from "@/lib/travels/summary";

/**
 * Which stops belong on the zoomed European map. Both ends of a leg have to be
 * in here, otherwise the flight home would stretch the frame back to Chicago.
 */
const EUROPE = ["mad", "svq", "spu", "beg", "krk", "hel"];

export const metadata: Metadata = {
  title: "Travels",
  description:
    "Where I am going and how I am getting there, drawn on a map: San Francisco to Belize to Spain to the Balkans.",
};

function Stat({
  value,
  label,
  sub,
}: {
  value: string;
  label: string;
  sub?: string;
}) {
  return (
    <div className="border-t border-zinc-200 pt-3">
      <div className="font-serif text-3xl font-bold text-zinc-900">{value}</div>
      <div className="mt-0.5 text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
        {label}
      </div>
      {sub && <div className="mt-1 text-xs text-zinc-500">{sub}</div>}
    </div>
  );
}

export default function TravelsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-10">
        <div className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">
          Travels
        </div>
        <h1 className="font-serif text-4xl md:text-5xl font-bold leading-tight text-zinc-900">
          Where I am going
        </h1>
        <p className="mt-5 text-lg text-zinc-600 leading-relaxed">
          Every flight, train and hotel I have booked, drawn on a map. Built
          from the confirmation emails, so it is the real itinerary rather than
          the one I meant to take.
        </p>
      </header>

      {TRIPS.map((trip) => {
        const stats = tripStats(trip);
        // Taken from the legs, not the deduplicated stop list: the trip ends
        // back in Chicago, which the map already drew on the way out.
        const first = place(trip.legs[0].from);
        const last = place(trip.legs[trip.legs.length - 1].to);
        const gaps = trip.legs.filter((l) => l.unbooked);

        return (
          <article key={trip.slug} className="mb-16">
            <div className="mb-6">
              <h2 className="font-serif text-3xl font-bold text-zinc-900">
                {trip.title}
              </h2>
              <p className="mt-1 text-sm font-semibold uppercase tracking-widest text-zinc-400">
                {formatTripDate(trip.start)} to {formatTripDate(trip.end)},{" "}
                {trip.end.slice(0, 4)}
              </p>
              <p className="mt-4 text-zinc-600 leading-relaxed max-w-2xl">
                {trip.blurb}
              </p>
            </div>

            <figure>
              <TripMap
                legs={trip.legs}
                label={`Map of the whole route from ${first.name} to ${last.name}`}
              />
              <figcaption>
                <MapLegend />
                <p className="mt-2 text-xs text-zinc-400">
                  Distances are great circle, so they run a little short of what
                  the plane actually flies.
                </p>
              </figcaption>
            </figure>

            {/* At full-route scale the European hops are a smudge on the right
                edge, so they get their own frame. */}
            <figure className="mt-8">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">
                The European stretch, closer up
              </h3>
              <TripMap
                legs={trip.legs.filter(
                  (l) => EUROPE.includes(l.from) && EUROPE.includes(l.to),
                )}
                showCodes
                padding={26}
                label="Map of the European legs from Madrid to Helsinki"
              />
            </figure>

            <section className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 md:grid-cols-4">
              <Stat
                value={`${formatKm(stats.totalKm)} km`}
                label="Distance"
                sub={`${formatKm(stats.flightKm)} in the air, ${stats.trainKm} by rail, ${formatKm(
                  stats.unbookedKm,
                )} still open`}
              />
              <Stat
                value={String(stats.days)}
                label="Days"
                sub={`${first.name} to ${last.name}`}
              />
              <Stat
                value={String(stats.countries.length)}
                label="Countries"
                sub={stats.countries.join(", ")}
              />
              <Stat
                value={`${stats.flights} + ${stats.trains}`}
                label="Flights and trains"
                sub={`${stats.layovers} airport ${
                  stats.layovers === 1 ? "connection" : "connections"
                }, ${stats.stops} real stops`}
              />
            </section>

            <section className="mt-12">
              <h3 className="font-serif text-2xl font-bold text-zinc-900 mb-6">
                Leg by leg
              </h3>
              <TripTimeline trip={trip} />
            </section>

            <section className="mt-12 rounded-xl border border-zinc-200 bg-zinc-50 p-6">
              <h3 className="font-serif text-lg font-bold text-zinc-900">
                The longest hop
              </h3>
              <p className="mt-2 text-zinc-600 leading-relaxed">
                {place(stats.longest.leg.from).name} to{" "}
                {place(stats.longest.leg.to).name},{" "}
                {stats.longest.km.toLocaleString("en-GB")} km in a single hop.
                That one leg is{" "}
                {Math.round((stats.longest.km / stats.totalKm) * 100)}% of the
                whole trip.
              </p>
              {gaps.length > 0 && (
                <div className="mt-4 border-t border-zinc-200 pt-4 text-sm text-zinc-500">
                  <p>
                    {gaps.length === 1 ? "One gap" : `${gaps.length} gaps`} still
                    to close:
                  </p>
                  <ul className="mt-1.5 space-y-1">
                    {gaps.map((leg, i) => (
                      <li key={i}>
                        {place(leg.from).name} to {place(leg.to).name},{" "}
                        {leg.dateLabel ?? formatTripDate(leg.date)}.
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          </article>
        );
      })}
    </div>
  );
}

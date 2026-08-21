import { PLACES } from "./data";
import { haversineKm, project } from "./projection";
import { addDays } from "@/lib/dates";
import type { Leg, Place, Stay, Trip } from "./types";

export function place(id: string): Place {
  const found = PLACES[id];
  if (!found) throw new Error(`Unknown place: ${id}`);
  return found;
}

export function legKm(leg: Leg): number {
  const a = place(leg.from);
  const b = place(leg.to);
  return haversineKm([a.lon, a.lat], [b.lon, b.lat]);
}

export interface Waypoint {
  place: Place;
  /** Order along the route, starting at 1. */
  index: number;
  arrival?: Leg;
  departure?: Leg;
  /**
   * Somewhere you changed planes rather than somewhere you went: arrived and
   * left again on the same day.
   */
  layover: boolean;
}

/** Every stop in order, collapsing the repeated visits to Madrid into one. */
export function waypointsFor(legs: Leg[]): Waypoint[] {
  const ordered: { id: string; arrival?: Leg; departure?: Leg }[] = [];

  legs.forEach((leg, i) => {
    if (i === 0) ordered.push({ id: leg.from, departure: leg });
    const last = ordered[ordered.length - 1];
    if (last && last.id === leg.from && !last.departure) last.departure = leg;
    ordered.push({ id: leg.to, arrival: leg });
  });

  const seen = new Map<string, Waypoint>();
  const result: Waypoint[] = [];

  for (const stop of ordered) {
    const existing = seen.get(stop.id);
    if (existing) {
      // Madrid is visited twice; keep one dot but remember the later departure.
      existing.departure = stop.departure ?? existing.departure;
      continue;
    }
    const wp: Waypoint = {
      place: place(stop.id),
      index: result.length + 1,
      arrival: stop.arrival,
      departure: stop.departure,
      layover: false,
    };
    seen.set(stop.id, wp);
    result.push(wp);
  }

  // Fill in departures for stops that were only recorded as arrivals.
  for (const wp of result) {
    if (!wp.departure) {
      wp.departure = legs.find((l) => l.from === wp.place.id);
    }
    wp.layover = Boolean(
      wp.arrival && wp.departure && wp.arrival.arriveDate === undefined &&
        wp.arrival.date === wp.departure.date,
    );
  }

  return result;
}

export function waypoints(trip: Trip): Waypoint[] {
  return waypointsFor(trip.legs);
}

export interface TripStats {
  totalKm: number;
  flightKm: number;
  trainKm: number;
  /** Ground you will cover with nothing booked to cover it. */
  unbookedKm: number;
  flights: number;
  trains: number;
  countries: string[];
  stops: number;
  layovers: number;
  days: number;
  longest: { leg: Leg; km: number };
  unbooked: number;
}

export function tripStats(trip: Trip): TripStats {
  const withKm = trip.legs.map((leg) => ({ leg, km: legKm(leg) }));
  const points = waypoints(trip);

  // Everything below counts booked legs only. An unbooked leg still adds to the
  // total distance, because you have to cross that ground either way, but it
  // does not get filed under a mode of transport nobody has chosen yet.
  const booked = withKm.filter((l) => !l.leg.unbooked);
  const sum = (mode: Leg["mode"]) =>
    booked.filter((l) => l.leg.mode === mode).reduce((n, l) => n + l.km, 0);

  const days =
    Math.round(
      (Date.parse(`${trip.end}T00:00:00Z`) - Date.parse(`${trip.start}T00:00:00Z`)) /
        86_400_000,
    ) + 1;

  return {
    totalKm: withKm.reduce((n, l) => n + l.km, 0),
    flightKm: sum("flight"),
    trainKm: sum("train"),
    unbookedKm: withKm
      .filter((l) => l.leg.unbooked)
      .reduce((n, l) => n + l.km, 0),
    flights: trip.legs.filter((l) => l.mode === "flight" && !l.unbooked).length,
    trains: trip.legs.filter((l) => l.mode === "train" && !l.unbooked).length,
    countries: [...new Set(points.map((p) => p.place.country))],
    stops: points.filter((p) => !p.layover).length,
    layovers: points.filter((p) => p.layover).length,
    days,
    longest: withKm.reduce((a, b) => (b.km > a.km ? b : a)),
    unbooked: trip.legs.filter((l) => l.unbooked).length,
  };
}

/**
 * The drawing window: every place on these legs, plus breathing room. A route
 * that runs more north-south than east-west would otherwise produce a portrait
 * map, which reads badly in a wide column, so the window is widened until it is
 * at least `minAspect` across.
 */
export function viewBoxFor(legs: Leg[], padding = 90, minAspect = 1.7) {
  const points = waypointsFor(legs).map((w) => project(w.place.lon, w.place.lat));
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);

  let minX = Math.min(...xs) - padding;
  let maxX = Math.max(...xs) + padding;
  const minY = Math.min(...ys) - padding;
  const maxY = Math.max(...ys) + padding;

  const height = maxY - minY;
  const shortfall = height * minAspect - (maxX - minX);
  if (shortfall > 0) {
    minX -= shortfall / 2;
    maxX += shortfall / 2;
  }

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height,
    toString() {
      return `${minX} ${minY} ${maxX - minX} ${height}`;
    },
  };
}

export function formatKm(km: number): string {
  return km >= 1000 ? `${(km / 1000).toFixed(1)}k` : String(km);
}

export function formatTripDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}

// ── planning gaps ───────────────────────────────────────────────────────────

export interface BedGap {
  placeId: string;
  /** Set when the stretch falls inside an unbooked leg, so the city is a guess. */
  toPlaceId?: string;
  /** First night with no bed. */
  from: string;
  /** The morning you move on. Exclusive. */
  to: string;
  nights: number;
  uncertain: boolean;
}

/** Where you sleep on a given night, or null when you are in the air. */
function locationOnNight(
  legs: Leg[],
  night: string,
): { placeId: string; toPlaceId?: string; uncertain: boolean } | null {
  const past = legs.filter((l) => l.date <= night);
  if (past.length === 0) {
    return { placeId: legs[0].from, uncertain: false };
  }
  const leg = past[past.length - 1];
  // An overnight flight means the night is spent in transit, not in a bed.
  if (leg.arriveDate && leg.date === night) return null;
  return leg.unbooked
    ? { placeId: leg.from, toPlaceId: leg.to, uncertain: true }
    : { placeId: leg.to, uncertain: false };
}

function nightCovered(stays: Stay[], night: string): boolean {
  return stays.some((s) => s.from <= night && night < s.to);
}

export interface NightsSummary {
  total: number;
  booked: number;
  inTransit: number;
  unbooked: number;
  gaps: BedGap[];
}

/**
 * Walks the trip one night at a time and collects every stretch with no
 * accommodation behind it. The last day is excluded: you fly home that morning.
 */
export function nightsSummary(trip: Trip): NightsSummary {
  const gaps: BedGap[] = [];
  let booked = 0;
  let inTransit = 0;
  let total = 0;

  let current: BedGap | null = null;
  const flush = () => {
    if (current) gaps.push(current);
    current = null;
  };

  for (let night = trip.start; night < trip.end; night = addDays(night, 1)) {
    total++;
    const where = locationOnNight(trip.legs, night);

    if (where === null) {
      inTransit++;
      flush();
      continue;
    }
    if (nightCovered(trip.stays, night)) {
      booked++;
      flush();
      continue;
    }

    const sameStretch =
      current &&
      current.placeId === where.placeId &&
      current.toPlaceId === where.toPlaceId;

    if (sameStretch && current) {
      current.nights++;
      current.to = addDays(night, 1);
    } else {
      flush();
      current = {
        placeId: where.placeId,
        toPlaceId: where.toPlaceId,
        from: night,
        to: addDays(night, 1),
        nights: 1,
        uncertain: where.uncertain,
      };
    }
  }
  flush();

  return {
    total,
    booked,
    inTransit,
    unbooked: total - booked - inTransit,
    gaps: gaps.sort((a, b) => b.nights - a.nights),
  };
}

/**
 * Web Mercator, in a fixed 2000-unit-wide world. Both the generated country
 * outlines and the plotted cities go through this, so a point projected in the
 * browser lands exactly where the coastline says it should.
 */
export const MAP_WIDTH = 2000;

/** Mercator blows up at the poles; real coastlines stop well before this. */
const MAX_LAT = 83;

export function project(lon: number, lat: number): [number, number] {
  const clamped = Math.max(-MAX_LAT, Math.min(MAX_LAT, lat));
  const phi = (clamped * Math.PI) / 180;
  const x = ((lon + 180) / 360) * MAP_WIDTH;
  const y =
    (MAP_WIDTH / (2 * Math.PI)) *
    (Math.PI - Math.log(Math.tan(Math.PI / 4 + phi / 2)));
  return [x, y];
}

/**
 * A flight path drawn as a straight line reads as a mistake, because nobody
 * flies straight on a Mercator map. This bows each leg toward the pole by an
 * amount proportional to its length, which is what a great circle looks like
 * once projected, without the cost of actually interpolating one.
 */
export function arcPath(
  from: [number, number],
  to: [number, number],
  bend = 0.18,
): string {
  const [x1, y1] = from;
  const [x2, y2] = to;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.hypot(dx, dy);

  // Perpendicular offset, always toward the top of the map (northern routes).
  const nx = -dy / (dist || 1);
  const ny = dx / (dist || 1);
  const lift = dist * bend * (x2 >= x1 ? 1 : -1);

  return `M ${x1.toFixed(1)} ${y1.toFixed(1)} Q ${(mx + nx * lift).toFixed(1)} ${(
    my +
    ny * lift
  ).toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
}

/** Great-circle distance in kilometres, for the trip totals. */
export function haversineKm(
  [lon1, lat1]: [number, number],
  [lon2, lat2]: [number, number],
): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(a)));
}

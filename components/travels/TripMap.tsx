import { arcPath, project } from "@/lib/travels/projection";
import { place, viewBoxFor, waypointsFor } from "@/lib/travels/summary";
import { WORLD_SHAPES } from "@/lib/travels/world-paths";
import type { Leg, Place } from "@/lib/travels/types";

/**
 * The whole world lives in world-paths.ts, but only the rings that touch the
 * drawing window are serialized into the page, which keeps a 122 KB dataset
 * from becoming a 122 KB payload.
 */
function visibleShapes(box: { x: number; y: number; width: number; height: number }) {
  const right = box.x + box.width;
  const bottom = box.y + box.height;
  return WORLD_SHAPES.filter(({ bbox: [minX, minY, maxX, maxY] }) => {
    return maxX >= box.x && minX <= right && maxY >= box.y && minY <= bottom;
  });
}

/** Where the label sits relative to its dot, and how the text aligns there. */
function labelPosition(
  p: Place,
  x: number,
  y: number,
  r: number,
  gap: number,
  fontSize: number,
) {
  switch (p.anchor ?? "e") {
    case "w":
      return { x: x - r - gap, y: y + fontSize * 0.35, anchor: "end" as const, stacked: false };
    case "n":
      return { x, y: y - r - gap, anchor: "middle" as const, stacked: true };
    case "s":
      return { x, y: y + r + gap + fontSize * 0.8, anchor: "middle" as const, stacked: false };
    default:
      return { x: x + r + gap, y: y + fontSize * 0.35, anchor: "start" as const, stacked: false };
  }
}

export default function TripMap({
  legs,
  showCodes = false,
  padding = 90,
  label,
}: {
  legs: Leg[];
  /** The airport code line under each name. Useful zoomed in, noise zoomed out. */
  showCodes?: boolean;
  padding?: number;
  label: string;
}) {
  const box = viewBoxFor(legs, padding);
  const shapes = visibleShapes(box);
  const stops = waypointsFor(legs);

  // Everything is sized off the window width so a zoomed-in map does not end up
  // with giant text and a zoomed-out one with unreadable text.
  const scale = box.width / 1000;
  const nameSize = 13 * scale;
  const codeSize = 9.5 * scale;

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-[#fbfbfc]">
      <svg
        viewBox={box.toString()}
        className="block h-auto w-full"
        role="img"
        aria-label={label}
      >
        <defs>
          <linearGradient id={`sea-${label.replace(/\W/g, "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fbfbfc" />
            <stop offset="100%" stopColor="#f4f4f5" />
          </linearGradient>
        </defs>

        <rect
          x={box.x}
          y={box.y}
          width={box.width}
          height={box.height}
          fill={`url(#sea-${label.replace(/\W/g, "")})`}
        />

        <g fill="#e6e6ea" stroke="#cfcfd6" strokeWidth={0.7 * scale}>
          {shapes.map((s, i) => (
            <path key={i} d={s.d} />
          ))}
        </g>

        <g fill="none" strokeLinecap="round">
          {legs.map((leg, i) => {
            const from = place(leg.from);
            const to = place(leg.to);
            const d = arcPath(
              project(from.lon, from.lat),
              project(to.lon, to.lat),
              leg.mode === "train" ? 0.06 : 0.16,
            );

            if (leg.unbooked) {
              return (
                <path
                  key={i}
                  d={d}
                  stroke="#a1a1aa"
                  strokeWidth={1.6 * scale}
                  strokeDasharray={`${2 * scale} ${4 * scale}`}
                />
              );
            }

            return (
              <g key={i}>
                {/* A pale casing keeps the line readable where legs overlap. */}
                <path d={d} stroke="#fbfbfc" strokeWidth={5 * scale} />
                <path
                  d={d}
                  stroke="#18181b"
                  strokeWidth={leg.mode === "train" ? 1.6 * scale : 2 * scale}
                  strokeDasharray={
                    leg.mode === "train" ? `${5 * scale} ${3 * scale}` : undefined
                  }
                />
              </g>
            );
          })}
        </g>

        <g>
          {stops.map((stop) => {
            const [x, y] = project(stop.place.lon, stop.place.lat);
            const r = (stop.layover ? 3.2 : 5) * scale;
            const pos = labelPosition(stop.place, x, y, r, 6 * scale, nameSize);
            const sub = [stop.place.code, stop.layover ? "connection" : null]
              .filter(Boolean)
              .join(" · ");

            return (
              <g key={stop.place.id}>
                <circle
                  cx={x}
                  cy={y}
                  r={r}
                  fill={stop.layover ? "#fbfbfc" : "#18181b"}
                  stroke="#18181b"
                  strokeWidth={1.6 * scale}
                />
                {/* Halo so names stay legible where they cross a coastline. */}
                <text
                  x={pos.x}
                  y={pos.stacked && showCodes ? pos.y - codeSize * 1.1 : pos.y}
                  textAnchor={pos.anchor}
                  fontSize={nameSize}
                  fontWeight={stop.layover ? 500 : 700}
                  fill={stop.layover ? "#71717a" : "#18181b"}
                  stroke="#fbfbfc"
                  strokeWidth={3 * scale}
                  paintOrder="stroke"
                >
                  {stop.place.name}
                </text>
                {showCodes && sub && (
                  <text
                    x={pos.x}
                    y={pos.stacked ? pos.y : pos.y + codeSize * 1.25}
                    textAnchor={pos.anchor}
                    fontSize={codeSize}
                    fill="#a1a1aa"
                    stroke="#fbfbfc"
                    strokeWidth={2.5 * scale}
                    paintOrder="stroke"
                  >
                    {sub}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}

export function MapLegend({ showUnbooked = true }: { showUnbooked?: boolean }) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-zinc-500">
      <span className="flex items-center gap-2">
        <svg width="26" height="8" aria-hidden="true">
          <line x1="0" y1="4" x2="26" y2="4" stroke="#18181b" strokeWidth="2" />
        </svg>
        Flight
      </span>
      <span className="flex items-center gap-2">
        <svg width="26" height="8" aria-hidden="true">
          <line
            x1="0"
            y1="4"
            x2="26"
            y2="4"
            stroke="#18181b"
            strokeWidth="1.6"
            strokeDasharray="5 3"
          />
        </svg>
        Train
      </span>
      {showUnbooked && (
        <span className="flex items-center gap-2">
          <svg width="26" height="8" aria-hidden="true">
            <line
              x1="0"
              y1="4"
              x2="26"
              y2="4"
              stroke="#a1a1aa"
              strokeWidth="1.6"
              strokeDasharray="2 4"
            />
          </svg>
          Not booked yet
        </span>
      )}
      <span className="flex items-center gap-2">
        <svg width="10" height="10" aria-hidden="true">
          <circle cx="5" cy="5" r="3.2" fill="#fff" stroke="#18181b" strokeWidth="1.6" />
        </svg>
        Connection only
      </span>
    </div>
  );
}

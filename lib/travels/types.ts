export interface Place {
  id: string;
  /** What to print on the map. */
  name: string;
  country: string;
  /** IATA code for airports, left out for train stations. */
  code?: string;
  lon: number;
  lat: number;
  /**
   * Which side of the dot the label sits on. Hand-set, because nine cities on
   * one map is few enough to place by eye and too few to justify a collision
   * solver.
   */
  anchor?: "n" | "s" | "e" | "w";
}

export type LegMode = "flight" | "train";

export interface Leg {
  from: string;
  to: string;
  mode: LegMode;
  /** ISO date of departure. */
  date: string;
  depart?: string;
  arrive?: string;
  /** Set only when the leg lands on a later date than it left. */
  arriveDate?: string;
  carrier?: string;
  number?: string;
  /** A leg the itinerary needs but no booking covers yet. */
  unbooked?: boolean;
  /** The booking showed no date; this one is inferred from the legs around it. */
  dateEstimated?: boolean;
  note?: string;
}

export interface Stay {
  placeId: string;
  name: string;
  from: string;
  to: string;
  nights: number;
}

export interface Trip {
  slug: string;
  title: string;
  blurb: string;
  start: string;
  end: string;
  legs: Leg[];
  stays: Stay[];
}

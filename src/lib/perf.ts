/**
 * Lightweight performance monitoring utilities using the Web Performance API.
 */

/** Mark the start of a performance measurement. */
export function markStart(name: string) {
  if (typeof performance !== "undefined") {
    performance.mark(`${name}:start`);
  }
}

/** Mark the end and return the duration in milliseconds. */
export function markEnd(name: string): number | null {
  if (typeof performance === "undefined") return null;
  performance.mark(`${name}:end`);
  const measure = performance.measure(name, `${name}:start`, `${name}:end`);
  return measure.duration;
}

/** Get all entries for a given name. */
export function getMeasure(name: string): PerformanceMeasure | undefined {
  if (typeof performance === "undefined") return undefined;
  return performance.getEntriesByName(name, "measure")[0] as PerformanceMeasure;
}

/** Clear all marks and measures. */
export function clearPerf(name?: string) {
  if (typeof performance === "undefined") return;
  if (name) {
    performance.clearMarks(`${name}:start`);
    performance.clearMarks(`${name}:end`);
    performance.clearMeasures(name);
  } else {
    performance.clearMarks();
    performance.clearMeasures();
  }
}

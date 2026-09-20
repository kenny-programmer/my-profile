"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";

interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface ApiResponse {
  total?: {
    lastYear?: number;
    [year: string]: number | undefined;
  };
  contributions?: ContributionDay[];
}

interface GitHubContributionsProps {
  username?: string;
  githubUrl?: string;
}

interface WeekData {
  weekIndex: number;
  startDate: string;
  endDate: string;
  totalCount: number;
  cumulativeCount: number;
  days: ContributionDay[];
}

type GraphMode = "momentum" | "cumulative";

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  try {
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });
  } catch {
    return dateStr;
  }
}

function formatMonth(dateStr: string) {
  if (!dateStr) return "";
  try {
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.toLocaleDateString("en-US", {
      month: "short",
      timeZone: "UTC",
    });
  } catch {
    return "";
  }
}

// Generate smooth cubic bezier spline path
function generateSmoothPath(
  points: { x: number; y: number }[],
  closeBottom = false,
  height = 140
): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? i : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

    const cp1x = p1.x + (p2.x - p0.x) / 5;
    const cp1y = p1.y + (p2.y - p0.y) / 5;
    const cp2x = p2.x - (p3.x - p1.x) / 5;
    const cp2y = p2.y - (p3.y - p1.y) / 5;

    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }

  if (closeBottom) {
    const last = points[points.length - 1];
    const first = points[0];
    d += ` L ${last.x.toFixed(1)} ${height} L ${first.x.toFixed(1)} ${height} Z`;
  }

  return d;
}

export function GitHubContributions({
  username = "kenny-programmer",
  githubUrl = "https://github.com/kenny-programmer",
}: GitHubContributionsProps) {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [graphMode, setGraphMode] = useState<GraphMode>("momentum");
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchContributions() {
      try {
        const res = await fetch(
          `https://github-contributions-api.jogruber.de/v4/${username}?y=last`
        );
        if (!res.ok) throw new Error("Failed to fetch");
        const json: ApiResponse = await res.json();
        if (isMounted) {
          setData(json);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching GitHub contributions:", err);
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchContributions();
    return () => {
      isMounted = false;
    };
  }, [username]);

  // Aggregate into weekly curve data & calculate stats
  const { weeks, stats, points, areaPath, linePath, monthMarkers, peakMarkers } =
    useMemo(() => {
      const rawDays = data?.contributions || [];

      if (rawDays.length === 0) {
        const dummyPoints = Array.from({ length: 52 }, (_, i) => ({
          x: (i / 51) * 700,
          y: 90 + Math.sin(i / 3.5) * 20,
        }));
        return {
          weeks: [],
          stats: { total: 0, currentStreak: 0, maxStreak: 0, peakDayCount: 0 },
          points: dummyPoints,
          areaPath: generateSmoothPath(dummyPoints, true, 140),
          linePath: generateSmoothPath(dummyPoints, false, 140),
          monthMarkers: [],
          peakMarkers: [],
        };
      }

      // Streaks calculation
      let maxStreak = 0;
      let currentStreak = 0;
      let tempStreak = 0;
      let peakCount = 0;

      for (let i = 0; i < rawDays.length; i++) {
        const count = rawDays[i].count;
        if (count > peakCount) peakCount = count;
        if (count > 0) {
          tempStreak++;
          if (tempStreak > maxStreak) maxStreak = tempStreak;
        } else {
          tempStreak = 0;
        }
      }

      for (let i = rawDays.length - 1; i >= 0; i--) {
        if (rawDays[i].count > 0) currentStreak++;
        else break;
      }

      // Group into weeks
      const computedWeeks: WeekData[] = [];
      let currentChunk: ContributionDay[] = [];
      let runningTotal = 0;

      for (let i = 0; i < rawDays.length; i++) {
        currentChunk.push(rawDays[i]);
        if (currentChunk.length === 7 || i === rawDays.length - 1) {
          const weekCount = currentChunk.reduce((acc, d) => acc + d.count, 0);
          runningTotal += weekCount;
          computedWeeks.push({
            weekIndex: computedWeeks.length,
            startDate: currentChunk[0].date,
            endDate: currentChunk[currentChunk.length - 1].date,
            totalCount: weekCount,
            cumulativeCount: runningTotal,
            days: currentChunk,
          });
          currentChunk = [];
        }
      }

      const recentWeeks = computedWeeks.slice(-52);
      const maxWeekly = Math.max(...recentWeeks.map((w) => w.totalCount), 15);
      const totalCumulative = recentWeeks[recentWeeks.length - 1]?.cumulativeCount || 1;

      const svgWidth = 700;
      const svgHeight = 140;
      const paddingY = 16;
      const usableHeight = svgHeight - paddingY * 2;

      // Calculate points with log-damping for balanced year-round visibility
      const wavePoints = recentWeeks.map((w, i) => {
        const x = (i / (recentWeeks.length - 1)) * svgWidth;
        let normalizedHeight = 0;

        if (graphMode === "cumulative") {
          // Smooth progressive cumulative curve
          normalizedHeight = Math.min(w.cumulativeCount / totalCumulative, 1);
        } else {
          // Logarithmic damping for momentum wave so all past active weeks create distinct crests
          if (w.totalCount > 0) {
            const logVal =
              Math.log1p(w.totalCount * 2.5) / Math.log1p(maxWeekly * 2.5);
            normalizedHeight = 0.18 + 0.8 * logVal;
          } else {
            normalizedHeight = 0.05; // graceful baseline
          }
        }

        const y = svgHeight - paddingY - normalizedHeight * usableHeight;
        return { x, y };
      });

      const area = generateSmoothPath(wavePoints, true, svgHeight);
      const line = generateSmoothPath(wavePoints, false, svgHeight);

      // Month markers
      const months: { label: string; x: number }[] = [];
      let lastMonth = "";
      recentWeeks.forEach((w, i) => {
        const m = formatMonth(w.startDate);
        if (m && m !== lastMonth) {
          lastMonth = m;
          months.push({
            label: m,
            x: (i / (recentWeeks.length - 1)) * svgWidth,
          });
        }
      });

      // Peak milestone points along the timeline (weeks with notable commits)
      const peaks = recentWeeks
        .map((w, i) => ({ week: w, index: i, point: wavePoints[i] }))
        .filter((item) => item.week.totalCount >= 10);

      const total =
        data?.total?.lastYear ?? rawDays.reduce((acc, d) => acc + d.count, 0);

      return {
        weeks: recentWeeks,
        stats: {
          total,
          currentStreak,
          maxStreak,
          peakDayCount: peakCount,
        },
        points: wavePoints,
        areaPath: area,
        linePath: line,
        monthMarkers: months,
        peakMarkers: peaks,
      };
    }, [data, graphMode]);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || weeks.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const relativeX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = relativeX / rect.width;
    const index = Math.min(
      Math.max(0, Math.round(percentage * (weeks.length - 1))),
      weeks.length - 1
    );
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const activeWeek = hoveredIndex !== null ? weeks[hoveredIndex] : null;
  const activePoint = hoveredIndex !== null ? points[hoveredIndex] : null;

  return (
    <section id="github" className="flex min-h-0 flex-col gap-y-3">
      {/* Header */}
      <div className="flex items-baseline justify-between">
        <h2 className="text-xl font-bold">GitHub Contributions</h2>
        <Link
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
        >
          @{username} ↗
        </Link>
      </div>

      {/* Stats Bento Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        <div className="rounded-xl border border-border/80 bg-card/60 p-3.5 backdrop-blur-sm shadow-sm flex flex-col justify-between">
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            Yearly Total
          </span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tracking-tight text-foreground">
              {loading ? "--" : stats.total.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground font-mono">commits</span>
          </div>
        </div>

        <div className="rounded-xl border border-border/80 bg-card/60 p-3.5 backdrop-blur-sm shadow-sm flex flex-col justify-between">
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground flex items-center justify-between">
            <span>Streak</span>
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-500 font-semibold">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active
            </span>
          </span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tracking-tight text-foreground">
              {loading ? "--" : `${stats.currentStreak}d`}
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              (max {stats.maxStreak}d)
            </span>
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 rounded-xl border border-border/80 bg-card/60 p-3.5 backdrop-blur-sm shadow-sm flex flex-col justify-between">
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            Peak Velocity
          </span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tracking-tight text-foreground">
              {loading ? "--" : stats.peakDayCount}
            </span>
            <span className="text-xs text-muted-foreground font-mono">commits/day</span>
          </div>
        </div>
      </div>

      {/* Smooth Monochrome Activity Wave Card */}
      <div className="relative rounded-xl border border-border/80 bg-card/60 p-4 sm:p-5 backdrop-blur-md shadow-sm transition-all duration-300 hover:border-foreground/30 overflow-hidden">
        {/* Controls & Active Scrub Readout Banner */}
        <div className="mb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-xs">
          <div className="flex items-center gap-1.5 border border-border/80 rounded-lg p-0.5 bg-background/50 w-fit">
            <button
              type="button"
              onClick={() => setGraphMode("momentum")}
              className={`px-2.5 py-1 rounded-md text-[11px] transition-all ${
                graphMode === "momentum"
                  ? "bg-foreground text-background font-medium shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Activity Wave
            </button>
            <button
              type="button"
              onClick={() => setGraphMode("cumulative")}
              className={`px-2.5 py-1 rounded-md text-[11px] transition-all ${
                graphMode === "cumulative"
                  ? "bg-foreground text-background font-medium shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Cumulative Growth
            </button>
          </div>

          <div>
            {activeWeek ? (
              <span className="text-foreground animate-in fade-in duration-150">
                <span className="font-bold text-primary">
                  {graphMode === "cumulative"
                    ? `${activeWeek.cumulativeCount} total commits`
                    : `${activeWeek.totalCount} commits`}
                </span>{" "}
                <span className="text-muted-foreground">
                  ({formatDate(activeWeek.startDate)} - {formatDate(activeWeek.endDate)})
                </span>
              </span>
            ) : (
              <span className="text-muted-foreground text-[11px]">
                Hover to inspect activity across the year
              </span>
            )}
          </div>
        </div>

        {/* Waveform SVG Graph */}
        <div className="relative w-full mt-2">
          <svg
            ref={svgRef}
            viewBox="0 0 700 140"
            className="h-28 sm:h-32 w-full text-foreground cursor-crosshair overflow-visible"
            preserveAspectRatio="none"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            aria-label="GitHub annual activity waveform"
          >
            <defs>
              <linearGradient id="waveFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
                <stop offset="70%" stopColor="currentColor" stopOpacity="0.05" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Subtle Horizontal Grid Guides */}
            <line
              x1="0"
              y1="35"
              x2="700"
              y2="35"
              stroke="currentColor"
              strokeOpacity="0.06"
              strokeDasharray="3 3"
            />
            <line
              x1="0"
              y1="75"
              x2="700"
              y2="75"
              stroke="currentColor"
              strokeOpacity="0.06"
              strokeDasharray="3 3"
            />
            <line
              x1="0"
              y1="115"
              x2="700"
              y2="115"
              stroke="currentColor"
              strokeOpacity="0.06"
              strokeDasharray="3 3"
            />

            {/* Area Fill */}
            <path
              d={areaPath}
              fill="url(#waveFill)"
              className={`transition-all duration-300 ${
                loading ? "animate-pulse opacity-40" : "opacity-100"
              }`}
            />

            {/* Main Crisp Line */}
            <path
              d={linePath}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-all duration-300 ${
                loading ? "animate-pulse opacity-40" : "opacity-100"
              }`}
            />

            {/* Milestone Highlights for active weeks */}
            {graphMode === "momentum" &&
              peakMarkers.map((peak) => (
                <circle
                  key={peak.index}
                  cx={peak.point.x}
                  cy={peak.point.y}
                  r="2.5"
                  className="fill-foreground opacity-60 pointer-events-none"
                />
              ))}

            {/* Interactive Vertical Cursor & Dot on Hover */}
            {activePoint && (
              <g className="transition-all duration-75">
                <line
                  x1={activePoint.x}
                  y1={0}
                  x2={activePoint.x}
                  y2={140}
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeOpacity="0.35"
                  strokeDasharray="2 2"
                />
                <circle
                  cx={activePoint.x}
                  cy={activePoint.y}
                  r="4.5"
                  className="fill-background stroke-foreground"
                  strokeWidth="2.5"
                />
              </g>
            )}
          </svg>

          {/* Month Axis Labels */}
          <div className="mt-2 flex justify-between font-mono text-[10px] text-muted-foreground px-1 select-none">
            {monthMarkers.slice(0, 10).map((m, idx) => (
              <span key={`${m.label}-${idx}`}>{m.label}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

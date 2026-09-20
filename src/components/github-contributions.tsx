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

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  try {
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });
  } catch {
    return dateStr;
  }
}

function getMonthName(dateStr: string) {
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

const CELL_SIZE = 10;
const CELL_GAP = 3;
const OFFSET_X = 24;
const OFFSET_Y = 18;

export function GitHubContributions({
  username = "kenny-programmer",
  githubUrl = "https://github.com/kenny-programmer",
}: GitHubContributionsProps) {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredDay, setHoveredDay] = useState<ContributionDay | null>(null);
  const [hoveredCoords, setHoveredCoords] = useState<{ x: number; y: number } | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchContributions(isBackground = false) {
      try {
        if (!isBackground) setLoading(true);
        // Primary: fetch from our live real-time GitHub scraper route
        const res = await fetch(
          `/api/github-contributions?username=${username}&_t=${Date.now()}`,
          { cache: "no-store" }
        );

        if (!res.ok) throw new Error("API route failed");
        const json: ApiResponse = await res.json();
        if (isMounted && json.contributions) {
          setData(json);
          setLoading(false);
        }
      } catch (err) {
        // Fallback directly to jogruber API if local route had an issue
        try {
          const fallbackRes = await fetch(
            `https://github-contributions-api.jogruber.de/v4/${username}?y=last&_t=${Date.now()}`,
            { cache: "no-store" }
          );
          if (fallbackRes.ok) {
            const fallbackJson: ApiResponse = await fallbackRes.json();
            if (isMounted) {
              setData(fallbackJson);
            }
          }
        } catch (fallbackErr) {
          console.error("Error fetching GitHub contributions:", fallbackErr);
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      }
    }

    fetchContributions();

    // Auto-update when user refocuses the tab / window
    const handleFocus = () => {
      fetchContributions(true);
    };
    window.addEventListener("focus", handleFocus);

    // Periodic auto-update every 2 minutes while page is open
    const interval = setInterval(() => {
      fetchContributions(true);
    }, 120000);

    return () => {
      isMounted = false;
      window.removeEventListener("focus", handleFocus);
      clearInterval(interval);
    };
  }, [username]);

  // Compute Grid Matrix & Metrics
  const { weeks, monthHeaders, stats } = useMemo(() => {
    const rawDays = data?.contributions || [];

    if (rawDays.length === 0) {
      return {
        weeks: [],
        monthHeaders: [],
        stats: {
          total: 0,
          currentStreak: 0,
          maxStreak: 0,
          activeDays: 0,
        },
      };
    }

    // Streaks and Stats
    let maxStreak = 0;
    let currentStreak = 0;
    let tempStreak = 0;
    let activeDays = 0;

    for (let i = 0; i < rawDays.length; i++) {
      const count = rawDays[i].count;
      if (count > 0) {
        activeDays++;
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

    // Organize into standard 7-day columns (Sunday = 0 to Saturday = 6)
    const computedWeeks: (ContributionDay | null)[][] = [];
    let currentWeek: (ContributionDay | null)[] = [];

    // Align the starting day of the first week
    const firstDayDate = new Date(rawDays[0].date + "T00:00:00Z");
    const startDayOfWeek = firstDayDate.getUTCDay();

    for (let i = 0; i < startDayOfWeek; i++) {
      currentWeek.push(null);
    }

    for (const day of rawDays) {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        computedWeeks.push(currentWeek);
        currentWeek = [];
      }
    }

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      computedWeeks.push(currentWeek);
    }

    // Month headers positioning with minimum column spacing to prevent overlap
    const months: { label: string; colIndex: number }[] = [];
    let lastMonth = "";
    let lastColIdx = -10;

    computedWeeks.forEach((week, colIdx) => {
      const firstValidDay = week.find((d) => d !== null);
      if (firstValidDay) {
        const m = getMonthName(firstValidDay.date);
        if (m && m !== lastMonth) {
          if (colIdx - lastColIdx >= 3 || lastMonth === "") {
            lastMonth = m;
            lastColIdx = colIdx;
            months.push({ label: m, colIndex: colIdx });
          }
        }
      }
    });

    const total =
      data?.total?.lastYear ?? rawDays.reduce((acc, d) => acc + d.count, 0);

    return {
      weeks: computedWeeks,
      monthHeaders: months,
      stats: {
        total,
        currentStreak,
        maxStreak,
        activeDays,
      },
    };
  }, [data]);

  // Monochrome level colors
  const getCellColor = (level: number) => {
    switch (level) {
      case 1:
        return "fill-zinc-400 dark:fill-zinc-700";
      case 2:
        return "fill-zinc-600 dark:fill-zinc-500";
      case 3:
        return "fill-zinc-800 dark:fill-zinc-300";
      case 4:
        return "fill-black dark:fill-white";
      default:
        return "fill-zinc-100 dark:fill-zinc-900/80 stroke-zinc-200/50 dark:stroke-zinc-800/60";
    }
  };

  const gridWidth = weeks.length * (CELL_SIZE + CELL_GAP);
  const gridHeight = 7 * (CELL_SIZE + CELL_GAP);
  const svgTotalWidth = gridWidth + OFFSET_X + 4;
  const svgTotalHeight = gridHeight + OFFSET_Y + 4;

  // Zero-flicker mouse tracking across SVG coordinates
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || weeks.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = svgTotalWidth / rect.width;
    const scaleY = svgTotalHeight / rect.height;

    const svgX = (e.clientX - rect.left) * scaleX;
    const svgY = (e.clientY - rect.top) * scaleY;

    const col = Math.floor((svgX - OFFSET_X) / (CELL_SIZE + CELL_GAP));
    const row = Math.floor((svgY - OFFSET_Y) / (CELL_SIZE + CELL_GAP));

    if (col >= 0 && col < weeks.length && row >= 0 && row < 7) {
      const day = weeks[col][row];
      if (day) {
        setHoveredDay(day);
        setHoveredCoords({
          x: OFFSET_X + col * (CELL_SIZE + CELL_GAP),
          y: OFFSET_Y + row * (CELL_SIZE + CELL_GAP),
        });
        return;
      }
    }
    setHoveredDay(null);
    setHoveredCoords(null);
  };

  const handleMouseLeave = () => {
    setHoveredDay(null);
    setHoveredCoords(null);
  };

  return (
    <section id="github" className="flex min-h-0 flex-col gap-y-3">
      {/* Section Header */}
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
            <span className="text-xs text-muted-foreground font-mono">
              commits
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-border/80 bg-card/60 p-3.5 backdrop-blur-sm shadow-sm flex flex-col justify-between">
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground flex items-center justify-between">
            <span>Streak</span>
            {stats.currentStreak > 0 && (
              <span className="inline-flex items-center gap-1 text-[10px] text-zinc-900 dark:text-zinc-100 font-semibold">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100 animate-pulse" />
                Active
              </span>
            )}
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
            Active Days
          </span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tracking-tight text-foreground">
              {loading ? "--" : stats.activeDays}
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              days / year
            </span>
          </div>
        </div>
      </div>

      {/* Main Monochrome Heatmap Card */}
      <div className="relative rounded-xl border border-border/80 bg-card/60 p-4 sm:p-5 backdrop-blur-md shadow-sm transition-all duration-300 hover:border-foreground/30">
        {/* Top Info Readout */}
        <div className="mb-3 flex items-center justify-between font-mono text-xs min-h-[22px]">
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
            Activity Matrix
          </span>
          <div>
            {hoveredDay ? (
              <span className="text-foreground animate-in fade-in duration-100 flex items-center gap-1.5">
                <span className="font-bold text-foreground">
                  {hoveredDay.count}{" "}
                  {hoveredDay.count === 1 ? "contribution" : "contributions"}
                </span>
                <span className="text-muted-foreground">
                  on {formatDate(hoveredDay.date)}
                </span>
              </span>
            ) : (
              <span className="text-muted-foreground text-[11px]">
                Hover any day to inspect contributions
              </span>
            )}
          </div>
        </div>

        {/* Responsive Heatmap Matrix SVG */}
        <div className="w-full pb-1 pt-1">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${svgTotalWidth} ${svgTotalHeight}`}
            className="w-full h-auto select-none cursor-crosshair"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {/* Month Headers */}
            <g className="text-[9px] font-mono fill-muted-foreground pointer-events-none">
              {monthHeaders.map((m, i) => (
                <text
                  key={`${m.label}-${i}`}
                  x={OFFSET_X + m.colIndex * (CELL_SIZE + CELL_GAP)}
                  y="10"
                >
                  {m.label}
                </text>
              ))}
            </g>

            {/* Day of Week Axis */}
            <g className="text-[8px] font-mono fill-muted-foreground pointer-events-none">
              <text x="2" y={OFFSET_Y + 1 * (CELL_SIZE + CELL_GAP) + 8}>
                Mon
              </text>
              <text x="2" y={OFFSET_Y + 3 * (CELL_SIZE + CELL_GAP) + 8}>
                Wed
              </text>
              <text x="2" y={OFFSET_Y + 5 * (CELL_SIZE + CELL_GAP) + 8}>
                Fri
              </text>
            </g>

            {/* Contribution Cells */}
            <g transform={`translate(${OFFSET_X}, ${OFFSET_Y})`}>
              {weeks.map((week, colIdx) => (
                <g
                  key={colIdx}
                  transform={`translate(${colIdx * (CELL_SIZE + CELL_GAP)}, 0)`}
                >
                  {week.map((day, rowIdx) => {
                    if (!day) return null;
                    return (
                      <rect
                        key={day.date}
                        y={rowIdx * (CELL_SIZE + CELL_GAP)}
                        width={CELL_SIZE}
                        height={CELL_SIZE}
                        rx={2}
                        ry={2}
                        className={`transition-colors duration-150 ${getCellColor(
                          day.level
                        )}`}
                      />
                    );
                  })}
                </g>
              ))}
            </g>

            {/* Smooth Highlight Overlay for Hovered Cell */}
            {hoveredCoords && (
              <rect
                x={hoveredCoords.x - 1}
                y={hoveredCoords.y - 1}
                width={CELL_SIZE + 2}
                height={CELL_SIZE + 2}
                rx={3}
                ry={3}
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className="text-foreground pointer-events-none transition-all duration-75"
              />
            )}
          </svg>
        </div>

        {/* Footer: Monochrome Level Legend */}
        <div className="mt-3 pt-2.5 border-t border-border/50 flex items-center justify-between font-mono text-[10px] text-muted-foreground">
          <span>{loading ? "Syncing data..." : "Last 12 months"}</span>
          <div className="flex items-center gap-1.5">
            <span>Less</span>
            <span className="inline-block w-2.5 h-2.5 rounded-[2px] bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800" />
            <span className="inline-block w-2.5 h-2.5 rounded-[2px] bg-zinc-400 dark:bg-zinc-700" />
            <span className="inline-block w-2.5 h-2.5 rounded-[2px] bg-zinc-600 dark:bg-zinc-500" />
            <span className="inline-block w-2.5 h-2.5 rounded-[2px] bg-zinc-800 dark:bg-zinc-300" />
            <span className="inline-block w-2.5 h-2.5 rounded-[2px] bg-black dark:bg-white" />
            <span>More</span>
          </div>
        </div>
      </div>
    </section>
  );
}

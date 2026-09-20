import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username") || "kenny-programmer";

  try {
    // 1. Attempt live scrape directly from GitHub for real-time data
    const githubRes = await fetch(
      `https://github.com/users/${username}/contributions`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml",
        },
        cache: "no-store",
      }
    );

    if (githubRes.ok) {
      const html = await githubRes.text();

      // Extract total contributions in the last year
      const totalMatch = html.match(
        /([\d,]+)\s+contributions\s+in the last year/i
      );
      const total = totalMatch
        ? parseInt(totalMatch[1].replace(/,/g, ""), 10)
        : 0;

      // Extract each contribution day from the calendar table
      const regex =
        /<td[^>]*data-date="([\d-]+)"[^>]*data-level="(\d+)"[^>]*>[\s\S]*?<tool-tip[^>]*>([^<]+)<\/tool-tip>/g;
      const contributions: ContributionDay[] = [];
      let match;

      while ((match = regex.exec(html)) !== null) {
        const date = match[1];
        const level = Math.min(
          Math.max(parseInt(match[2], 10), 0),
          4
        ) as 0 | 1 | 2 | 3 | 4;
        const text = match[3].trim();
        const countMatch = text.match(/^(\d+)/);
        const count = countMatch ? parseInt(countMatch[1], 10) : 0;

        contributions.push({ date, level, count });
      }

      if (contributions.length > 0) {
        // Sort chronologically
        contributions.sort((a, b) => a.date.localeCompare(b.date));

        return NextResponse.json(
          {
            total: { lastYear: total },
            contributions,
          },
          {
            headers: {
              "Cache-Control":
                "public, s-maxage=60, stale-while-revalidate=120",
            },
          }
        );
      }
    }

    // 2. Fallback to jogruber API if GitHub HTML scraping fails
    const fallbackRes = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
      { cache: "no-store" }
    );

    if (fallbackRes.ok) {
      const fallbackData = await fallbackRes.json();
      return NextResponse.json(fallbackData, {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      });
    }

    return NextResponse.json(
      { error: "Failed to fetch contributions" },
      { status: 500 }
    );
  } catch (error) {
    console.error("Error fetching contributions in API route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

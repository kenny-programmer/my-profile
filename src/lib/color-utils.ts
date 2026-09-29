/**
 * WCAG-compliant color contrast utilities.
 */

function toLinear(c: number): number {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

function relativeLuminance(r: number, g: number, b: number): number {
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/**
 * Calculate contrast ratio between two RGB colors.
 * Returns a value between 1 and 21.
 */
export function contrastRatio(
  [r1, g1, b1]: [number, number, number],
  [r2, g2, b2]: [number, number, number]
): number {
  const l1 = relativeLuminance(r1, g1, b1);
  const l2 = relativeLuminance(r2, g2, b2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/** Check if contrast meets WCAG AA (4.5:1 for normal text). */
export function meetsWCAG_AA(
  fg: [number, number, number],
  bg: [number, number, number]
): boolean {
  return contrastRatio(fg, bg) >= 4.5;
}

/** Check if contrast meets WCAG AAA (7:1 for normal text). */
export function meetsWCAG_AAA(
  fg: [number, number, number],
  bg: [number, number, number]
): boolean {
  return contrastRatio(fg, bg) >= 7.0;
}

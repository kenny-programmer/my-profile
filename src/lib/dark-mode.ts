/**
 * Dark mode utilities for smooth theme transitions.
 */

/** Apply a no-transition class to prevent flash on theme switch. */
export function disableTransitionsTemporarily() {
  const style = document.createElement("style");
  style.textContent = "*, *::before, *::after { transition: none !important; }";
  document.head.appendChild(style);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.head.removeChild(style);
    });
  });
}

/** Get the effective color scheme from the document. */
export function getColorScheme(): "light" | "dark" {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

/** Toggle dark mode on the document element. */
export function toggleDarkMode() {
  disableTransitionsTemporarily();
  document.documentElement.classList.toggle("dark");
}

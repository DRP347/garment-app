/**
 * Cleans up a database image path to make it a valid URL for the next/image component.
 * @param {string | undefined} path The image path from the database.
 * @returns {string} A safe, web-compatible URL.
 */
export function normalizeImagePath(path?: string) {
  if (!path) return "/placeholder.png";
  const cleaned = path.replace(/\\/g, "/").replace(/"/g, "").trim();
  if (cleaned.startsWith("http")) return cleaned;
  if (!cleaned.startsWith("/")) return `/${cleaned.replace(/^public\//i, "")}`;
  return cleaned;
}

export function formatINR(n: number) {
  return `₹${(n || 0).toLocaleString("en-IN")}`;
}

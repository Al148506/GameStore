 export function normalizeRating(raw: string): string {
  if (!raw || raw.trim() === "") return "RP"; // vacío → RP

  const value = raw.trim().toLowerCase();

  if (value.includes("m")) return "M";
  if (value.includes("teen") || value === "t") return "T";
  if (value.includes("everyone 10") || value === "e10") return "E10";
  if (value.includes("everyone") || value === "e") return "E";
  if (value.includes("adults only") || value === "ao") return "AO";
  if (value.includes("pending") || value === "rp") return "RP";

  // fallback por si acaso
  return "RP";
}

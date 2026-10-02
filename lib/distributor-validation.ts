export function parseCoordinate(value: unknown): string | undefined {
  if (typeof value === "number") {
    return Number.isFinite(value) ? String(value) : undefined;
  }

  if (typeof value !== "string") {
    return undefined;
  }

  const coordinate = value.trim();
  return coordinate && Number.isFinite(Number(coordinate)) ? coordinate : undefined;
}
